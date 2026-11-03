'use client';

import { useActionState, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerStudentAction } from '@/app/actions/student/auth/register';
import { z } from 'zod';

type AlertState = {
    type: 'success' | 'error';
    text: string;
} | null;

type StudentRegisterFormData = {
    // Add your type definition here or import it
    [key: string]: string;
};

export default function StudentRegister() {
    const router = useRouter();
    // useActionState handles the server response and loading state natively
    const [state, formAction, isPending] = useActionState(registerStudentAction, null);
    const [alert, setAlert] = useState<AlertState>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSameAddress, setIsSameAddress] = useState(false);

    const step1Schema = z.object({
        email: z.email("Format email tidak valid"),
        password: z.string().min(8, "Password minimal 8 karakter"),
        confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi")
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password tidak cocok",
        path: ["confirmPassword"], // Attaches the error to the confirmPassword field
    });

    // We use a factory function for Step 2 so we can pass the dynamic `isSameAddress` state
    const getStep2Schema = (isSameAddress: boolean) => z.object({
        studentName: z.string().min(1, "Kolom ini wajib diisi"),
        birthPlace: z.string().min(1, "Kolom ini wajib diisi"),
        birthDate: z.string().min(1, "Kolom ini wajib diisi"),
        studentPhone: z.string().min(1, "Kolom ini wajib diisi"),
        studentAddress: isSameAddress
            ? z.string().optional() // If true, ignore validation for now
            : z.string().min(1, "Kolom ini wajib diisi"),
    });

    const step3Schema = z.object({
        schoolName: z.string().min(1, "Kolom ini wajib diisi"),
        grade: z.string().min(1, "Kolom ini wajib diisi"),
    });

    const step4Schema = z.object({
        parentName: z.string().min(1, "Kolom ini wajib diisi"),
        parentEmail: z.email("Format email tidak valid"),
        parentPhone: z.string().min(1, "Kolom ini wajib diisi"),
        parentAddress: z.string().min(1, "Kolom ini wajib diisi"),
    });

    // Watch for the Server Action response to update the UI
    useEffect(() => {
        if (state) {
            if (state.success) {
                setAlert({ type: 'success', text: state.message || 'Registrasi Berhasil!' });
                // Optional: Automatically redirect after a short delay
                // setTimeout(() => router.push('/student/login'), 1000);
            } else {
                setAlert({ type: 'error', text: state.message || 'Gagal mendaftar.' });
            }
        }
    }, [state, router]);

    const [formData, setFormData] = useState<StudentRegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        studentName: '',
        birthPlace: '',
        birthDate: '',
        studentGender: 'male', // ensure this matches your DB enum (e.g. 'L' or 'male')
        religion: 'Islam',
        studentPhone: '',
        studentAddress: '',
        schoolName: '',
        grade: '',
        parentName: '',
        parentRelation: 'father', // 'ayah' / 'ibu' / 'wali'
        parentEmail: '',
        parentPhone: '',
        parentAddress: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const steps = [
        { id: 1, title: 'Akun' },
        { id: 2, title: 'Data Pribadi' },
        { id: 3, title: 'Asal Sekolah' },
        { id: 4, title: 'Data Orang Tua' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (name === 'parentAddress' && isSameAddress) {
                newData.studentAddress = value;
            }

            return newData;
        });

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step: number) => {
        let schema;

        switch (step) {
            case 1: schema = step1Schema; break;
            case 2: schema = getStep2Schema(isSameAddress); break;
            case 3: schema = step3Schema; break;
            case 4: schema = step4Schema; break;
            default: return true;
        }

        const result = schema.safeParse(formData);

        if (!result.success) {
            // Map Zod's array of issues into the { [fieldName]: "Error message" } format your UI expects
            const fieldErrors: { [key: string]: string } = {};

            result.error.issues.forEach(issue => {
                const fieldName = issue.path[0] as string;
                if (!fieldErrors[fieldName]) {
                    fieldErrors[fieldName] = issue.message;
                }
            });

            setErrors(fieldErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleClientSubmit = (payload: FormData) => {
        const isFinalStepValid = validateStep(4);
        if (!isFinalStepValid) {
            return;
        }

        formAction(payload);
    };

    // New handleNext function runs validation before incrementing step
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-gray-900">
            {/* Left Sidebar - Kept exactly as your original code */}
            <div className="w-full lg:w-[350px] xl:w-[400px] bg-[#f8f8fc] flex flex-col justify-between p-10 lg:min-h-screen border-r border-gray-100">
                <div>
                    <div className="mb-12">
                        <span className="text-3xl text-[#000068] font-extrabold tracking-tight">Champions.</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-xl font-medium mb-1">Registrasi Akun</h2>
                        <p className="text-gray-500 text-sm">Isi kolom yang tersedia dengan sebenar-benarnya</p>
                    </div>

                    <div className="flex flex-col ml-2">
                        {steps.map((step, index) => {
                            const isCompleted = step.id < currentStep;
                            const isActive = step.id === currentStep;
                            const isLast = index === steps.length - 1;

                            return (
                                <div key={step.id} className="flex relative">
                                    {!isLast && (
                                        <div className={`absolute left-[15px] top-8 w-[2px] h-[calc(100%-8px)] transition-colors duration-300 ${step.id < currentStep ? 'bg-[#000068]' : 'bg-[#e0e0f5]'}`}></div>
                                    )}

                                    <div className="flex items-start mb-8 relative z-10">
                                        <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 mt-[-2px] ${isCompleted || isActive ? 'bg-[#000068] text-white shadow-sm' : 'bg-[#e0e0f5] text-[#8a8aeb]'}`}>
                                            {isCompleted ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                step.id
                                            )}
                                        </div>
                                        <div className={`ml-4 text-[15px] font-medium transition-colors duration-300 ${isCompleted || isActive ? 'text-[#000068]' : 'text-[#a3a3e8]'}`}>
                                            {step.title}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Main Content */}
            <div className="flex-1 flex flex-col p-8 lg:p-12 xl:p-16 relative">
                <div className="mb-12 flex justify-between items-center">
                    <button
                        type="button" // Important: keep this as button so it doesn't submit
                        onClick={handlePrev}
                        disabled={currentStep === 1 || isPending}
                        className={`flex items-center text-sm font-medium transition-opacity ${currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-70'}`}
                    >
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mr-3 bg-gray-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        Sebelumnya
                    </button>

                    <div className="text-sm">
                        <span className="text-gray-500">Sudah punya akun? </span>
                        <Link href="/student/login" className="text-[#000068] font-semibold hover:underline">
                            Masuk
                        </Link>
                    </div>
                </div>

                <div className="max-w-[560px] w-full mx-auto lg:mx-0 lg:ml-12 mt-4 flex-1">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold mb-3">{steps[currentStep - 1].title}</h1>
                        <p className="text-gray-500">Mohon untuk mengisi kolom yang tersedia sebelum melanjutkan</p>
                    </div>

                    {alert && (
                        <div className={`flex items-center justify-between p-4 text-sm rounded-lg border transition-all mb-6 ${alert.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`} role="alert">
                            <div className="flex items-center gap-2">
                                <span>{alert.type === 'success' ? '✓' : '⚠'}</span>
                                <span className="font-medium">{alert.text}</span>
                            </div>
                            <button type="button" onClick={() => setAlert(null)} className="ml-auto text-sm font-semibold opacity-70 hover:opacity-100">✕</button>
                        </div>
                    )}

                    <form className="w-full flex flex-col h-full" action={handleClientSubmit}>

                        {/* 
                          CRITICAL FIX: Use className block/hidden instead of conditional rendering!
                          This ensures the inputs stay in the DOM so formAction can read the full FormData.
                        */}

                        {/* STEP 1 */}
                        <div className={`flex flex-col mb-10 ${currentStep === 1 ? 'block animate-fadeIn' : 'hidden'}`}>
                            <div className="flex flex-col gap-5">
                                <div className="form-group">
                                    <label htmlFor="email" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Email</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181524] ml-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Email" autoComplete="email" />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Password</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181524] ml-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                            </svg>
                                        </div>
                                        <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-transparent h-12 pl-3 pr-10 text-sm outline-none placeholder-gray-400" placeholder="Masukkan password" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password absolute right-3 hover:text-[#181524] focus:outline-none text-gray-500">
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Konfirmasi Password</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181524] ml-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                            </svg>
                                        </div>
                                        <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-transparent h-12 pl-3 pr-10 text-sm outline-none placeholder-gray-400" placeholder="Masukkan kembali password" />
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div className={`space-y-6 flex flex-col mb-10 ${currentStep === 2 ? 'block animate-fadeIn' : 'hidden'}`}>
                            <div className="flex flex-col gap-5">
                                <div className="form-group">
                                    <label htmlFor="studentName" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Nama Siswa</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.studentName ? 'border-red-500' : 'border-gray-200'}`}>
                                        <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Nama" />
                                    </div>
                                    {errors.studentName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.studentName}</p>}
                                </div>
                                <div className='flex flex-row justify-between'>
                                    <div className="form-group w-[48%]">
                                        <label htmlFor="birthPlace" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Tempat Lahir</label>
                                        <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.birthPlace ? 'border-red-500' : 'border-gray-200'}`}>
                                            <input type="text" id="birthPlace" name="birthPlace" value={formData.birthPlace} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Tempat Lahir" />
                                        </div>
                                        {errors.birthPlace && <p className="text-red-500 text-xs mt-1 ml-1">{errors.birthPlace}</p>}
                                    </div>
                                    <div className="form-group w-[48%]">
                                        <label htmlFor="birthDate" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Tanggal Lahir</label>
                                        <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.birthDate ? 'border-red-500' : 'border-gray-200'}`}>
                                            <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" />
                                        </div>
                                        {errors.birthDate && <p className="text-red-500 text-xs mt-1 ml-1">{errors.birthDate}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="studentGender" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Jenis Kelamin</label>
                                    <div className="relative flex items-center bg-white border appearance-none focus:outline-none rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all border-gray-200">
                                        <select className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" name="studentGender" id="studentGender" value={formData.studentGender} onChange={handleChange}>
                                            <option value="male">Laki-Laki</option>
                                            <option value="female">Perempuan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="religion" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Agama</label>
                                    <div className="relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all border-gray-200">
                                        <select className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" name="religion" id="religion" value={formData.religion} onChange={handleChange}>
                                            <option value="Islam">Islam</option>
                                            <option value="Kristen">Kristen</option>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Budha">Budha</option>
                                            <option value="Konghucu">Konghucu</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="studentPhone" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Nomor Telepon</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.studentPhone ? 'border-red-500' : 'border-gray-200'}`}>
                                        <input type="text" id="studentPhone" name="studentPhone" value={formData.studentPhone} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Nomor Telepon" />
                                    </div>
                                    {errors.studentPhone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.studentPhone}</p>}
                                </div>

                                <div className="form-group">
                                    <div className="flex justify-between items-center mb-1.5 ml-1">
                                        <label htmlFor="studentAddress" className="block text-xs font-semibold text-[#181524]">Alamat</label>
                                        <label className="flex items-center space-x-1.5 cursor-pointer">
                                            <input type="checkbox" checked={isSameAddress} onChange={(e) => {
                                                const checked = e.target.checked;
                                                setIsSameAddress(checked);
                                                if (checked) {
                                                    setFormData(prev => ({ ...prev, studentAddress: prev.parentAddress }));
                                                    if (errors.studentAddress) setErrors(prev => ({ ...prev, studentAddress: '' }));
                                                }
                                            }} className="w-3.5 h-3.5 rounded border-gray-300 text-[#000068] focus:ring-[#000068]" />
                                            <span className="text-[11px] font-medium text-gray-500">Sama dengan alamat orang tua</span>
                                        </label>
                                    </div>
                                    <div className={`relative flex items-center border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.studentAddress && !isSameAddress ? 'border-red-500' : 'border-gray-200'} ${isSameAddress ? 'bg-gray-50' : 'bg-white'}`}>
                                        <textarea rows={3} className={`w-full p-3 text-sm outline-none placeholder-gray-400 ${isSameAddress ? 'bg-transparent text-gray-400 cursor-not-allowed' : 'bg-transparent'}`} name="studentAddress" id="studentAddress" value={formData.studentAddress} onChange={handleChange} disabled={isSameAddress} placeholder={isSameAddress ? "Alamat akan terisi otomatis dari data orang tua (Langkah ke-4)" : "Masukkan Alamat"}></textarea>
                                    </div>
                                    {errors.studentAddress && !isSameAddress && <p className="text-red-500 text-xs mt-1 ml-1">{errors.studentAddress}</p>}
                                </div>
                            </div>
                        </div>

                        {/* STEP 3 */}
                        <div className={`space-y-6 flex flex-col mb-10 ${currentStep === 3 ? 'block animate-fadeIn' : 'hidden'}`}>
                            <div className="flex flex-col gap-5">
                                <div className="form-group">
                                    <label htmlFor="schoolName" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Nama Sekolah</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.schoolName ? 'border-red-500' : 'border-gray-200'}`}>
                                        <input type="text" id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Nama Sekolah" />
                                    </div>
                                    {errors.schoolName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.schoolName}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="grade" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Kelas/Jenjang</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.grade ? 'border-red-500' : 'border-gray-200'}`}>
                                        <input type="text" id="grade" name="grade" value={formData.grade} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Kelas/Jenjang" />
                                    </div>
                                    {errors.grade && <p className="text-red-500 text-xs mt-1 ml-1">{errors.grade}</p>}
                                </div>
                            </div>
                        </div>

                        {/* STEP 4 */}
                        <div className={`space-y-6 flex flex-col mb-10 ${currentStep === 4 ? 'block animate-fadeIn' : 'hidden'}`}>
                            <div className="flex flex-col gap-5">
                                <div className="form-group">
                                    <label htmlFor="parentName" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Nama Orang Tua</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.parentName ? 'border-red-500' : 'border-gray-200'}`}>
                                        <input type="text" id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Nama Orang Tua" />
                                    </div>
                                    {errors.parentName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.parentName}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="parentRelation" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Relasi</label>
                                    <div className="relative flex items-center bg-white border appearance-none focus:outline-none rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all border-gray-200">
                                        <select className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" name="parentRelation" id="parentRelation" value={formData.parentRelation} onChange={handleChange}>
                                            <option value="father">Ayah</option>
                                            <option value="mother">Ibu</option>
                                            <option value="other">Lainnya</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="parentEmail" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Email</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.parentEmail ? 'border-red-500' : 'border-gray-200'}`}>
                                        <input type="email" id="parentEmail" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Email Orang Tua" />
                                    </div>
                                    {errors.parentEmail && <p className="text-red-500 text-xs mt-1 ml-1">{errors.parentEmail}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="parentPhone" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Nomor Telepon</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.parentPhone ? 'border-red-500' : 'border-gray-200'}`}>
                                        <input type="text" id="parentPhone" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400" placeholder="Masukkan Nomor Telepon" />
                                    </div>
                                    {errors.parentPhone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.parentPhone}</p>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="parentAddress" className="block text-xs font-semibold text-[#181524] mb-1.5 ml-1">Alamat</label>
                                    <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.parentAddress ? 'border-red-500' : 'border-gray-200'}`}>
                                        <textarea rows={3} className="w-full bg-transparent p-3 text-sm outline-none placeholder-gray-400" name="parentAddress" id="parentAddress" value={formData.parentAddress} onChange={handleChange}></textarea>
                                    </div>
                                    {errors.parentAddress && <p className="text-red-500 text-xs mt-1 ml-1">{errors.parentAddress}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex flex-col space-y-4">
                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="cursor-pointer w-full p-3.5 rounded-xl font-medium text-sm transition-colors text-white bg-[#000068] hover:bg-[#000068]/80"
                                >
                                    Selanjutnya
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`cursor-pointer w-full p-3.5 rounded-xl font-medium text-sm transition-colors text-white ${isPending ? 'bg-gray-400 cursor-wait' : 'bg-[#000068] hover:bg-[#000068]/80'}`}
                                >
                                    {isPending ? "Memproses..." : "Daftar"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}