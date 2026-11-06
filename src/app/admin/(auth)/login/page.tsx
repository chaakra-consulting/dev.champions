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

export default function LoginPage() {
  const initialState = { errors: {} as { email?: string; password?: string; general?: string } };
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
              <Input
                id="password"
                type="password"
                name="password"
                required
                disabled={isPending}
                aria-invalid={!!errors.password}
                className="transition-colors focus-visible:ring-2"
              />
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
