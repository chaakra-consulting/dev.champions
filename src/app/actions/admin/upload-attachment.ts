// app/actions/admin/mentor/upload-file.ts
"use server";

import { deleteTempUpload, storeTempUpload, sweepTempUploads } from "@/lib/temp-upload";
// Reusable first step of any upload. FilePond calls this as soon as a file is chosen or dropped.
// It only stores the file in public/uploads and returns its generated name (`id`). Whatever action
// saves your record is responsible for moving/renaming it (see saveAchievement in update-data.ts).
export async function uploadFile(formData: FormData): Promise<{ id: string } | { error: string }> {
    // await requireAdmin();

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return { error: "Tidak ada file yang diunggah" };
    }

    try {
        const result = await storeTempUpload(file); // checks size + real file type, generates the name
        await sweepTempUploads(); // also clears temp files abandoned for more than 24 hours
        return result;
    } catch (error) {
        console.error("uploadFile failed", error);
        return { error: "Gagal menyimpan file" };
    }
}

// FilePond calls this when the admin removes a file that was already uploaded.
// `filename` is the id returned by uploadFile. It comes from the client, so it is validated
// against the exact format we generate before anything is deleted.
export async function revertFile(filename: string): Promise<{ success: true } | { error: string }> {
    // await requireAdmin();

    return (await deleteTempUpload(filename))
        ? { success: true }
        : { error: "Gagal menghapus file" };
}