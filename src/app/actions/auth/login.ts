"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Define a consistent shape for your state
export type ActionState = {
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
};

export async function handleLogin(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Tangkap expectedRole dari form login
  const expectedRole = formData.get("expectedRole") as string;
  
  let redirectPath = "/dashboard"; // Default redirect path

  const errors: NonNullable<ActionState["errors"]> = {};
  
  if (!email) errors.email = "Kolom email wajib diisi";
  if (!password || password.length < 8) errors.password = "Kolom password wajib diisi minimal dengan 8 karakter";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const requestHeaders = await headers();

    const response = await auth.api.signInEmail({
      body: { 
        email, 
        password 
      },
      headers: requestHeaders,
    });
    
    const userRole = response?.user?.role;

    // Pengecekan validitas Role vs Halaman Login
    if (expectedRole && userRole !== expectedRole) {
      // Hapus sesi (sign out) karena user salah portal login
      await auth.api.signOut({ headers: requestHeaders });
      
      return {
        errors: {
          general: `Akses ditolak. Akun Anda terdaftar sebagai ${userRole || 'pengguna'}, bukan ${expectedRole}.`
        }
      };
    }

    switch (userRole) {
      case "admin":
        redirectPath = "/admin/dashboard";
        break;
      case "parent":
        redirectPath = "/parent/dashboard";
        break;
      case "student":
        redirectPath = "/student/dashboard";
        break;
      case "mentor":
        redirectPath = "/mentor/dashboard";
        break;
      default:
        redirectPath = "/dashboard";
    }
    
  } catch (error: any) {
    return { 
      errors: { 
        general: error.message || "Email atau password tidak valid" 
      } 
    };
  }
  
  redirect(redirectPath);
}