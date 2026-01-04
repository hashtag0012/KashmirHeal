import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DISTRICTS = ["Srinagar", "Budgam", "Anantnag", "Baramulla", "Kupwara", "Pulwama", "Shopian", "Kulgam", "Ganderbal", "Bandipora"];
const SPECIALIZATIONS = ["Cardiology", "Neurology", "Dermatology", "Pediatrics", "Orthopedics", "General Physician", "Ophthalmology", "ENT", "Oncology", "Psychiatry"];

async function main() {
    console.log("Cleaning up database...");
    await prisma.appointment.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();

    console.log("Seeding 1,000 Doctors...");
    const doctors = [];
    for (let i = 0; i < 1000; i++) {
        doctors.push({
            name: "Dr. " + ["Aadil", "Zara", "Bilal", "Fatima", "Ishfaq", "Suhail", "Mehak", "Omar"][i % 8] + " " + ["Shah", "Khan", "Mir", "Wani", "Rather", "Bhat"][i % 6],
            specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
            district: DISTRICTS[i % DISTRICTS.length],
            fees: 500 + (i % 20) * 100,
            image: "https://images.unsplash.com/photo-" + (1537368910025 + (i % 100)) + "?q=80&w=200&auto=format&fit=crop",
            experience: (10 + (i % 15)) + " Years",
            description: "Dedicated healthcare professional providing expert medical care with a focus on patient well-being and clinical excellence.",
            rating: 4.0 + (i % 10) / 10,
            reviews: 50 + (i % 500),
            status: ["Active", "Active", "Active", "Warning", "Inactive"][i % 5],
            commTaken: (i % 50) * 5000,
            commDue: (i % 10) * 1000
        });
    }
    await prisma.doctor.createMany({ data: doctors });

    console.log("Seeding 5,000 Patients...");
    const patients = [];
    for (let i = 0; i < 5000; i++) {
        patients.push({
            name: "Patient " + (i + 1),
            email: "patient" + (i + 1) + "@example.com"
        });
    }
    await prisma.patient.createMany({ data: patients });

    console.log("Fetching IDs for appointments...");
    const allDoctors = await prisma.doctor.findMany({ select: { id: true } });
    const allPatients = await prisma.patient.findMany({ select: { id: true, name: true } });

    console.log("Seeding 10,000 Appointments...");
    const appointments = [];
    const statuses = ["pending", "confirmed", "completed", "cancelled"];

    for (let i = 0; i < 10000; i++) {
        const doctor = allDoctors[i % allDoctors.length];
        const patient = allPatients[i % allPatients.length];

        appointments.push({
            patientId: patient.id,
            patientName: patient.name,
            doctorId: doctor.id,
            time: (9 + (i % 8)) + ":00 AM",
            date: "2025-12-" + (25 + (i % 5)),
            status: statuses[i % statuses.length],
            address: "Clinic No " + (i % 50) + ", main road, " + DISTRICTS[i % DISTRICTS.length],
            contact: "+91 9419" + (100000 + i)
        });

        if (appointments.length >= 2000) {
            await prisma.appointment.createMany({ data: [...appointments] });
            appointments.length = 0;
            console.log("Inserted " + (i + 1) + " appointments...");
        }
    }

    if (appointments.length > 0) {
        await prisma.appointment.createMany({ data: appointments });
    }

    console.log("Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
