"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Validation rules matching screenshot
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessOpen(true);
  };

  const handleModalClose = () => {
    setIsSuccessOpen(false);
  };

  const handleLoginRedirect = () => {
    setIsSuccessOpen(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Obrin Health Logo */}
      <div className="mb-6">
        <Link href="/login" className="inline-block">
          <Image
            src="/logo.png"
            alt="Obrin Health"
            width={160}
            height={56}
            className="w-auto h-12 object-contain"
            priority
          />
        </Link>
      </div>

      {/* Reset Password Card */}
      <div className="w-full max-w-[460px] bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10">
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#101828]">
            Password Reset
          </h1>
          <p className="text-sm text-[#667085] mt-1.5 font-normal">
            Create a strong password to protect your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#344054] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pr-11 text-sm text-[#101828] placeholder-[#98A2B3] bg-white border border-[#D0D5DD] rounded-[14px] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085] transition-colors p-1"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements Checklist */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1">
            <CriterionItem satisfied={hasMinLength} label="≥8 Characters" />
            <CriterionItem satisfied={hasUppercase} label="Uppercase" />
            <CriterionItem satisfied={hasLowercase} label="Lowercase" />
            <CriterionItem satisfied={hasNumber} label="Number" />
            <CriterionItem satisfied={hasSpecial} label="Special character (e.g !@#$)" className="col-span-2" />
          </div>

          {/* Confirm Password */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#344054] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pr-11 text-sm text-[#101828] placeholder-[#98A2B3] bg-white border border-[#D0D5DD] rounded-[14px] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085] transition-colors p-1"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
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
              className="w-full py-3.5 bg-[#BB1A8C] hover:bg-[#A31478] active:scale-[0.99] text-white font-semibold text-sm rounded-[16px] transition-all shadow-sm cursor-pointer"
            >
              Sign in
            </button>
          </div>

          {/* Return to Login */}
          <div className="text-center pt-2">
            <p className="text-sm text-[#667085]">
              Remember Password?{" "}
              <Link
                href="/login"
                className="text-[#BB1A8C] hover:underline font-semibold"
              >
                Return to Login Now
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Password Changed Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] bg-white rounded-[32px] p-8 sm:p-10 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleModalClose}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Checkmark Circle Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-[5px] border-[#BB1A8C] flex items-center justify-center text-[#BB1A8C]">
              <svg
                className="w-12 h-12 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#101828] mb-2.5">
              Password Changed
            </h2>
            <p className="text-sm text-[#667085] leading-relaxed max-w-[320px] mx-auto mb-8 font-normal">
              You account password have been successfully changed. Log in with your new password now
            </p>

            {/* Log in Now Button */}
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="w-full py-3.5 bg-[#BB1A8C] hover:bg-[#A31478] active:scale-[0.99] text-white font-semibold text-sm rounded-[16px] transition-all shadow-sm cursor-pointer"
            >
              Log in Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CriterionItem({
  satisfied,
  label,
  className = "",
}: {
  satisfied: boolean;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          satisfied ? "bg-[#12B76A] text-white" : "border border-gray-300 text-transparent"
        }`}
      >
        <svg
          className="w-2.5 h-2.5 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span
        className={`text-xs transition-colors ${
          satisfied ? "text-[#344054] font-medium" : "text-[#667085]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
