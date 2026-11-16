"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/db"
import { curriculum } from "@/db/schema/curriculum"

// Adjust to the real URL of your admin curriculum page
const CURRICULUM_PATH = "/admin/curriculum"

export type CurriculumFormState = {
    status: "idle" | "success" | "error"
    message?: string
    errors?: Partial<Record<"name" | "desc", string>>
    /** Echoed back on error so the inputs keep what the user typed */
    values?: { name: string; desc: string }
}

const schema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Nama wajib diisi.")
        .max(30, "Nama maksimal 30 karakter."),
    desc: z.string().trim().max(5000, "Deskripsi terlalu panjang."),
})

function parseForm(formData: FormData) {
    const raw = {
        name: String(formData.get("name") ?? ""),
        desc: String(formData.get("desc") ?? ""),
    }
    const result = schema.safeParse(raw)

    if (result.success) {
        return {
            success: true as const,
            raw,
            data: {
                name: result.data.name,
                desc: result.data.desc || null, // empty textarea -> NULL
            },
        }
    }

    const errors: NonNullable<CurriculumFormState["errors"]> = {}
    for (const issue of result.error.issues) {
        const key = issue.path[0]
        if ((key === "name" || key === "desc") && !errors[key]) {
            errors[key] = issue.message
        }
    }
    return { success: false as const, raw, errors }
}

// Used as updateCurriculum.bind(null, id) so it fits useActionState's (state, formData) shape
export async function updateCurriculum(
    id: number,
    _prevState: CurriculumFormState,
    formData: FormData,
): Promise<CurriculumFormState> {
    // await requireAdmin()

    if (!Number.isInteger(id) || id <= 0) {
        return { status: "error", message: "ID kurikulum tidak valid." }
    }

    const parsed = parseForm(formData)
    if (!parsed.success) {
        return { status: "error", errors: parsed.errors, values: parsed.raw }
    }

    try {
        // updatedAt is refreshed automatically by $onUpdateFn in the schema
        const [result] = await db
            .update(curriculum)
            .set(parsed.data)
            .where(eq(curriculum.id, id))

        if (result.affectedRows === 0) {
            return {
                status: "error",
                message: "Kurikulum tidak ditemukan. Mungkin sudah dihapus.",
                values: parsed.raw,
            }
        }
    } catch (error) {
        console.error("updateCurriculum failed:", error)
        return {
            status: "error",
            message: "Gagal memperbarui kurikulum. Silakan coba lagi.",
            values: parsed.raw,
        }
    }

    revalidatePath(CURRICULUM_PATH)
    return { status: "success", message: "Kurikulum berhasil diperbarui." }
}