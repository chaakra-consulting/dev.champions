"use server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

// Fungsi untuk upload file
export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) return { error: "Tidak ada file yang diunggah" };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Buat nama file unik
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const path = join(process.cwd(), "public/uploads", filename);

  try {
    await writeFile(path, buffer);
    return { id: filename }; // Kembalikan ID/Nama file untuk disimpan ke database dan dipakai saat revert
  } catch (error) {
    return { error: "Gagal menyimpan file" };
  }
}

// Fungsi untuk revert (menghapus) file
export async function revertFile(filename: string) {
  const path = join(process.cwd(), "public/uploads", filename);
  try {
    await unlink(path);
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus file" };
  }
}