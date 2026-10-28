"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Next.js App Router allows async actions directly on the form
  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Login attempt with:", { email, password });

    try {
      // Simulate a network request (e.g., authentication API call)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Mock validation: Force an error for demonstration purposes
          // In a real app, this would be based on your backend response
          if (email === "admin@example.com") {
            resolve("Success");
          } else {
            reject(new Error("Invalid email or password. Please try again."));
          }
        }, 2000);
      });

      // Handle successful login here (e.g., redirecting)
      console.log("Login successful");
    } catch (err: any) {
      // Set the error message to display in the UI
      setError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#F0F2F5] min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Main Card Container */}
      <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-gray-200/60 w-full max-w-[1024px] flex flex-col md:flex-row min-h-[640px]">
        {/* Left Panel (Dark Blue Branding) */}
        <div className="hidden w-full md:w-[48%] bg-[#000068] rounded-[24px] p-10 md:p-12 text-white md:flex flex-col relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>

          <div className="relative z-10">
            <h1 className="text-[42px] leading-[1.2] font-extrabold text-white mb-5 tracking-tight relative z-0">
              Champions.
              <span className="relative inline-block">
                {/* Hand-drawn underline SVG */}
                <svg
                  className="absolute w-full h-4 -bottom-3 left-0 text-white"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9.5C50 3 150 1 198 9.5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-white/90 text-[15px] font-medium max-w-[320px] mb-8 leading-relaxed relative z-0">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            </p>
          </div>

          {/* 3D Characters Illustration Area */}
          <div className="mt-auto translate-y-28 w-full h-[260px] md:h-[26rem] z-10 flex justify-center items-end">
            {/* Man (Left) */}
            <img
              src="/img/man.png"
              alt="Man Character"
              className="h-[95%] md:h-[100%] w-auto object-contain object-bottom relative z-10 translate-x-4"
            />

            {/* Woman (Right) */}
            <img
              src="/img/woman.png"
              alt="Woman Character"
              className="h-[95%] md:h-[100%] w-auto object-contain object-bottom relative z-0 -translate-x-2"
            />
          </div>
        </div>

        {/* Right Panel (Login Form) */}
        <div className="w-full md:w-[52%] px-6 py-12 md:px-16 flex flex-col justify-center bg-white rounded-r-[24px]">
          {/* Headers */}
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-[14px]">
              Please login to your account
            </p>
          </div>

          {/* Form */}
          <form
            action={handleLogin}
            className="space-y-4 w-full max-w-[400px] mx-auto"
          >
            {/* Error Message Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-[14px] text-[14px] flex items-start gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email address"
                className="w-full bg-[#F8F9FA] border border-transparent text-gray-800 px-5 py-3.5 rounded-[14px] placeholder-gray-400 focus:outline-none focus:border-[#000068] focus:ring-4 focus:ring-[#000068]/30 transition-all text-[15px]"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                className="w-full bg-[#F8F9FA] border border-transparent text-gray-800 px-5 py-3.5 rounded-[14px] placeholder-gray-400 focus:outline-none focus:border-[#000068] focus:ring-4 focus:ring-[#000068]/30 transition-all text-[15px]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye Icon (Visible) */
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  /* Eye Slash Icon (Hidden) */
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right pb-3">
              <Link
                href="#"
                className="text-[13px] text-gray-400 hover:text-[#000068] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-[#000068] hover:bg-[#000068]Hover text-white font-semibold py-3.5 rounded-[14px] transition-all text-[15px] shadow-[0_4px_14px_0_rgba(0,0,104,0.39)] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8 w-full max-w-[400px] mx-auto">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-4 text-[13px] text-gray-400 font-medium">
              atau
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex w-full max-w-[400px] mx-auto">
            {/* Google Button */}
            <button
              type="button"
              className="cursor-pointer w-full h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Lanjutkan dengan Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
