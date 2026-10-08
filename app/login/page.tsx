"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1440px] min-h-[calc(100vh-3rem)] flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center justify-center">
        <div className="hidden lg:flex relative w-full h-full min-h-[640px] lg:min-h-[720px] rounded-[36px] overflow-hidden bg-[#BB1A8CB2] p-8 sm:p-12 flex-col justify-between shadow-sm">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/white-silk-fabric-with-elegant-texture-shiny-surface 1.png"
              alt="Obrin Silk Texture"
              fill
              className="object-cover select-none"
              priority
            />
            <div className="absolute inset-0 bg-[#BB1A8CB2] mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#BB1A8CB2]/40" />
          </div>

          <div className="relative z-10">
            <Image
              src="/logo.png"
              alt="Obrin Health"
              width={160}
              height={56}
              className="w-auto h-11 sm:h-12 brightness-0 invert object-contain"
              priority
            />
          </div>

          {/* Bottom Cards */}
          <div className="relative z-10 flex gap-4 sm:gap-6 w-full pt-8">
            <div className="flex-1 bg-white rounded-[24px] h-44 sm:h-52 shadow-sm" />
            <div className="flex-1 bg-white rounded-[24px] h-44 sm:h-52 shadow-sm" />
          </div>
        </div>

        {/* Right Side: Admin Login Card */}
        <div className="w-full flex flex-col items-center justify-center py-6 sm:py-8">
          <div className="lg:hidden mb-6">
            <Image
              src="/logo.png"
              alt="Obrin Health"
              width={160}
              height={56}
              className="w-auto h-11 object-contain"
              priority
            />
          </div>
          <div className="w-full max-w-[440px] bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                Admin Login
              </h1>
              <p className="text-sm text-[#667085] mt-1.5 font-normal">
                Enter your admin credentials
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 text-sm text-[#101828] placeholder-[#98A2B3] bg-white border border-[#D0D5DD] rounded-[14px] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#344054] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 text-sm text-[#101828] placeholder-[#98A2B3] bg-white border border-[#D0D5DD] rounded-[14px] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085] transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#BB1A8C] hover:bg-[#A31478] active:scale-[0.99] text-white font-semibold text-sm rounded-[16px] transition-all shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              {/* Reset Password Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-[#667085]">
                  Forgot your password?{" "}
                  <Link
                    href="/reset-password"
                    className="text-[#BB1A8C] hover:underline font-semibold"
                  >
                    Reset password now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
