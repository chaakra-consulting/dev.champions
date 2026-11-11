"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { CheckIcon, ChevronDownIcon, LoaderCircleIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Stepper, StepperNav, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperDescription, StepperSeparator, StepperPanel } from "@/components/reui/stepper";
import { uploadFile, revertFile } from "@/app/actions/admin/upload-attachment";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "date-fns";
import { MentorFormValues, mentorSchema } from "@/types/mentor/insert-formdata.types";
import { insertMentorData } from "@/app/actions/admin/mentor/insert-data";
import { redirect } from "next/navigation";




const steps = [
    { title: "Data Pribadi", description: "Informasi dasar & akun", fields: ["personalData"] },
    { title: "Pendidikan", description: "Riwayat akademik formal", fields: ["educations"] },
    { title: "Prestasi", description: "Penghargaan dan sertifikat", fields: ["achievements"] },
    { title: "Pendidikan Non-Formal", description: "Kursus dan pelatihan", fields: ["nonFormal"] },
];

// --- HELPER UNTUK SHADCN STYLING ---
const inputStyle = (error?: any, isTextarea = false) => {
    const baseStyle = `
          [&::-webkit-calendar-picker-indicator]:hidden 
          [&::-webkit-calendar-picker-indicator]:cursor-pointer 
          [&::-webkit-calendar-picker-indicator]:opacity-60
          hover:[&::-webkit-calendar-picker-indicator]:opacity-100 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${isTextarea ? "min-h-[80px] flex" : "h-10 flex"
        }`;

    const stateStyle = error
        ? "border-red-500 focus-visible:ring-red-500 text-red-900"
        : "border-gray-300 focus-visible:ring-blue-500";

    return `${baseStyle} ${stateStyle}`;
};

const ErrorMsg = ({ error }: { error?: { message?: string } }) =>
    error?.message ? (
        <p className="text-[0.8rem] font-medium text-red-500 mt-1.5 animate-in fade-in-0 slide-in-from-top-1">
            {error.message}
        </p>
    ) : null;


export default function AdminInsertMentorForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [date, setDate] = React.useState<Date>()
    const [stepLocked, setStepLocked] = useState(false);
    const [skipNonFormal, setSkipNonFormal] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const {
        register,
        control,
        handleSubmit,
        trigger,
        clearErrors,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<MentorFormValues>({
        resolver: zodResolver(mentorSchema),
        mode: "onTouched",
        defaultValues: {
            personalData: {
                email: "", password: "",
                profile_image: null, nik: "", name: "", nip: "",
                pob: "", dob: "", address: "", ktp_address: "",
                marriage_status: "single", religion: "", siblings: "",
                x_of_siblings: "", sex: "male", phone: ""
            },
            educations: [{ edu_level: "", institution_name: "", department: "", is_graduated: "0", started_year: "", graduated_date: "", gpa: "" }],
            achievements: [{ name: "", rank: "", scope: "", attachment: null, desc: "" }],
            nonFormal: [{ institution_name: "", cert_number: "", issued_until: "", training_date: "", training_purpose: "" }]
        },
    });

    const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "educations" });
    const { fields: achFields, append: appendAch, remove: removeAch } = useFieldArray({ control, name: "achievements" });
    const { fields: nfFields, append: appendNf, remove: removeNf } = useFieldArray({ control, name: "nonFormal" });

    useEffect(() => {
        setStepLocked(true);
        const timer = setTimeout(() => setStepLocked(false), 300);
        return () => clearTimeout(timer);
    }, [currentStep]);

    const handleNext = async (e) => {
    if (e) e.preventDefault(); 

    if (isNavigating || stepLocked) return;
    setIsNavigating(true);

    try {
        const fieldsToValidate = steps[currentStep - 1].fields as any;
        let isStepValid = true;

        if (currentStep === 4 && skipNonFormal) {
            isStepValid = true;
            clearErrors("nonFormal");
        } else {
            isStepValid = await trigger(fieldsToValidate);
        }

        if (isStepValid && currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    } finally {
        setIsNavigating(false);
    }
};
    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const onSubmit = async (data: MentorFormValues) => {
        if (currentStep == steps.length) {
            const result = await insertMentorData(data);
            if (result.success) {
               redirect("/admin/mentor");
            } else {
                alert(result.message);
            }
        }
    };

    const renderFormFields = (stepIndex: number) => {
        switch (stepIndex) {
            case 0: // Data Pribadi & Akun
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">

                        {/* --- Bagian Kredensial Akun --- */}
                        <div className="md:col-span-2 border-b pb-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Login</h3>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-gray-700 text-sm">Email *</label>
                                    <input {...register("personalData.email")} type="email" className={inputStyle(errors.personalData?.email)} placeholder="Masukkan email" />
                                    <ErrorMsg error={errors.personalData?.email} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-gray-700 text-sm">Kata Sandi *</label>
                                    <input {...register("personalData.password")} value="mentorhebat" type="password" className={inputStyle(errors.personalData?.password)} placeholder="Masukkan kata sandi" />
                                    <ErrorMsg error={errors.personalData?.password} />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Profil Mentor</h3>
                        </div>

                        <div className="flex flex-col gap-1 md:col-span-2 mb-2">
                            <label className="font-medium text-gray-700 text-sm">Foto Profil</label>
                            <div className="w-40">
                                <Controller
                                    control={control}
                                    name="personalData.profile_image"
                                    render={({ field: { onChange } }) => (
                                        <FilePond
                                            allowMultiple={false}
                                            labelIdle='<span class="filepond--label-action">Unggah Foto</span>'
                                            credits={false}
                                            stylePanelAspectRatio="1:1"
                                            imagePreviewHeight={150}
                                            server={{
                                                process: (fieldName, file, metadata, load, error, progress, abort) => {
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    uploadFile(formData).then((res) => {
                                                        if (res.error) error(res.error);
                                                        else { onChange(res.id); load(res.id as string); }
                                                    }).catch(() => error("Upload gagal"));
                                                    return { abort: () => abort() };
                                                },
                                                revert: (uniqueFileId, load, error) => {
                                                    revertFile(uniqueFileId).then((res) => {
                                                        if (res.error) error(res.error);
                                                        else { onChange(null); load(); }
                                                    }).catch(() => error("Gagal menghapus"));
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">Nama Lengkap *</label>
                            <input {...register("personalData.name")} className={inputStyle(errors.personalData?.name)} placeholder="Sesuai KTP" />
                            <ErrorMsg error={errors.personalData?.name} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">NIK *</label>
                            <input {...register("personalData.nik")} className={inputStyle(errors.personalData?.nik)} placeholder="16 Digit NIK" />
                            <ErrorMsg error={errors.personalData?.nik} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">NIP (Opsional)</label>
                            <input {...register("personalData.nip")} className={inputStyle(errors.personalData?.nip)} placeholder="Nomor Induk Pegawai" />
                            <ErrorMsg error={errors.personalData?.nip} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">Nomor HP</label>
                            <input {...register("personalData.phone")} type="tel" className={inputStyle(errors.personalData?.phone)} placeholder="Contoh: 08123456789" />
                            <ErrorMsg error={errors.personalData?.phone} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">Tempat Lahir </label>
                            <input {...register("personalData.pob")} type="text" className={inputStyle(errors.personalData?.pob)} placeholder="Kota Tempat Lahir" />
                            <ErrorMsg error={errors.personalData?.pob} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">Tanggal Lahir</label>
                            <input {...register("personalData.dob")} type="date" className={inputStyle(errors.personalData?.dob)} />
                            <ErrorMsg error={errors.personalData?.dob} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">Jenis Kelamin *</label>
                            <select {...register("personalData.sex")} className={inputStyle(errors.personalData?.sex)}>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                            <ErrorMsg error={errors.personalData?.sex} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">Agama *</label>
                            <input {...register("personalData.religion")} className={inputStyle(errors.personalData?.religion)} placeholder="Contoh: Islam, Kristen" />
                            <ErrorMsg error={errors.personalData?.religion} />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-medium text-gray-700 text-sm">Status Pernikahan</label>
                            <select {...register("personalData.marriage_status")} className={inputStyle(errors.personalData?.marriage_status)}>
                                <option value="single">Belum Kawin (Single)</option>
                                <option value="married">Kawin (Married)</option>
                            </select>
                            <ErrorMsg error={errors.personalData?.marriage_status} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-700 text-sm text-nowrap">Jumlah Saudara</label>
                                <input {...register("personalData.siblings")} type="text" className={inputStyle(errors.personalData?.siblings)} placeholder="Jml" />
                                <ErrorMsg error={errors.personalData?.siblings} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-700 text-sm text-nowrap">Anak Ke-</label>
                                <input {...register("personalData.x_of_siblings")} type="text" className={inputStyle(errors.personalData?.x_of_siblings)} placeholder="Ke" />
                                <ErrorMsg error={errors.personalData?.x_of_siblings} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="font-medium text-gray-700 text-sm">Alamat Sesuai KTP</label>
                            <input {...register("personalData.ktp_address")} className={inputStyle(errors.personalData?.ktp_address)} placeholder="Masukkan alamat KTP" />
                            <ErrorMsg error={errors.personalData?.ktp_address} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="font-medium text-gray-700 text-sm">Alamat Domisili Sekarang</label>
                            <textarea {...register("personalData.address")} className={inputStyle(errors.personalData?.address, true)} placeholder="Masukkan alamat tempat tinggal saat ini" rows={2} />
                            <ErrorMsg error={errors.personalData?.address} />
                        </div>
                    </div>
                );

            case 1: // Pendidikan
                return (
                    <div className="flex flex-col gap-6">
                        {eduFields.map((field, index) => (
                            <div key={field.id} className="relative p-5 border rounded-lg bg-gray-50/50 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-gray-700 text-sm">Tingkat Pendidikan</label>
                                        <input {...register(`educations.${index}.edu_level`)} className={inputStyle(errors.educations?.[index]?.edu_level)} placeholder="Contoh: S1, SMA" />
                                        <ErrorMsg error={errors.educations?.[index]?.edu_level} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-gray-700 text-sm">Nama Institusi</label>
                                        <input {...register(`educations.${index}.institution_name`)} className={inputStyle(errors.educations?.[index]?.institution_name)} placeholder="Masukkan nama institusi" />
                                        <ErrorMsg error={errors.educations?.[index]?.institution_name} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-gray-700 text-sm">Jurusan</label>
                                        <input {...register(`educations.${index}.department`)} className={inputStyle(errors.educations?.[index]?.department)} placeholder="Masukkan jurusan" />
                                        <ErrorMsg error={errors.educations?.[index]?.department} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-gray-700 text-sm">Tahun Mulai</label>
                                        <input {...register(`educations.${index}.started_year`)} maxLength={4} className={inputStyle(errors.educations?.[index]?.started_year)} placeholder="YYYY" />
                                        <ErrorMsg error={errors.educations?.[index]?.started_year} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-gray-700 text-sm">Sudah Lulus?</label>
                                        <select {...register(`educations.${index}.is_graduated`)} className={inputStyle(errors.educations?.[index]?.is_graduated)}>
                                            <option value="0">Belum</option>
                                            <option value="1">Sudah</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="font-medium text-gray-700 text-sm">Tanggal Lulus</label>
                                        <input {...register(`educations.${index}.graduated_date`)} type="date" className={inputStyle(errors.educations?.[index]?.graduated_date)} />
                                    </div>
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="font-medium text-gray-700 text-sm">IPK</label>
                                        <input {...register(`educations.${index}.gpa`)} className={`${inputStyle(errors.educations?.[index]?.gpa)} md:w-1/2`} placeholder="Contoh: 3.85" />
                                        <ErrorMsg error={errors.educations?.[index]?.gpa} />
                                    </div>
                                </div>
                                {eduFields.length > 1 && (
                                    <button type="button" onClick={() => removeEdu(index)} className="absolute -top-3 -right-3 p-2 bg-white border border-red-200 text-red-600 rounded-full hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">
                                        <Trash2Icon className="size-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={() => appendEdu({ edu_level: "", institution_name: "", department: "", is_graduated: "0", started_year: "", graduated_date: "", gpa: "" })} className="flex items-center gap-2 w-fit px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                            <PlusIcon className="size-4" /> Tambah Pendidikan
                        </button>
                    </div>
                );

            case 2: // Prestasi
                return (
                    <div className="flex flex-col gap-6">
                        {achFields.length === 0 ? (
                            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                <p className="text-gray-500 mb-4">Tidak ada data prestasi yang ditambahkan (Opsional).</p>
                                <button type="button" onClick={() => appendAch({ name: "", rank: "", scope: "", attachment: null, desc: "" })} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                                    Tambah Prestasi
                                </button>
                            </div>
                        ) : (
                            achFields.map((field, index) => (
                                <div key={field.id} className="relative p-5 border rounded-lg bg-gray-50/50 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Field Prestasi Anda yang sudah ada */}
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-gray-700 text-sm">Nama Prestasi</label>
                                            <input {...register(`achievements.${index}.name`)} className={inputStyle(errors.achievements?.[index]?.name)} placeholder="Masukkan nama prestasi" />
                                            <ErrorMsg error={errors.achievements?.[index]?.name} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-gray-700 text-sm">Peringkat</label>
                                            <input {...register(`achievements.${index}.rank`)} maxLength={2} className={inputStyle(errors.achievements?.[index]?.rank)} placeholder="Contoh: 1, 2, 3" />
                                            <ErrorMsg error={errors.achievements?.[index]?.rank} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-gray-700 text-sm">Tingkat (Scope)</label>
                                            <input {...register(`achievements.${index}.scope`)} className={inputStyle(errors.achievements?.[index]?.scope)} placeholder="Contoh: Nasional" />
                                            <ErrorMsg error={errors.achievements?.[index]?.scope} />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-medium text-gray-700 text-sm">Lampiran</label>
                                            {/* FilePond controller biarkan seperti semula */}
                                            <div className={errors.achievements?.[index]?.attachment ? "rounded-md border-2 border-red-500 overflow-hidden" : ""}>
                                                <Controller
                                                    control={control}
                                                    name={`achievements.${index}.attachment`}
                                                    render={({ field: { onChange } }) => (
                                                        <FilePond allowMultiple={false} labelIdle='Tarik & Lepas atau <span class="filepond--label-action">Cari Berkas</span>' credits={false}
                                                            server={{ /* Server logic Anda */ }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <ErrorMsg error={errors.achievements?.[index]?.attachment as any} />
                                        </div>

                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="font-medium text-gray-700 text-sm">Deskripsi</label>
                                            <textarea {...register(`achievements.${index}.desc`)} className={inputStyle(errors.achievements?.[index]?.desc, true)} placeholder="Jelaskan mengenai prestasi ini" />
                                            <ErrorMsg error={errors.achievements?.[index]?.desc} />
                                        </div>
                                    </div>

                                    {/* Hapus kondisi achFields.length > 1, biarkan user bisa menghapus semua prestasi */}
                                    <button type="button" onClick={() => removeAch(index)} className="absolute -top-3 -right-3 p-2 bg-white border border-red-200 text-red-600 rounded-full hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">
                                        <Trash2Icon className="size-4" />
                                    </button>
                                </div>
                            ))
                        )}

                        {achFields.length > 0 && (
                            <button type="button" onClick={() => appendAch({ name: "", rank: "", scope: "", attachment: null, desc: "" })} className="flex items-center gap-2 w-fit px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                                <PlusIcon className="size-4" />  Tambah Prestasi Lainnya
                            </button>
                        )}
                    </div>
                );

            case 3: // Pendidikan Non-Formal
                return (
                    <div className="flex flex-col gap-4">
                        {/* Toggle Checkbox */}
                        <div className="flex items-center gap-2 mb-2 p-4 bg-gray-50 border rounded-lg">
                            <input
                                type="checkbox"
                                id="skipNonFormal"
                                checked={skipNonFormal}
                                onChange={(e) => {
                                    setSkipNonFormal(e.target.checked);
                                    if (e.target.checked) {
                                        clearErrors("nonFormal"); // Hapus pesan error jika ada
                                        // Bersihkan isi form agar data kotor tidak terbawa dan kembalikan ke 1 array kosong
                                        setValue("nonFormal", []);
                                    }
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="skipNonFormal" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Mentor tidak memiliki pengalaman pendidikan non-formal (Kosongkan)
                            </label>
                        </div>

                        {/* Render array field jika skipNonFormal bernilai false */}
                        {!skipNonFormal && (
                            <div className="flex flex-col gap-6 animate-step-change">
                                {nfFields.map((field, index) => (
                                    <div key={field.id} className="relative p-5 border rounded-lg bg-gray-50/50 shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <label className="font-medium text-gray-700 text-sm">Nama Institusi</label>
                                                <input {...register(`nonFormal.${index}.institution_name`)} className={inputStyle(errors.nonFormal?.[index]?.institution_name)} placeholder="Masukkan nama institusi" />
                                                <ErrorMsg error={errors.nonFormal?.[index]?.institution_name} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="font-medium text-gray-700 text-sm">Nomor Sertifikat</label>
                                                <input {...register(`nonFormal.${index}.cert_number`)} className={inputStyle(errors.nonFormal?.[index]?.cert_number)} placeholder="Opsional" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="font-medium text-gray-700 text-sm">Berlaku Hingga (Tahun)</label>
                                                <input {...register(`nonFormal.${index}.issued_until`)} maxLength={4} className={inputStyle(errors.nonFormal?.[index]?.issued_until)} placeholder="YYYY" />
                                                <ErrorMsg error={errors.nonFormal?.[index]?.issued_until} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="font-medium text-gray-700 text-sm">Tanggal Pelatihan</label>
                                                <input {...register(`nonFormal.${index}.training_date`)} type="date" className={inputStyle(errors.nonFormal?.[index]?.training_date)} />
                                                <ErrorMsg error={errors.nonFormal?.[index]?.training_date} />
                                            </div>
                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                <label className="font-medium text-gray-700 text-sm">Tujuan Pelatihan</label>
                                                <input {...register(`nonFormal.${index}.training_purpose`)} className={inputStyle(errors.nonFormal?.[index]?.training_purpose)} placeholder="Masukkan tujuan pelatihan" />
                                                <ErrorMsg error={errors.nonFormal?.[index]?.training_purpose} />
                                            </div>
                                        </div>

                                        {nfFields.length > 1 && (
                                            <button type="button" onClick={() => removeNf(index)} className="absolute -top-3 -right-3 p-2 bg-white border border-red-200 text-red-600 rounded-full hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm">
                                                <Trash2Icon className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button type="button" onClick={() => appendNf({ institution_name: "", cert_number: "", issued_until: "", training_date: "", training_purpose: "" })} className="flex items-center gap-2 w-fit px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50/50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                                    <PlusIcon className="size-4" /> Tambah Pendidikan Non-Formal
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex w-full items-start justify-start p-4 md:p-10 overflow-x-hidden">
            <style>{`
        @keyframes customFadeSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-step-change { animation: customFadeSlideIn 0.3s ease-out forwards; }
        .filepond--root { margin-bottom: 0 !important; }
      `}</style>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Stepper
                    className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 w-full"
                    value={currentStep}
                    orientation="vertical"
                    indicators={{ completed: <CheckIcon className="size-3.5" />, loading: <LoaderCircleIcon className="size-3.5 animate-spin" /> }}
                >
                    <StepperNav className="w-full lg:w-64 shrink-0">
                        {steps.map((step, index) => (
                            <StepperItem key={index} step={index + 1} className="relative items-start not-last:flex-1">
                                <StepperTrigger className="items-start gap-2.5 pb-8 lg:pb-12 last:pb-0">
                                    <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white border-gray-200 shrink-0">
                                        {index + 1}
                                    </StepperIndicator>
                                    <div className="mt-0.5 text-start">
                                        <StepperTitle>{step.title}</StepperTitle>
                                        <StepperDescription>{step.description}</StepperDescription>
                                    </div>
                                </StepperTrigger>
                                {index < steps.length - 1 && (
                                    <StepperSeparator className="group-data-[state=completed]/step:bg-green-500 absolute inset-y-0 top-7 start-3 -order-1 m-0 -translate-x-1/2 rtl:translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)] bg-gray-200" />
                                )}
                            </StepperItem>
                        ))}
                    </StepperNav>

                    <StepperPanel className="flex-1 flex flex-col text-start text-sm pt-1 w-full min-w-0">
                        <div key={currentStep} className="min-h-[300px] mb-8 animate-step-change">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                                {steps[currentStep - 1].title}
                            </h2>
                            {renderFormFields(currentStep - 1)}
                        </div>

                        <div className="flex items-center justify-between border-t pt-6 mt-auto">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="px-6 py-2.5 border rounded-md font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                            >
                                Sebelumnya
                            </button>

                            {currentStep < steps.length ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    Selanjutnya
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                >
                                    {isSubmitting ? <LoaderCircleIcon className="size-4 animate-spin" /> : null}
                                    Kirim Data
                                </button>
                            )}
                        </div>
                    </StepperPanel>
                </Stepper>
            </form>
        </div>
    );
}