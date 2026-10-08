"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedData: {
    name: string;
    email: string;
    phone: string;
    location: string;
  }) => void;
}

export const EditAmbassadorModal: React.FC<EditAmbassadorModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("Emmanuel Adebayo");
  const [email, setEmail] = useState("emmanueladebayo2012@gmail.com");
  const [phone, setPhone] = useState("+234 8175927055");
  const [location, setLocation] = useState("Ikeja, Lagos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ name, email, phone, location });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] p-6 rounded-2xl bg-white shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <DialogTitle className="text-[18px] font-bold text-[#101828]">
            Edit Ambassador
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
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
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAmbassadorModal;
