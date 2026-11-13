// lib/temp-upload.ts
//
// Generic first step of a two-step upload. It knows nothing about achievements or any other feature.
//   1. The `uploadFile` server action stores the file here -> public/uploads/<uuid>.<ext>
//   2. The server action that saves your record moves/renames it to its final folder
//      (see saveAchievement in app/actions/admin/mentor/update-data.ts for an example).
//
// Policy: PDF, JPG, PNG and WEBP up to 5 MB. To allow another type, add its signature to
// sniffExtension and its extension to EXT.
import { randomUUID } from "node:crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const TEMP_UPLOAD_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const TEMP_DIR = path.join(process.cwd(), "public", "uploads");
const EXT = "(pdf|jpg|png|webp)";
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const TEMP_PATTERN = new RegExp(`^${UUID}\\.${EXT}$`);

const hasBytes = (bytes: Uint8Array, signature: number[], offset = 0) =>
    signature.every((value, index) => bytes[offset + index] === value);

// Decide the type from the file's own bytes: the browser-supplied MIME type and
// file name can be spoofed, the magic number cannot.
function sniffExtension(bytes: Uint8Array): "pdf" | "jpg" | "png" | "webp" | null {
    if (hasBytes(bytes, [0x25, 0x50, 0x44, 0x46])) return "pdf"; // %PDF
    if (hasBytes(bytes, [0xff, 0xd8, 0xff])) return "jpg";
    if (hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
    if (hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
        return "webp"; // RIFF....WEBP
    }
    return null;
}

// true = the file is gone (deleted now, or it was already missing)
async function unlinkQuietly(filePath: string) {
    try {
        await unlink(filePath);
        return true;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return true;
        console.error("temp upload unlink failed", error);
        return false;
    }
}

/** Is this a name that storeTempUpload generated? Check this before trusting an id from the client. */
export const isTempUploadId = (id: string) => TEMP_PATTERN.test(id);

/** The path of a temporary upload on disk, or null if `id` isn't a name we generated (so it can't point elsewhere). */
export function tempUploadPath(id: string) {
    return TEMP_PATTERN.test(id) ? path.join(TEMP_DIR, id) : null;
}

/** Validates the file and writes it to public/uploads under a generated name. */
export async function storeTempUpload(file: File): Promise<{ id: string } | { error: string }> {
    if (file.size > TEMP_UPLOAD_MAX_BYTES) return { error: "Ukuran file maksimal 5 MB." };

    const bytes = new Uint8Array(await file.arrayBuffer());
    const extension = sniffExtension(bytes);
    if (!extension) return { error: "Format file harus PDF, JPG, PNG, atau WEBP." };

    // The uploaded file name is never used in a path.
    const id = `${randomUUID()}.${extension}`;
    await mkdir(TEMP_DIR, { recursive: true });
    await writeFile(path.join(TEMP_DIR, id), bytes);
    return { id };
}

/** Deletes a temporary upload (FilePond "revert"). Only accepts ids this module generated. */
export async function deleteTempUpload(id: string) {
    const filePath = tempUploadPath(id);
    return filePath ? unlinkQuietly(filePath) : false;
}

/** Removes temp files that nobody saved (closed tab, abandoned dialog). Only touches our own files. */
export async function sweepTempUploads(maxAgeMs = 24 * 60 * 60 * 1000) {
    try {
        const now = Date.now();
        for (const name of await readdir(TEMP_DIR)) {
            if (!TEMP_PATTERN.test(name)) continue;
            const filePath = path.join(TEMP_DIR, name);
            const { mtimeMs } = await stat(filePath);
            if (now - mtimeMs > maxAgeMs) await unlinkQuietly(filePath);
        }
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("sweepTempUploads failed", error);
    }
}