"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getDoctors(filters: {
    specializations?: string[];
    districts?: string[];
    searchTerm?: string;
    maxFee?: number;
    locationTerm?: string;
}) {
    const { specializations, districts, searchTerm, maxFee, locationTerm } = filters;

    return await prisma.doctor.findMany({
        where: {
            AND: [
                specializations && specializations.length > 0 ? { specialization: { in: specializations } } : {},
                districts && districts.length > 0 ? { district: { in: districts } } : {},
                searchTerm ? {
                    OR: [
                        { name: { contains: searchTerm } },
                        { specialization: { contains: searchTerm } },
                    ]
                } : {},
                locationTerm ? { district: { contains: locationTerm } } : {},
                maxFee ? { fees: { lte: maxFee } } : {},
                { status: "Active" }
            ]
        },
        orderBy: { rating: 'desc' },
        take: 50,
    });
}

// --- ADMIN ACTIONS ---

export async function getAdminStats() {
    const doctors = await prisma.doctor.findMany({
        include: {
            appointments: true
        }
    });

    const totalDoctors = doctors.length;
    const totalAppointments = doctors.reduce((acc, doc) => acc + doc.appointments.length, 0);

    // Calculate Financials (Mocking logic for now as payment is new)
    // In real app, we sum up Appointment.commission
    let totalRevenue = 0;
    let totalCommission = 0;

    const doctorStats = doctors.map(doc => {
        const paidAppts = (doc.appointments as any[]).filter(a => a.paymentStatus === 'Paid').length;
        const unpaidAppts = (doc.appointments as any[]).filter(a => a.paymentStatus === 'Unpaid').length;

        // Mock revenue calculation based on fees * paid appointments
        const revenue = paidAppts * (doc.fees || 0);
        const commission = revenue * 0.10; // 10% commission

        totalRevenue += revenue;
        totalCommission += commission;

        return {
            ...doc,
            paidAppts,
            unpaidAppts,
            totalRevenue: revenue,
            commission
        };
    });

    return {
        totalDoctors,
        totalAppointments,
        totalRevenue,
        totalCommission,
        doctorStats
    };
}

export async function approveDoctor(doctorId: string) {
    const doctor = await prisma.doctor.update({
        where: { id: doctorId },
        data: { status: "Active" },
        include: { user: true }
    });

    if (doctor.userId) {
        await prisma.user.update({
            where: { id: doctor.userId },
            data: { role: "DOCTOR" }
        });
    }

    revalidatePath("/admin");
    return { success: true };
}

export async function terminateDoctor(doctorId: string) {
    try {
        // 1. First, delete all appointments for this doctor
        await prisma.appointment.deleteMany({
            where: { doctorId }
        });

        // 2. Delete all reviews for this doctor
        await prisma.review.deleteMany({
            where: { doctorId }
        });

        // 3. Delete the doctor profile
        await prisma.doctor.delete({
            where: { id: doctorId }
        });

        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error terminating doctor:", error);
        return { success: false, error: (error as any).message };
    }
}

export async function getAppointments(doctorId?: string) {
    return await prisma.appointment.findMany({
        where: doctorId ? { doctorId } : {},
        orderBy: { createdAt: 'desc' },
        include: {
            doctor: true,
            patient: true
        }
    });
}



export async function getDoctorById(id: string) {
    return await prisma.doctor.findUnique({
        where: { id },
        include: {
            appointments: {
                take: 10,
                orderBy: { createdAt: 'desc' }
            }
        }
    });
}



export async function getPatientDetails(patientId: string) {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: {
                appointments: {
                    orderBy: { date: 'desc' },
                    take: 5
                }
            }
        });
        return patient;
    } catch (error) {
        console.error("Error fetching patient:", error);
        return null;
    }
}



export async function applyAsDoctor(data: {
    name: string;
    license: string;
    specialization: string;
    experience: string;
    fees: number;
    description: string;
    district: string;
    userId?: string;
}) {
    console.log("Applying as doctor:", data);
    try {
        const doctor = await prisma.doctor.create({
            data: {
                name: data.name,
                specialization: data.specialization,
                experience: data.experience,
                fees: data.fees,
                description: data.description,
                district: data.district,
                status: "Pending",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400", // Default doctor image
                // @ts-ignore
                userId: data.userId,
            }
        });
        console.log("Doctor created:", doctor);

        return { success: true, doctor };
    } catch (error) {
        console.error("Error applying as doctor:", error);
        return { success: false, error: "Failed to submit application: " + (error as any).message };
    }
}

// --- DOCTOR ACTIONS ---

export async function getDoctorDashboardData(email: string) {
    const doctor = await prisma.doctor.findFirst({
        where: { user: { email } },
        include: {
            appointments: {
                include: { patient: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!doctor) return null;

    const today = new Date().toDateString();
    const todayAppointments = doctor.appointments.filter(a => new Date(a.date).toDateString() === today);
    const pendingAppointments = doctor.appointments.filter(a => a.status === 'pending');

    const appointmentsWithUserPhone = await Promise.all(doctor.appointments.map(async (apt) => {
        if (!apt.contact) {
            const patientUser = await prisma.user.findUnique({
                where: { email: apt.patient.email || "" },
                select: { phone: true } as any
            });
            return {
                ...apt,
                contact: (patientUser as any)?.phone || apt.contact
            };
        }
        return apt;
    }));

    return {
        doctor,
        appointments: appointmentsWithUserPhone,
        stats: {
            todayCount: todayAppointments.length,
            pendingCount: pendingAppointments.length,
            totalPatients: new Set(doctor.appointments.map(a => a.patientId)).size,
            rating: doctor.rating
        }
    };
}

export async function toggleAvailability(doctorId: string) {
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new Error("Doctor not found");

    await prisma.doctor.update({
        where: { id: doctorId },
        data: { isAvailable: !doctor.isAvailable }
    });

    revalidatePath("/doctor/dashboard");
    return { success: true };
}

export async function respondToAppointment(appointmentId: string, action: 'confirmed' | 'cancelled') {
    const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: action },
        include: {
            doctor: true,
            patient: true
        }
    });

    if (action === 'confirmed') {
        const patientUser = await prisma.user.findUnique({
            where: { email: appointment.patient.email || "" }
        });

        if (patientUser) {
            const mapsText = (appointment.doctor as any).mapsUrl
                ? ` Google Maps: ${(appointment.doctor as any).mapsUrl}`
                : "";

            await prisma.notification.create({
                data: {
                    userId: patientUser.id,
                    title: "Appointment Confirmed!",
                    message: `Dr. ${appointment.doctor.name} has confirmed your appointment. Clinic Location: ${appointment.doctor.district}.${mapsText} You can call the doctor at ${(appointment.doctor as any).phone}.`,
                    type: "success"
                }
            });
        }
    }

    revalidatePath("/doctor/dashboard");
    return appointment;
}

export async function updateDoctorSettings(doctorId: string, data: any) {
    console.log("Updating doctor settings for:", doctorId, data);
    try {
        const fees = (data.fees !== undefined && data.fees !== null && data.fees !== "")
            ? parseInt(data.fees.toString().replace(/[^0-9]/g, ""), 10)
            : undefined;

        await prisma.doctor.update({
            where: { id: doctorId },
            data: {
                description: data.description,
                fees: isNaN(fees as any) ? undefined : fees,
                experience: data.experience,
                district: data.district,
                phone: data.phone,
                mapsUrl: data.mapsUrl,
            } as any
        });
        revalidatePath("/doctor/dashboard");
        revalidatePath("/admin");
        revalidatePath(`/doctor/${doctorId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating doctor settings:", error);
        return { success: false, error: (error as any).message };
    }
}

export async function submitReview(doctorId: string, patientEmail: string, rating: number, comment: string) {
    try {
        const patient = await prisma.patient.findUnique({
            where: { email: patientEmail }
        });

        if (!patient) throw new Error("Patient profile not found");

        const review = await prisma.review.create({
            data: {
                doctorId,
                patientId: patient.id,
                rating,
                comment
            }
        });

        // Update doctor stats
        const reviews = await (prisma as any).review.findMany({
            where: { doctorId }
        });

        const avgRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length;

        await prisma.doctor.update({
            where: { id: doctorId },
            data: {
                rating: avgRating,
                reviews: reviews.length
            }
        });

        revalidatePath(`/doctor/${doctorId}`);
        return { success: true, review };
    } catch (error) {
        console.error("Error submitting review:", error);
        return { success: false, error: (error as any).message };
    }
}

export async function getDoctorReviews(doctorId: string) {
    try {
        return await prisma.review.findMany({
            where: { doctorId },
            include: {
                patient: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}








