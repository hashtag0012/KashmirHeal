import { prisma } from "../lib/db";

async function listUsers() {
    const users = await prisma.user.findMany({
        select: { email: true, role: true }
    });
    users.forEach(u => console.log(`${u.email} -> ${u.role}`));
}

listUsers()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
