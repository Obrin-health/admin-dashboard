"use client";

import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface DeleteCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  campaignName?: string;
}

export const DeleteCampaignModal: React.FC<DeleteCampaignModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  campaignName,
}) => {
  const handleDelete = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[440px] p-7 rounded-2xl bg-white shadow-2xl border border-gray-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-start pt-1">
          {/* Info Icon Box */}
          <div className="size-12 rounded-xl bg-[#F2F4F7] flex items-center justify-center mb-5">
            <div className="size-6 rounded-full bg-[#475467] text-white flex items-center justify-center text-[13px] font-serif font-bold italic">
              i
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-[19px] font-bold text-[#101828] mb-1.5">
            Delete Campaign
          </h3>
          <p className="text-[14px] text-[#475467] mb-7 leading-normal">
            Are you sure you want to delete this campaign{campaignName ? ` "${campaignName}"` : ""}?
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#D92D20] hover:bg-[#B42318] text-white text-[14px] font-medium transition-colors shadow-xs cursor-pointer text-center"
            >
              Delete Campaign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#D0D5DD] bg-white text-[#BB1A8C] hover:bg-gray-50 text-[14px] font-medium transition-colors cursor-pointer text-center"
            >
              Go back
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCampaignModal;
