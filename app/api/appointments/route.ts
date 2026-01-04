import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { doctorId, patientName, date, time, reason, phone } = body;

        // Ensure User has a Patient profile (or use User ID directly with implicit Patient Role)
        // For now, let's look up or create a Patient record linked to this User
        // If your schema has Patient linked to User, use that.
        // Current schema: Patient model has email @unique, but no direct Users link?
        // Wait, schema has User with role.
        // Let's check schema again.
        // Model Patient has `email String? @unique`.

        // Let's find Patient by email
        let patient = await prisma.patient.findUnique({
            where: { email: session.user.email }
        });

        // Create patient profile if distinct from User
        if (!patient) {
            // @ts-ignore
            patient = await prisma.patient.create({
                data: {
                    name: patientName || session.user.name || "Unknown Patient",
                    email: session.user.email,
                    // @ts-ignore
                    image: session.user.image,
                }
            });
        }

        // Fetch patient's phone from User record if not provided
        let contactPhone = phone;
        if (!contactPhone) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { phone: true } as any
            });
            contactPhone = (user as any)?.phone;
        }

        const appointment = await prisma.appointment.create({
            data: {
                doctorId,
                patientId: patient.id,
                patientName: patient.name,
                time,
                date: new Date(date).toISOString().split('T')[0],
                contact: contactPhone,
                status: "pending"
            }
        });

        // Trigger Notification for Doctor (if doctor linked to user)
        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        // @ts-ignore
        if (doctor?.userId) {
            // @ts-ignore
            await prisma.notification.create({
                data: {
                    // @ts-ignore
                    userId: doctor.userId,
                    title: "New Appointment Request",
                    message: `New booking from ${patient.name} for ${date} at ${time}.`,
                    type: "info"
                }
            });
        }

        return NextResponse.json({ success: true, appointment });

    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
