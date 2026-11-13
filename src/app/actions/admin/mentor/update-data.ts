// app/actions/admin/mentor/update-data.ts
"use server";

import { randomUUID } from "node:crypto";
import { mkdir, rename, unlink } from "node:fs/promises";
import path from "node:path";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { mentorAchievement, mentorEducation, mentorNonformalEducation, mentorPersonal } from "@/db/schema"; // adjust to where your table is exported
import { isTempUploadId, tempUploadPath } from "@/lib/temp-upload";
// import { requireAdmin } from "@/lib/auth"; // must throw / redirect when the caller is not an admin

const FIELDS = [
    "name",
    "nip",
    "nik",
    "phone",
    "sex",
    "pob",
    "dob",
    "religion",
    "marriageStatus",
    "xOfSiblings",
    "siblings",
    "address",
    "ktpAddress",
] as const;

export type FieldName = (typeof FIELDS)[number];

export type UpdateMentorState = {
    ok: boolean;
    message?: string;
    errors?: Partial<Record<FieldName, string>>;
    /** Echoed back so the form keeps what the admin typed after a failed save. */
    values?: Partial<Record<FieldName, string>>;
};


// "" -> null, "3" -> 3, anything else -> NaN
function toCount(value: string) {
    if (value === "") return null;
    return /^\d+$/.test(value) ? Number(value) : Number.NaN;
}

export async function updateMentorPersonal(
    id: number,
    _prev: UpdateMentorState,
    formData: FormData,
): Promise<UpdateMentorState> {
    // Server actions are public POST endpoints: always authorize here,
    // not only in the page that renders the form.
    // await requireAdmin();

    if (!Number.isInteger(id)) {
        return { ok: false, message: "ID mentor tidak valid." };
    }

    const values = Object.fromEntries(
        FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim()]),
    ) as Record<FieldName, string>;

    const errors: Partial<Record<FieldName, string>> = {};

    if (!values.name) errors.name = "Nama wajib diisi.";
    if (values.nik && !/^\d{16}$/.test(values.nik)) {
        errors.nik = "NIK harus terdiri dari 16 digit angka.";
    }
    if (values.phone && !/^\+?[0-9\s-]{8,20}$/.test(values.phone)) {
        errors.phone = "Nomor telepon tidak valid.";
    }

    // Date inputs give "YYYY-MM-DD". Parse as UTC so the day never shifts with server timezone.
    const dob = values.dob ? new Date(`${values.dob}T00:00:00.000Z`) : null;
    if (dob && (Number.isNaN(dob.getTime()) || dob.getTime() > Date.now())) {
        errors.dob = "Tanggal lahir tidak valid.";
    }

    const xOfSiblings = toCount(values.xOfSiblings);
    const siblings = toCount(values.siblings);
    if (Number.isNaN(xOfSiblings)) errors.xOfSiblings = "Isi dengan angka.";
    if (Number.isNaN(siblings)) errors.siblings = "Isi dengan angka.";
    if (!errors.xOfSiblings && !errors.siblings) {
        if ((xOfSiblings === null) !== (siblings === null)) {
            const field = xOfSiblings === null ? "xOfSiblings" : "siblings";
            errors[field] = "Isi anak ke- dan jumlah bersaudara sekaligus.";
        } else if (xOfSiblings !== null && siblings !== null) {
            if (xOfSiblings < 1) errors.xOfSiblings = "Minimal 1.";
            else if (xOfSiblings > siblings) {
                errors.xOfSiblings = "Tidak boleh melebihi jumlah bersaudara.";
            }
        }
    }

    if (Object.keys(errors).length > 0) {
        return {
            ok: false,
            message: "Periksa kembali isian yang ditandai.",
            errors,
            values,
        };
    }

    try {
        await db
            .update(mentorPersonal)
            .set({
                name: values.name,
                nip: values.nip, // stored as "" when empty (the page already treats "" as empty)
                nik: values.nik,
                phone: orNull(values.phone),
                sex: values.sex =="male" ? "male" : "female",
                pob: orNull(values.pob),
                dob,
                religion: values.religion,
                marriageStatus: values.marriageStatus == "married" ? "married" : "single",
                xOfSiblings: values.xOfSiblings,
                siblings: values.siblings,
                address: orNull(values.address),
                ktpAddress: orNull(values.ktpAddress),
            })
            .where(eq(mentorPersonal.id, id));
    } catch (error) {
        console.error("updateMentorPersonal failed", error);
        return {
            ok: false,
            message: "Perubahan gagal disimpan. Coba lagi, atau periksa apakah NIK/NIP sudah dipakai mentor lain.",
            values,
        };
    }

    revalidatePath(`/admin/mentor/${id}`);
    revalidatePath("/admin/mentor");

    return { ok: true, message: "Perubahan berhasil disimpan." };
}



export type RecordState = {
    ok: boolean;
    message?: string;
    errors?: Record<string, string>;
    /** Echoed back so the form keeps what the admin typed after a failed save. */
    values?: Record<string, string>;
};

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function readFields<T extends string>(formData: FormData, fields: readonly T[]) {
    return Object.fromEntries(
        fields.map((field) => [field, String(formData.get(field) ?? "").trim()]),
    ) as Record<T, string>;
}

const orNull = (value: string) => (value === "" ? null : value);

const isDate = (value: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());

// Parsed as UTC so the stored day never shifts with the server timezone.
// If a column is declared with { mode: "string" }, pass the "YYYY-MM-DD" string instead.
const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

const hasBadId = (...ids: (number | null)[]) =>
    ids.some((id) => id !== null && !Number.isInteger(id));

const BAD_ID: RecordState = { ok: false, message: "Data tidak valid." };

const invalid = (errors: Record<string, string>, values: Record<string, string>): RecordState => ({
    ok: false,
    message: "Periksa kembali isian yang ditandai.",
    errors,
    values,
});

function failed(error: unknown, values: Record<string, string>): RecordState {
    console.error("mentor record save failed", error);
    return { ok: false, message: "Perubahan gagal disimpan. Coba lagi.", values };
}

function saved(mentorId: number): RecordState {
    revalidatePath(`/admin/mentor/${mentorId}`);
    return { ok: true };
}

/* -------------------------------------------------------------------------- */
/*                               Formal education                             */
/* -------------------------------------------------------------------------- */

const EDUCATION_FIELDS = [
    "institutionName",
    "eduLevel",
    "department",
    "startedYear",
    "isGraduated",
    "graduatedDate",
    "gpa",
] as const;

// `educationId` null = insert, a number = update. Updates are scoped to the mentor
// so a tampered id can't edit another mentor's record.
export async function saveEducation(
    mentorId: number,
    educationId: number | null,
    _prev: RecordState,
    formData: FormData,
): Promise<RecordState> {
    // await requireAdmin();
    if (hasBadId(mentorId, educationId)) return BAD_ID;

    const v = readFields(formData, EDUCATION_FIELDS);
    const errors: Record<string, string> = {};
    const thisYear = new Date().getFullYear();
    const year = Number(v.startedYear);
    const gpa = v.gpa.replace(",", ".");
    const graduated = v.isGraduated === "1";

    if (!v.institutionName) errors.institutionName = "Nama institusi wajib diisi.";
    if (!v.eduLevel) errors.eduLevel = "Pilih jenjang pendidikan.";
    if (!/^\d{4}$/.test(v.startedYear) || year < 1950 || year > thisYear) {
        errors.startedYear = `Isi tahun antara 1950 dan ${thisYear}.`;
    }
    if (v.isGraduated !== "0" && v.isGraduated !== "1") {
        errors.isGraduated = "Pilih status kelulusan.";
    }
    if (graduated) {
        if (!isDate(v.graduatedDate)) {
            errors.graduatedDate = "Isi tanggal lulus yang valid.";
        } else if (!errors.startedYear && toDate(v.graduatedDate).getUTCFullYear() < year) {
            errors.graduatedDate = "Tanggal lulus tidak boleh sebelum tahun masuk.";
        }
    }
    // if (gpa && !(/^\d(\.\d{1,2})?$/.test(gpa) && Number(gpa) <= 4)) {
    //     errors.gpa = "IPK harus berupa angka 0–4.";
    // }
    if (Object.keys(errors).length > 0) return invalid(errors, v);

    const data = {
        institutionName: v.institutionName,
        eduLevel: v.eduLevel,
        department: v.department,
        startedYear: year.toString(),
        isGraduated: graduated ? 1 : 0,
        graduatedDate: graduated ? toDate(v.graduatedDate) : null,
        gpa: gpa, 
        mentorPersonalId: mentorId
    };

    try {
        if (educationId === null) {
            await db.insert(mentorEducation).values(data);
        } else {
            await db
                .update(mentorEducation)
                .set(data)
                .where(and(eq(mentorEducation.id, educationId), eq(mentorEducation.mentorPersonalId, mentorId)));
        }
    } catch (error) {
        return failed(error, v);
    }
    return saved(mentorId);
}

/* -------------------------------------------------------------------------- */
/*                                Achievements                                */
/* -------------------------------------------------------------------------- */

// Achievement attachment files: the generic uploadFile action leaves the file in public/uploads,
// and this action moves + renames it into public/mentor/achievement when the record is saved.
const ACHIEVEMENT_DIR = path.join(process.cwd(), "public", "mentor", "achievement");
const ACHIEVEMENT_URL = "/mentor/achievement"; // what is stored in the `attachment` column
const ACHIEVEMENT_FILE =
    /^achievement-\d+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|jpg|png|webp)$/;

// Only names generated below can be turned back into a path (the href comes from the database).
function achievementFileName(href: string | null | undefined) {
    if (!href?.startsWith(`${ACHIEVEMENT_URL}/`)) return null;
    const name = href.slice(ACHIEVEMENT_URL.length + 1);
    return ACHIEVEMENT_FILE.test(name) ? name : null;
}

// public/uploads/<tempId> -> public/mentor/achievement/achievement-<mentorId>-<uuid>.<ext>
// Returns the href to store, or null when the temporary file is invalid or no longer there.
async function moveAchievementUpload(tempId: string, mentorId: number) {
    const from = tempUploadPath(tempId); // null unless tempId is a name uploadFile generated
    if (!from) return null;

    const extension = tempId.slice(tempId.lastIndexOf(".") + 1);
    const name = `achievement-${mentorId}-${randomUUID()}.${extension}`;

    try {
        await mkdir(ACHIEVEMENT_DIR, { recursive: true });
        await rename(from, path.join(ACHIEVEMENT_DIR, name)); // same disk, so this is an atomic move
    } catch (error) {
        console.error("moveAchievementUpload failed", error);
        return null;
    }
    return `${ACHIEVEMENT_URL}/${name}`;
}

// Undo the move when the database write fails: FilePond still holds the temp id, so a retry works.
async function undoAchievementMove(href: string, tempId: string) {
    const name = achievementFileName(href);
    const to = tempUploadPath(tempId);
    if (!name || !to) return;
    try {
        await rename(path.join(ACHIEVEMENT_DIR, name), to);
    } catch (error) {
        console.error("undoAchievementMove failed", error);
    }
}

// Delete a saved attachment after it was replaced or removed. Ignores external links and unknown names.
async function deleteAchievementFile(href: string | null | undefined) {
    const name = achievementFileName(href);
    if (!name) return;
    try {
        await unlink(path.join(ACHIEVEMENT_DIR, name));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("deleteAchievementFile failed", error);
    }
}

// `attachment` is not typed text: FilePond uploads the file first (see upload-file.ts)
// and the form posts the temporary file id in this field.
const ACHIEVEMENT_FIELDS = ["name", "rank", "scope", "desc"] as const;

export async function saveAchievement(
    mentorId: number,
    achievementId: number | null,
    _prev: RecordState,
    formData: FormData,
): Promise<RecordState> {
    // await requireAdmin();
    if (hasBadId(mentorId, achievementId)) return BAD_ID;

    const v = readFields(formData, ACHIEVEMENT_FIELDS);
    const errors: Record<string, string> = {};

    const tempId = String(formData.get("attachment") ?? "").trim(); // "" when no new file was uploaded
    const removeCurrent = formData.get("removeAttachment") === "1";

    if (!v.name) errors.name = "Nama prestasi wajib diisi.";
    if (tempId && !isTempUploadId(tempId)) errors.attachment = "Lampiran tidak valid. Unggah ulang file.";
    if (Object.keys(errors).length > 0) return invalid(errors, v);

    // On update, load the current attachment: the form doesn't send it, and
    // we need it to keep it by default and to delete the old file after a replace/remove.
    let previous: string | null = null;
    if (achievementId !== null) {
        const [current] = await db
            .select({ attachment: mentorAchievement.attachment })
            .from(mentorAchievement)
            .where(and(eq(mentorAchievement.id, achievementId), eq(mentorAchievement.mentorPersonalId, mentorId)))
            .limit(1);
        if (!current) return { ok: false, message: "Data prestasi tidak ditemukan.", values: v };
        previous = current.attachment;
    }

    let attachment = previous; // keep the current one unless told otherwise
    let committed: string | null = null;
    if (tempId) {
        // Step 2 of the upload: move + rename the file FilePond uploaded.
        const href = await moveAchievementUpload(tempId, mentorId);
        if (!href) {
            return invalid({ attachment: "File tidak ditemukan di server. Unggah ulang file." }, v);
        }
        attachment = committed = href;
    } else if (removeCurrent) {
        attachment = null;
    }

    const data = {
        name: v.name,
        rank: orNull(v.rank),
        scope: orNull(v.scope),
        desc: orNull(v.desc),
        attachment,
        mentorPersonalId: mentorId
    };

    try {
        if (achievementId === null) {
            await db.insert(mentorAchievement).values(data);
        } else {
            await db
                .update(mentorAchievement)
                .set(data)
                .where(and(eq(mentorAchievement.id, achievementId), eq(mentorAchievement.mentorPersonalId, mentorId)));
        }
    } catch (error) {
        // Put the file back in public/uploads: FilePond still holds its id, so a retry works.
        if (committed) await undoAchievementMove(committed, tempId);
        return failed(error, v);
    }

    // Only after the row is saved: delete the file that was replaced or removed.
    if (previous && previous !== attachment) await deleteAchievementFile(previous);
    return saved(mentorId);
}

/* -------------------------------------------------------------------------- */
/*                             Non-formal education                           */
/* -------------------------------------------------------------------------- */

const NONFORMAL_FIELDS = [
    "trainingPurpose",
    "institutionName",
    "certNumber",
    "trainingDate",
    "issuedUntil",
] as const;

export async function saveNonformal(
    mentorId: number,
    trainingId: number | null,
    _prev: RecordState,
    formData: FormData,
): Promise<RecordState> {
    // await requireAdmin();
    if (hasBadId(mentorId, trainingId)) return BAD_ID;

    const v = readFields(formData, NONFORMAL_FIELDS);
    const errors: Record<string, string> = {};

    if (!v.trainingPurpose) errors.trainingPurpose = "Nama pelatihan wajib diisi.";
    if (!v.institutionName) errors.institutionName = "Lembaga penyelenggara wajib diisi.";
    if (!isDate(v.trainingDate)) errors.trainingDate = "Isi tanggal pelatihan yang valid.";
    if (v.issuedUntil) {
        if (!isDate(v.issuedUntil)) {
            errors.issuedUntil = "Tanggal tidak valid.";
        } else if (!errors.trainingDate && toDate(v.issuedUntil) < toDate(v.trainingDate)) {
            errors.issuedUntil = "Tidak boleh sebelum tanggal pelatihan.";
        }
    }
    if (Object.keys(errors).length > 0) return invalid(errors, v);

    const data = {
        trainingPurpose: v.trainingPurpose,
        institutionName: v.institutionName,
        certNumber: v.certNumber,
        trainingDate: toDate(v.trainingDate),
        issuedUntil: v.issuedUntil,
        mentorPersonalId: mentorId
    };

    try {
        if (trainingId === null) {
            await db.insert(mentorNonformalEducation).values(data);
        } else {
            await db
                .update(mentorNonformalEducation)
                .set(data)
                .where(
                    and(
                        eq(mentorNonformalEducation.id, trainingId),
                        eq(mentorNonformalEducation.mentorPersonalId, mentorId),
                    ),
                );
        }
    } catch (error) {
        return failed(error, v);
    }
    return saved(mentorId);
}