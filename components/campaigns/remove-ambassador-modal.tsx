"use client";

import React from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RemoveAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  ambassadorName?: string;
  avatarUrl?: string | null;
  isLoading?: boolean;
}

export const RemoveAmbassadorModal: React.FC<RemoveAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ambassadorName = "Ambassador",
  avatarUrl,
  isLoading = false,
}) => {
  const handleRemove = () => {
    if (onConfirm) onConfirm();
  };

  const initial = ambassadorName.charAt(0).toUpperCase() || "A";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-105 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between pb-3">
          <DialogTitle className="text-[16px] font-bold text-[#101828]">
            Remove Ambassador
          </DialogTitle>
        </DialogHeader>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center py-4">
          <div className="relative size-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shadow-xs mb-3 flex items-center justify-center">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={ambassadorName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="size-full bg-[#1D2939] text-white flex items-center justify-center text-xl font-bold">
                {initial}
              </div>
            )}
          </div>

          <h4 className="text-[16px] font-bold text-[#101828]">
            {ambassadorName}
          </h4>

          <p className="text-[13px] text-[#667085] mt-2 max-w-70 leading-relaxed">
            Are you sure you want to remove this ambassador from this campaign?
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 w-full mt-7">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleRemove}
              className="py-2.5 px-5 rounded-xl bg-[#D92D20] hover:bg-[#B42318] text-white text-[13px] font-medium transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              <span>{isLoading ? "Removing..." : "Remove Ambassador"}</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl border border-[#D0D5DD] bg-white text-[#BB1A8C] hover:bg-gray-50 text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Go back
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveAmbassadorModal;
