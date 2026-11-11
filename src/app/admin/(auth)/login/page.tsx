"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Field, FieldDescription } from "@/components/ui/field";
import { handleLogin } from "@/app/actions/auth/login";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export default function LoginPage() {
  const initialState = { errors: {} as { email?: string; password?: string; general?: string } };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, formAction, isPending] = useActionState(handleLogin, initialState);
  const errors = state?.errors || {};

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Halo admin
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Masuk untuk melanjutkan ke dashboard admin.
          </CardDescription>
        </CardHeader>
        {errors.general && (
          <div className={`mx-4 flex items-center justify-between p-4 text-sm rounded-lg border transition-all mb-6 bg-red-50 text-red-800 border-red-200`} role="alert">
            <div className="flex items-center gap-2">
              <span>⚠</span>
              <span className="font-medium">{errors.general}</span>
            </div>
          </div>
        )}
        <form action={formAction}>
          <input type="hidden" name="expectedRole" value="admin" />
          <CardContent className="space-y-4">
            <Field data-invalid={!!errors.email}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                aria-invalid={!!errors.email}
                disabled={isPending}
                className="transition-colors focus-visible:ring-2"
              />
              {errors.email && (
                <FieldDescription>
                  {errors.email}
                </FieldDescription>
              )}
            </Field>
            <Field data-invalid={!!errors.password}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>

              <InputGroup>
                <InputGroupInput id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  disabled={isPending}
                  aria-invalid={!!errors.password} />
                <InputGroupAddon align="inline-end">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password absolute right-3 hover:text-[#181524] focus:outline-none text-gray-500"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    )}
                  </button>
                </InputGroupAddon>
              </InputGroup>


              {errors.password && (
                <FieldDescription>
                  {errors.password}
                </FieldDescription>
              )}
            </Field>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </Button>

          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
