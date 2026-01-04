
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true
        }
    });

    console.log("Doctor Details:");
    doctors.forEach(doc => {
        console.log(`- Name: ${doc.name}`);
        console.log(`  Email: ${doc.user?.email}`);
        console.log(`  Verification URL: ${doc.verificationUrl}`);
        console.log(`  Status: ${doc.status}`);
        console.log("-------------------");
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
