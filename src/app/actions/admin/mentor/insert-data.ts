"use server"
import { db } from "@/db";
import { mentorAchievement } from "@/db/schema/mentor-achievement";
import { mentorEducation } from "@/db/schema/mentor-education";
import { mentorNonformalEducation } from "@/db/schema/mentor-nonformal-education";
import { mentorPersonal } from "@/db/schema/mentor-personal";
import { auth } from "@/lib/auth";
import { MentorFormValues } from "@/types/mentor/insert-formdata.types";

export async function insertMentorData(formData: MentorFormValues) {
    console.log(formData);
    const mentorName = formData.personalData.name;
    const mentorEmail = formData.personalData.email;
    const mentorPhone = formData.personalData.phone;
    const mentorAddress = formData.personalData.address;
    const mentorGender = formData.personalData.sex;
    const mentorNik = formData.personalData.nik;
    const mentorNip = formData.personalData.nip;
    const mentorPob = formData.personalData.pob;
    const mentorDob = formData.personalData.dob;
    const mentorMarriageStatus = formData.personalData.marriage_status;
    const mentorReligion = formData.personalData.religion;
    const mentorSiblings = formData.personalData.siblings;
    const mentorXOfSiblings = formData.personalData.x_of_siblings;
    const mentorProfileImage = formData.personalData.profile_image;
    const mentorKtpAddress = formData.personalData.ktp_address;

    const mentorAccount = await auth.api.createUser(
        {
            body: {
                email: mentorEmail,
                password: "mentorhebat",
                name: mentorName,
                role: "mentor",
            },
            asResponse: false,
        }
    );
    try {
        db.transaction(async (tx) => {

            // Insert mentor personal data
            const mentorPersonalData = await tx.insert(mentorPersonal).values({
                accountId: mentorAccount.user.id,
                profileImage: mentorProfileImage,
                phone: mentorPhone,
                nik: mentorNik,
                name: mentorName,
                nip: mentorNip,
                pob: mentorPob,
                dob: new Date(mentorDob),
                address: mentorAddress,
                ktpAddress: mentorKtpAddress,
                marriageStatus: mentorMarriageStatus,
                religion: mentorReligion,
                siblings: mentorSiblings,
                xOfSiblings: mentorXOfSiblings,
                sex: mentorGender,
            }).$returningId();

            if (formData.educations.length > 0) {
                for (const education of formData.educations) {
                    await tx.insert(mentorEducation).values({
                        mentorPersonalId: mentorPersonalData[0].id,
                        eduLevel: education.edu_level,
                        institutionName: education.institution_name,
                        department: education.department,
                        isGraduated: parseInt(education.is_graduated),
                        startedYear: education.started_year,
                        graduatedDate: education.graduated_date ? new Date(education.graduated_date) : null,
                        gpa: education.gpa,
                    });
                }
            }
            if (formData.achievements && formData.achievements.length > 0) {
                for (const achievement of formData.achievements) {
                    await tx.insert(mentorAchievement).values({
                        mentorPersonalId: mentorPersonalData[0].id,
                        name: achievement.name,
                        rank: achievement.rank,
                        scope: achievement.scope,
                        attachment: achievement.attachment,
                        desc: achievement.desc,
                    });
                }
            }
            if (formData.nonFormal && formData.nonFormal.length > 0) {
                for (const nonFormal of formData.nonFormal) {
                    await tx.insert(mentorNonformalEducation).values({
                        mentorPersonalId: mentorPersonalData[0].id,
                        institutionName: nonFormal.institution_name,
                        certNumber: nonFormal.cert_number,
                        issuedUntil: nonFormal.issued_until,
                        trainingDate: new Date(nonFormal.training_date),
                        trainingPurpose: nonFormal.training_purpose,
                    });
                }
            }
        });
        return { success: true, message: "Data mentor disimpan" };
    } catch (error) {
        console.error("Error inserting mentor data:", error);
        return { success: false, message: "Gagal menyimpan data mentor" };
    }
}