"use client";

import React from "react";
import { X, Check } from "lucide-react";

interface InviteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function InviteSuccessModal({
  isOpen,
  onClose,
  message = "You have successfully invited an admin user",
}: InviteSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[460px] bg-white rounded-3xl p-8 shadow-2xl z-10 transition-all text-center">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-[#667085] hover:text-[#101828] hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Circular Success Icon */}
        <div className="mx-auto my-4 size-24 rounded-full border-[5px] border-[#BB1A8C] flex items-center justify-center bg-white shadow-xs">
          <Check className="size-12 text-[#BB1A8C] stroke-[3.5]" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-[20px] sm:text-[22px] font-bold text-[#101828] mt-5 leading-tight">
          Team Member Successfully Invited
        </h2>
        <p className="text-[14px] text-[#667085] mt-2 mb-8 max-w-sm mx-auto">
          {message}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[15px] font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
