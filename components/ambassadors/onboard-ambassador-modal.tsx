"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OnboardAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (ambassadorData: {
    name: string;
    contactNumber: string;
    campaign: string;
    type: "Physical" | "Digital";
  }) => void;
}

export const OnboardAmbassadorModal: React.FC<OnboardAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [campaign, setCampaign] = useState("Unilag Outreach");
  const [type, setType] = useState<"Physical" | "Digital">("Physical");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (onSuccess) {
      onSuccess({
        name,
        contactNumber: contactNumber || "+234 8000000000",
        campaign,
        type,
      });
    }

    setName("");
    setContactNumber("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] p-6 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <DialogTitle className="text-[18px] font-bold text-[#101828]">
            Onboard new Ambassador
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Ambassador Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Emmanuel Adebayo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="+234 8175927055"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Campaign
            </label>
            <select
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[14px] text-[#101828] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            >
              <option value="Unilag Outreach">Unilag Outreach</option>
              <option value="Ambassador">Ambassador</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Youth Healthcare Initiative">Youth Healthcare Initiative</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Ambassador Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("Physical")}
                className={`py-2 px-3 rounded-lg border text-[13px] font-medium transition-colors ${
                  type === "Physical"
                    ? "border-[#BB1A8C] bg-[#FDF2FA] text-[#BB1A8C]"
                    : "border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50"
                }`}
              >
                Physical
              </button>
              <button
                type="button"
                onClick={() => setType("Digital")}
                className={`py-2 px-3 rounded-lg border text-[13px] font-medium transition-colors ${
                  type === "Digital"
                    ? "border-[#BB1A8C] bg-[#FDF2FA] text-[#BB1A8C]"
                    : "border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50"
                }`}
              >
                Digital
              </button>
            </div>
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
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors"
            >
              Onboard Ambassador
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardAmbassadorModal;
