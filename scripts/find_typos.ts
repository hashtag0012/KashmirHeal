import { prisma } from "../lib/db";

async function findTypos() {
    const users = await prisma.user.findMany({
        where: {
            email: { contains: "gmai.com" }
        }
    });
    console.log("Found users with gmai.com:", users.map(u => `${u.email} -> ${u.role}`));
}

findTypos()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
