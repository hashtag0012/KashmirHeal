import { prisma } from "../lib/db";

async function checkUser() {
    const user = await prisma.user.findUnique({
        where: { email: "ytop4444@gmail.com" },
        include: { doctorProfile: true }
    });
    console.log("ROLE:", user?.role);
    console.log("STATUS:", user?.doctorProfile?.status);
    console.log("DOCTOR_ID:", user?.doctorProfile?.id);
}

checkUser()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
