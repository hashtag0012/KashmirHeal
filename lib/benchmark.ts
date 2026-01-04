import { prisma } from "./db";

async function benchmark() {
    console.log("Starting performance benchmark...");

    // 1. Fetching first 50 doctors (standard search)
    const startDoctors = Date.now();
    const doctors = await prisma.doctor.findMany({ take: 50 });
    const endDoctors = Date.now();
    console.log(`[PASS] Fetched 50 doctors in ${endDoctors - startDoctors}ms`);

    // 2. Fetching doctors with filters
    const startFiltered = Date.now();
    const filtered = await prisma.doctor.findMany({
        where: {
            specialization: "Cardiology",
            district: "Srinagar",
        },
        take: 50
    });
    const endFiltered = Date.now();
    console.log(`[PASS] Fetched filtered doctors (Cardiology/Srinagar) in ${endFiltered - startFiltered}ms (Results: ${filtered.length})`);

    // 3. Fetching appointments for a random doctor
    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
    const startAppointments = Date.now();
    const appointments = await prisma.appointment.findMany({
        where: { doctorId: randomDoctor.id }
    });
    const endAppointments = Date.now();
    console.log(`[PASS] Fetched appointments for Dr. ${randomDoctor.name} in ${endAppointments - startAppointments}ms (Results: ${appointments.length})`);

    // 4. Counting all records
    const startCount = Date.now();
    const [docCount, appCount, patCount] = await Promise.all([
        prisma.doctor.count(),
        prisma.appointment.count(),
        prisma.patient.count(),
    ]);
    const endCount = Date.now();
    console.log(`[PASS] Total Data: ${docCount} Doctors, ${appCount} Appointments, ${patCount} Patients`);
    console.log(`[PASS] Counted ${docCount + appCount + patCount} records in ${endCount - startCount}ms`);

    const totalTime = endCount - startDoctors;
    console.log(`\nBenchmark Complete! Total execution time: ${totalTime}ms`);
}

benchmark().catch(console.error);
