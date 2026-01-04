import { prisma } from "../lib/db";

async function findUserVariations() {
    const users = await prisma.user.findMany({
        where: {
            email: { contains: "ytop4444" }
        }
    });
    console.log("Found users with ytop4444:", users.map(u => `${u.email} -> ${u.role}`));
}

findUserVariations()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
