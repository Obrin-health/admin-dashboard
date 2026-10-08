"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
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
  avatarUrl?: string;
}

export const RemoveAmbassadorModal: React.FC<RemoveAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ambassadorName = "James Werinipre",
  avatarUrl = "/james-werinipre.jpg",
}) => {
  const handleRemove = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between pb-3">
          <DialogTitle className="text-[16px] font-bold text-[#101828]">
            Remove Ambassador
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </DialogHeader>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center py-4">
          <div className="relative size-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shadow-xs mb-3">
            <Image
              src={avatarUrl}
              alt={ambassadorName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <h4 className="text-[16px] font-bold text-[#101828]">
            {ambassadorName}
          </h4>

          <p className="text-[13px] text-[#667085] mt-2 max-w-[280px] leading-relaxed">
            Are you sure you want to remove this ambassador from this campaign?
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 w-full mt-7">
            <button
              type="button"
              onClick={handleRemove}
              className="py-2.5 px-5 rounded-xl bg-[#D92D20] hover:bg-[#B42318] text-white text-[13px] font-medium transition-colors shadow-xs cursor-pointer"
            >
              Remove Ambassador
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl border border-[#D0D5DD] bg-white text-[#BB1A8C] hover:bg-gray-50 text-[13px] font-medium transition-colors cursor-pointer"
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
