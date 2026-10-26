"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useUpdateAmbassador,
  useUploadAmbassadorPhoto,
} from "@/hooks/use-ambassadors";
import { getApiErrorMessage } from "@/lib/api";
import type { AmbassadorDetail } from "@/types/ambassadors";

interface EditAmbassadorModalProps {
  id?: string;
  ambassador?: AmbassadorDetail;
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
  id = "",
  ambassador,
  isOpen,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ambassador) {
      setFullName(ambassador.fullName || ambassador.name || "");
      setEmail(ambassador.email || "");
      setPhone(ambassador.phoneNumber || "");
      setLocation(ambassador.location || "");
      if (ambassador.photoUrl) {
        setPhotoPreview(ambassador.photoUrl);
      }
    }
  }, [ambassador, isOpen]);

  const updateMutation = useUpdateAmbassador();
  const uploadPhotoMutation = useUploadAmbassadorPhoto();
  const isSaving = updateMutation.isPending || uploadPhotoMutation.isPending;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let photoUrl: string | undefined = undefined;
      if (photoFile) {
        photoUrl = await uploadPhotoMutation.mutateAsync(photoFile);
      }

      if (id) {
        await updateMutation.mutateAsync({
          id,
          payload: {
            fullName: fullName.trim() || undefined,
            phoneNumber: phone.trim() || undefined,
            email: email.trim() || undefined,
            location: location.trim() || undefined,
            photoUrl: photoUrl || ambassador?.photoUrl || undefined,
          },
        });
      }

      if (onSave) {
        onSave({
          name: fullName,
          email,
          phone,
          location,
        });
      }

      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update ambassador profile."));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-120 p-6 rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <DialogTitle className="text-[18px] font-bold text-[#101828]">
            Edit Ambassador
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[14px] text-[#101828] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Profile Photo
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
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors disabled:opacity-50"
            >
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAmbassadorModal;
