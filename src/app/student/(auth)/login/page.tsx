"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function StudentLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Modern action handler uses FormData instead of an event
  const handleLoginAction = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let isValid = true;
    const newErrors = { email: false, password: false };

    if (!validateEmail(email)) {
      newErrors.email = true;
      isValid = false;
    }

    if (password.length < 8) {
      newErrors.password = true;
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsLoading(true);
      
      // Simulate Auth Call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Welcome to Bloomly! Login successful.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-0"
      style={{ 
        backgroundImage: "url('/img/bg.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="w-full md:w-[480px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-floating p-8 md:p-10 z-20">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-sm">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
        </div>

        {/* Replaced onSubmit with action={handleLoginAction} */}
        <form action={handleLoginAction} className="flex flex-col gap-5" noValidate>
          
          <div className="form-group">
            <label htmlFor="email" className="block text-xs leading-relaxed font-bold text-[#181524] mb-1.5 ml-1">
              Email
            </label>
            <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181524] ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              {/* Note: 'name' attribute is REQUIRED for FormData to work */}
              <input 
                type="email" 
                id="email"
                name="email"
                className="w-full bg-transparent h-12 px-3 text-sm outline-none placeholder-gray-400"
                placeholder="Masukkan Email" 
                required 
                autoComplete="email" 
              />
            </div>
            {errors.email && (
              <p className="error-msg text-xs text-red-500 mt-1 ml-1">Please enter a valid email address.</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-xs font-bold text-[#181524] mb-1.5 ml-1">
              Password
            </label>
            <div className={`relative flex items-center bg-white border rounded-xl focus-within:ring-2 focus-within:ring-[#000068] transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#181524] ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              {/* Note: 'name' attribute is REQUIRED for FormData to work */}
              <input 
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full bg-transparent h-12 pl-3 pr-10 text-sm outline-none placeholder-gray-400"
                placeholder="Masukkan password" 
                required 
                minLength={8} 
              />
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
            </div>
            {errors.password && (
              <p className="error-msg text-xs text-red-500 mt-1 ml-1">Password must be at least 8 characters.</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-gradient-to-r from-[#000068] to-[#000068] text-white font-semibold rounded-xl shadow-btn hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4  text-xs">atau</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex flex-col gap-3">
                <a href='/parent/login'
                    className="w-full h-11 bg-[#026aa2] border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-bold hover:bg-blue-light-800 text-white transition-colors">

                    Login sebagai Orangtua
                </a>
                <button type="button"
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4" />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853" />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05" />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335" />
                    </svg>
                    Lanjutkan dengan Google
                </button>
            </div>

            <p className="text-center text-xs  mt-2">
                Tidak punya akun? <a href="#" className="text-[#181524] hover:underline font-semibold">Sign in</a>
            </p>

        </form>
      </div>
    </div>
  );
}