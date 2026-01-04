
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const doctorCount = await prisma.doctor.count();
        const patientCount = await prisma.patient.count();
        const appointmentCount = await prisma.appointment.count();
        const userCount = await prisma.user.count();

        console.log("Database Counts:");
        console.log(`Doctors: ${doctorCount}`);
        console.log(`Patients: ${patientCount}`);
        console.log(`Appointments: ${appointmentCount}`);
        console.log(`Users: ${userCount}`);
    } catch (error) {
        console.error("Error connecting to database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
