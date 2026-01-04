
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split('.').pop();
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
