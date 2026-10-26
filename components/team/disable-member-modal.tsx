"use client";

import React from "react";
import { X, Info, Loader2 } from "lucide-react";

interface DisableMemberModalProps {
  isOpen: boolean;
  memberName?: string;
  isCurrentlyDisabled?: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DisableMemberModal({
  isOpen,
  memberName,
  isCurrentlyDisabled = false,
  isSubmitting = false,
  onClose,
  onConfirm,
}: DisableMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-8 shadow-2xl z-10 transition-all text-left">
        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-full text-[#667085] hover:text-[#101828] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Info Icon Box */}
        <div className="size-12 rounded-2xl bg-[#F2F4F7] flex items-center justify-center text-[#344054] mb-5">
          <Info className="size-6 text-[#475467]" />
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#101828] leading-tight">
          {isCurrentlyDisabled ? "Enable Team Member?" : "Disable Team Member?"}
        </h2>

        {/* Description */}
        <p className="text-[14px] text-[#667085] mt-2 mb-8 leading-relaxed">
          {isCurrentlyDisabled
            ? `Are you sure you want to re-enable ${memberName || "this team member"}? Their access will be restored.`
            : `Are you sure you want to disable ${memberName || "this team member"}? Their access will be paused until you enable them again. Kindly confirm below.`}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : isCurrentlyDisabled ? (
              "Enable"
            ) : (
              "Disable"
            )}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#344054] text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
