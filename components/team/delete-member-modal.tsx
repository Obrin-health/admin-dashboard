"use client";

import React from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteMemberModalProps {
  isOpen: boolean;
  memberName?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMemberModal({
  isOpen,
  memberName,
  isSubmitting = false,
  onClose,
  onConfirm,
}: DeleteMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[460px] bg-white rounded-3xl p-7 sm:p-8 shadow-2xl z-10 transition-all text-left">
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

        {/* Warning Icon Box */}
        <div className="size-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-5">
          <AlertTriangle className="size-6 text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#101828] leading-tight">
          Delete Team Member?
        </h2>

        {/* Description */}
        <p className="text-[14px] text-[#667085] mt-2 mb-8 leading-relaxed">
          Are you sure you want to permanently remove {memberName || "this member"} from the team? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              "Yes, delete"
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
