
import * as z from "zod";

export const mentorSchema = z.object({
    personalData: z.object({
        // --- Data Login ---
        email: z.email("Format email tidak valid"),
        password: z.string(),

        // --- Data Profil (Sesuai Database) ---
        profile_image: z.string().nullable().optional(),
        nik: z.string().min(16, "NIK wajib 16 digit").max(32),
        name: z.string().min(1, "Nama lengkap wajib diisi").max(100),
        nip: z.string().max(18, "Maksimal 18 karakter").optional(),
        pob: z.string().min(1, "Tempat lahir wajib diisi"),
        dob: z.string().min(1, "Tanggal lahir wajib diisi"),
        address: z.string().min(1, "Alamat wajib diisi"),
        ktp_address: z.string().max(150),
        marriage_status: z.enum(["single", "married"]).default("single"),
        religion: z.string().min(1, "Agama wajib diisi").max(10),
        siblings: z.string().min(1, "Jumlah saudara wajib diisi").max(2),
        x_of_siblings: z.string().min(1, "Jumlah saudara wajib diisi").max(2),
        sex: z.enum(["male", "female"]).default("male"),
        phone: z.string().min(1, "No HP wajib diisi").max(18, "Nomor HP maksimal 18 digit"),
    }),
    educations: z.array(
        z.object({
            edu_level: z.string().min(1, "Tingkat pendidikan wajib diisi"),
            institution_name: z.string().min(1, "Nama institusi wajib diisi"),
            department: z.string().min(1, "Jurusan wajib diisi"),
            is_graduated: z.enum(["0", "1"]),
            started_year: z.string().length(4, "Tahun harus 4 digit"),
            graduated_date: z.string().optional(),
            gpa: z.string().min(1, "IPK wajib diisi"),
        })
    ).min(1, "Minimal masukkan satu riwayat pendidikan"),
    achievements: z.array(
        z.object({
            name: z.string(),
            rank: z.string(),
            scope: z.string(),
            attachment: z.string().nullable().optional(),
            desc: z.string(),
        })
    ).optional(),
    nonFormal: z.array(
        z.object({
        institution_name: z.string(),
        cert_number: z.string().optional(),
        issued_until: z.string(),
        training_date: z.string(),
        training_purpose: z.string(),
    })
    ).optional(),
});
export type MentorFormValues = z.infer<typeof mentorSchema>;