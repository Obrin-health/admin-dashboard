"use client";

import React, { useState } from "react";
import { X, Upload, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateAmbassador,
  useUploadAmbassadorPhoto,
} from "@/hooks/use-ambassadors";
import { getApiErrorMessage } from "@/lib/api";

interface OnboardAmbassadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (ambassadorData: {
    id?: string;
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
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [campaign, setCampaign] = useState("Unilag Outreach");
  const [type, setType] = useState<"Physical" | "Digital">("Physical");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateAmbassador();
  const uploadPhotoMutation = useUploadAmbassadorPhoto();
  const isSubmitting = createMutation.isPending || uploadPhotoMutation.isPending;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      setError("Full name and phone number are required.");
      return;
    }
    setError(null);

    try {
      let photoUrl: string | undefined = undefined;
      if (photoFile) {
        photoUrl = await uploadPhotoMutation.mutateAsync(photoFile);
      }

      const created = await createMutation.mutateAsync({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        location: location.trim() || undefined,
        photoUrl,
      });

      if (onSuccess) {
        onSuccess({
          id: created?.id,
          name: fullName.trim(),
          contactNumber: phoneNumber.trim(),
          campaign,
          type,
        });
      }

      setFullName("");
      setPhoneNumber("");
      setEmail("");
      setLocation("");
      setPhotoFile(null);
      setPhotoPreview(null);
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to onboard ambassador."));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-125 p-6 rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <DialogTitle className="text-[18px] font-bold text-[#101828]">
            Onboard new Ambassador
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mt-3 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Ambassador Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+234..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="emmanuel@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Ikeja, Lagos"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="size-12 rounded-full object-cover border border-[#EAECF0]"
                />
              ) : (
                <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-[#EAECF0]">
                  <Upload className="size-4" />
                </div>
              )}
              <label className="cursor-pointer px-3 py-1.5 border border-[#D0D5DD] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors">
                Choose photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {photoFile && (
                <span className="text-[12px] text-[#667085] truncate max-w-37.5">
                  {photoFile.name}
                </span>
              )}
            </div>
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
                className={`py-2 px-3 rounded-lg border text-[13px] font-medium transition-colors ${type === "Physical"
                  ? "border-[#BB1A8C] bg-[#FDF2FA] text-[#BB1A8C]"
                  : "border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50"
                  }`}
              >
                Physical
              </button>
              <button
                type="button"
                onClick={() => setType("Digital")}
                className={`py-2 px-3 rounded-lg border text-[13px] font-medium transition-colors ${type === "Digital"
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
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              <span>{isSubmitting ? "Onboarding..." : "Onboard Ambassador"}</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardAmbassadorModal;
