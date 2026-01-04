
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { role, phone, specialization, district, license, fees, experience, description, verificationUrl } = body;

        // 1. Update User
        const userData = {
            // @ts-ignore
            phone: phone,
            isOnboarded: true
        };

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: userData as any
        });

        // 2. If Doctor, Create Profile
        if (role === 'DOCTOR') {
            const doctorData = {
                userId: user.id,
                name: user.name || "Doctor",
                image: user.image || "",
                // @ts-ignore
                phone: phone,
                specialization,
                district,
                licenseNumber: license,
                fees,
                experience,
                description,
                verificationUrl,
                status: "Pending" // Must be approved by Admin
            };

            await prisma.doctor.upsert({
                where: { userId: user.id },
                create: doctorData as any,
                update: {
                    // @ts-ignore
                    phone, specialization, district, fees, experience, description, verificationUrl,
                    status: "Pending" // Reset status if they update info
                } as any
            });
        }

        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error("Onboarding Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
