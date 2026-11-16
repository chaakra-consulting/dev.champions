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

export async function createCurriculum(
    _prevState: CurriculumFormState,
    formData: FormData,
): Promise<CurriculumFormState> {
    // Server actions are public endpoints: always check auth here too.
    // await requireAdmin()

    const parsed = parseForm(formData)
    if (!parsed.success) {
        return { status: "error", errors: parsed.errors, values: parsed.raw }
    }

    try {
        await db.insert(curriculum).values(parsed.data)
    } catch (error) {
        console.error("createCurriculum failed:", error)
        return {
            status: "error",
            message: "Gagal menyimpan kurikulum. Silakan coba lagi.",
            values: parsed.raw,
        }
    }

    revalidatePath(CURRICULUM_PATH)
    return { status: "success", message: "Kurikulum berhasil ditambahkan." }
}
