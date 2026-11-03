"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// 1. Define a consistent shape for your state
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

  const errors: NonNullable<ActionState["errors"]> = {};
  
  if (!email) errors.email = "Kolom email wajib diisi";
  if (!password || password.length < 8) errors.password = "Kolom password wajib diisi minimal dengan 8 karakter";

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const user = await auth.api.signInEmail({
      body: { email, password },
    });
    console.log(user);
    
  } catch (error: any) {
    return { 
      errors: { 
        general: error.message || "Invalid email or password" 
      } 
    };
  }

  redirect("/student/dashboard");
}