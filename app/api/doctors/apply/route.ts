import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, specialization, district, experience, fees, phone } = body;

        // Check if doctor profile already exists
        const existingProfile = await prisma.doctor.findFirst({
            where: { userId: session.user.id }
        });

        if (existingProfile) {
            return NextResponse.json({ error: "Application already submitted" }, { status: 400 });
        }

        // Create new Doctor Profile with Pending status
        const doctor = await prisma.doctor.create({
            data: {
                name,
                specialization,
                district,
                experience,
                fees: parseInt(fees),
                description: `Dr. ${name} is a specialist in ${specialization}.`,
                image: session.user.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200", // Default image
                status: "Pending",
                userId: session.user.id,
                // Add default rating/reviews
                rating: 0,
                reviews: 0,
                isAvailable: false
            }
        });

        return NextResponse.json({ success: true, doctor });

    } catch (error) {
        console.error("Doctor application error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
