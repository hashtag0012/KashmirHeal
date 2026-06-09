
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
    const startTime = Date.now();
    const errors: string[] = [];

    // Simulate 100 concurrent signups
    const signupPromises = Array.from({ length: 100 }).map(async (_, i) => {
        const id = crypto.randomUUID();
        try {
            return await prisma.user.create({
                data: {
                    email: `stress-${id}@test.com`,
                    name: `Test User ${i}`,
                    role: "DOCTOR",
                    doctorProfile: {
                        create: {
                            name: `Dr. Stress ${i}`,
                            specialization: "Performance Cardiology",
                            district: "Srinagar",
                            status: "Active",
                            fees: 500,
                            experience: "10 years",
                            licenseNumber: `LIC-${id}`,
                            image: "",
                            description: "Test description for performance verification"
                        }
                    }
                }
            });
        } catch (e: any) {
            errors.push(e.message);
            return null;
        }
    });

    const completed = await Promise.all(signupPromises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Cleanup test data to keep the DB clean
    try {
        await prisma.user.deleteMany({
            where: { email: { contains: `@test.com` } }
        });
    } catch (e) {}

    return NextResponse.json({
        total_requested: 100,
        successful: completed.filter(Boolean).length,
        errors: errors.length,
        error_details: errors.slice(0, 5),
        duration_ms: duration,
        signups_per_second: (100 / (duration / 1000)).toFixed(2)
    });
}
