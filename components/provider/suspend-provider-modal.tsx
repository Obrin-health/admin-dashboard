"use client";

import React from "react";
import { AlertTriangle, CheckCircle, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuspendProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  providerName?: string;
  isSuspending: boolean; // true = action is to suspend, false = action is to activate
  isLoading?: boolean;
}

export const SuspendProviderModal: React.FC<SuspendProviderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  providerName = "Provider",
  isSuspending,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="max-w-[420px] p-6 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <div
            className={`flex items-center gap-2.5 ${
              isSuspending ? "text-red-600" : "text-green-600"
            }`}
          >
            {isSuspending ? (
              <AlertTriangle className="size-5" />
            ) : (
              <CheckCircle className="size-5" />
            )}
            <DialogTitle className="text-[17px] font-bold text-[#101828]">
              {isSuspending ? "Suspend Provider" : "Activate Provider"}
            </DialogTitle>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <p className="text-[13px] text-[#475467] leading-relaxed">
            {isSuspending ? (
              <>
                Are you sure you want to suspend{" "}
                <strong className="text-[#101828]">{providerName}</strong>?
                This provider will not be able to receive or redeem new referrals while suspended.
              </>
            ) : (
              <>
                Are you sure you want to activate{" "}
                <strong className="text-[#101828]">{providerName}</strong>?
                This provider will be restored to active status and will be able to receive and redeem referrals.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer ${
              isSuspending
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSuspending ? "Suspend Provider" : "Activate Provider"}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendProviderModal;
