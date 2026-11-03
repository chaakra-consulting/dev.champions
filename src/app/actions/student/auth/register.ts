"use server";

import { db } from "@/db";
import { parentPersonal } from "@/db/schema/parent-personal";
import { studentPersonal } from "@/db/schema/student-personal";
import { auth } from "@/lib/auth";
import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";

// Optional: Define a type for the state returned to the client
export type ActionState = {
    success: boolean;
    message: string;
} | null;

export async function registerStudentAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        // Extract data directly from the FormData object
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const parentEmail = formData.get("parentEmail") as string;
        const parentName = formData.get("parentName") as string;
        // Cast strictly to match your Drizzle enum type
        const parentRelation = formData.get("parentRelation") as "mother" | "father" | "others";
        const parentPhone = formData.get("parentPhone") as string;
        const parentAddress = formData.get("parentAddress") as string;
        const studentName = formData.get("studentName") as string;
        const birthPlace = formData.get("birthPlace") as string;
        const birthDate = formData.get("birthDate") as string;
        const schoolName = formData.get("schoolName") as string;
        const grade = formData.get("grade") as string;
        const religion = formData.get("religion") as string;
        const studentPhone = formData.get("studentPhone") as string;
        const studentAddress = formData.get("studentAddress") as string;
        const studentGender = formData.get("studentGender") as "male" | "female";
        const studentAccount = await auth.api.signUpEmail(
            {
                body: {
                    email: email,
                    password: password,
                    name: studentName,
                    role: "student",
                },
                asResponse: false,
            }
        );
        if (!studentAccount?.user) {
            return { success: false, message: "Gagal membuat akun siswa" };
        }
        const parentAccount = await auth.api.signUpEmail(
            {
                body: {
                    email: parentEmail,
                    password: "orangtuahebat",
                    name: parentName,
                    role: "parent",
                },
                asResponse: false,
            }
        );
        if (!parentAccount?.user) {
            return { success: false, message: "Gagal membuat akun orang tua" };
        }
        await db.transaction(async (tx) => {
            const parentPersonalId = await tx.insert(parentPersonal).values({
                name: parentName,
                relation: parentRelation,
                phone: parentPhone,
                address: parentAddress,
                accountId: parentAccount.user.id
            }).$returningId();

            await tx.insert(studentPersonal).values({
                accountId: studentAccount.user.id,
                parentId: parentPersonalId[0].id,
                name: studentName,
                pob: birthPlace,
                dob: birthDate,
                schoolName: schoolName,
                schoolGrade: grade,
                religion: religion,
                phone: studentPhone,
                address: studentAddress ?? parentAddress,
                sex: studentGender
            });
        });

        return { success: true, message: "Pendaftaran Berhasil! Anda diarahkan ke halaman login siswa" };

    } catch (error: unknown) {
        console.error("Full DB Error:", error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "Ada Kesalahan" };
    }
}