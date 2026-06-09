
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// In-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_UPLOADS = 5; // 5 uploads per minute

// Whitelists
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];
const ALLOWED_MIMES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function verifyMagicBytes(buffer: Buffer, ext: string): boolean {
    if (buffer.length < 4) return false;
    
    if (ext === "pdf") {
        // %PDF
        return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
    }
    if (ext === "png") {
        // PNG header: 89 50 4E 47
        return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    }
    if (ext === "jpg" || ext === "jpeg") {
        // JPEG SOI: FF D8 FF
        return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    }
    return false;
}

export async function POST(req: Request) {
    try {
        // 1. Authentication Guard
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized: Authentication required" }, { status: 401 });
        }

        const userId = (session.user as any).id || session.user.email || "anonymous";

        // 2. Rate Limiting Check
        const now = Date.now();
        const userLimit = rateLimitMap.get(userId);
        if (!userLimit) {
            rateLimitMap.set(userId, { count: 1, lastReset: now });
        } else {
            if (now - userLimit.lastReset > LIMIT_WINDOW) {
                userLimit.count = 1;
                userLimit.lastReset = now;
            } else {
                if (userLimit.count >= MAX_UPLOADS) {
                    return NextResponse.json(
                        { error: "Too many requests. Please wait before uploading more files." },
                        { status: 429 }
                    );
                }
                userLimit.count++;
            }
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 3. File Size Validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File size exceeds the 10MB limit" }, { status: 400 });
        }

        // 4. File Extension and MIME Type Validation
        const originalName = file.name || "";
        const parts = originalName.split('.');
        const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : "";

        if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
            return NextResponse.json({ error: "Invalid file extension. Only PDF, JPG, JPEG, and PNG are allowed." }, { status: 400 });
        }

        if (!ALLOWED_MIMES.includes(file.type)) {
            return NextResponse.json({ error: "Invalid MIME type. Only PDF and image uploads are allowed." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 5. Magic Bytes Verification
        if (!verifyMagicBytes(buffer, ext)) {
            return NextResponse.json({ error: "File verification failed. The file contents do not match its extension." }, { status: 400 });
        }

        // 6. Filename Sanitization
        const fileName = `${uuidv4()}.${ext}`;
        const uploadDir = join(process.cwd(), "public", "uploads");
        const path = join(uploadDir, fileName);

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        await writeFile(path, buffer);

        const url = `/uploads/${fileName}`;
        return NextResponse.json({ url });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "File upload failed" }, { status: 500 });
    }
}

