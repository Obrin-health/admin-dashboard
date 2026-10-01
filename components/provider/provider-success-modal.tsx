"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProviderSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProviderSuccessModal: React.FC<ProviderSuccessModalProps> = ({
  open,
  onOpenChange,
}) => {
  const router = useRouter();

  const handleContinue = () => {
    onOpenChange(false);
    router.push("/provider");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-8 sm:p-10">
        {/* Large Magenta Circular Checkmark Badge */}
        <div className="mx-auto flex items-center justify-center size-28 mb-4">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            className="w-full h-full text-primary"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M30 52 L44 66 L72 38"
              stroke="currentColor"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <DialogTitle className="text-2xl font-bold text-[#101828] mb-2 tracking-tight">
          Provider Submitted
        </DialogTitle>

        {/* Subtitle */}
        <DialogDescription className="text-sm sm:text-base text-[#667085] leading-relaxed mb-8 max-w-[260px] mx-auto">
          You have successfully onboarded a new provider
        </DialogDescription>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 rounded-full bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          Continue
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderSuccessModal;
