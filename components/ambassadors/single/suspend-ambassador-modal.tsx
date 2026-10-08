"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuspendAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  ambassadorName?: string;
}

export const SuspendAmbassadorModal: React.FC<SuspendAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  ambassadorName = "Emmanuel Adebayo",
}) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[420px] p-6 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5 text-red-600">
            <AlertTriangle className="size-5" />
            <DialogTitle className="text-[17px] font-bold text-[#101828]">
              Suspend Ambassador
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-[13px] text-[#475467] leading-relaxed">
            Are you sure you want to suspend <strong className="text-[#101828]">{ambassadorName}</strong>?
            Their referral link will be deactivated and they will not be able to generate new rewards.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium shadow-xs transition-colors"
          >
            Suspend Ambassador
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendAmbassadorModal;
