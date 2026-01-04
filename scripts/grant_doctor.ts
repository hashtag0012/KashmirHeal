import { prisma } from "../lib/db";

async function grantDoctorRole(email: string) {
    console.log(`Searching for user with email: ${email}`);
    const user = await prisma.user.findUnique({
        where: { email: email },
        include: { doctorProfile: true }
    });

    if (!user) {
        console.log(`User ${email} not found.`);
        return;
    }

    console.log(`Found user: ${user.id} with role: ${user.role}`);

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { role: "DOCTOR" }
    });

    console.log(`Updated user ${email} to role: ${updatedUser.role}`);

    if (user.doctorProfile) {
        const updatedDoctor = await prisma.doctor.update({
            where: { id: user.doctorProfile.id },
            data: { status: "Active" }
        });
        console.log(`Updated doctor profile ${updatedDoctor.id} to status: Active`);
    } else {
        console.log(`No doctor profile found for ${email}. Creating one...`);
        await prisma.doctor.create({
            data: {
                userId: user.id,
                name: user.name || "Doctor",
                specialization: "General Physician",
                district: "Srinagar",
                fees: 500,
                experience: "5 Years",
                description: "Manually approved doctor.",
                image: user.image || "",
                status: "Active"
            }
        });
        console.log(`Created and activated doctor profile for ${email}.`);
    }
}

const targetEmail = "ytop4444@gmai.com";
grantDoctorRole(targetEmail)
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
