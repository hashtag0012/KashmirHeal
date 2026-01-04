
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const doctor = await prisma.doctor.findFirst({
        where: {
            user: {
                email: "aa.qureshi11233@gmail.com"
            }
        },
        include: {
            user: true
        }
    });

    if (doctor) {
        console.log("Doctor Found:");
        console.log(`- Name: ${doctor.name}`);
        console.log(`  Email: ${doctor.user?.email}`);
        console.log(`  Verification URL: ${doctor.verificationUrl}`);
        console.log(`  Status: ${doctor.status}`);
    } else {
        console.log("Doctor aa.qureshi11233@gmail.com not found.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
