"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CircleUserRound, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import UploadImageModal from "./upload-image-modal";
import {
  useAdminProfile,
  useUpdateAdminProfile,
  useUploadAvatar,
} from "@/hooks/use-settings";

export default function ProfileDetailsForm() {
  const { data: profile, isLoading } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSavedNotification(null);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
      });
      setSavedNotification("Profile details saved successfully!");
      setTimeout(() => {
        setSavedNotification(null);
      }, 4000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile details.";
      setErrorMessage(msg);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
    }
    setErrorMessage(null);
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
      setIsModalOpen(false);
      setSavedNotification("Profile image uploaded successfully!");
      setTimeout(() => {
        setSavedNotification(null);
      }, 4000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload profile image.";
      setErrorMessage(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full font-sans select-none space-y-6">
        <div className="border border-[#EAECF0] rounded-2xl p-6 bg-white shadow-2xs animate-pulse flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gray-100" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-48 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-100 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-11 bg-gray-100 rounded-xl" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-11 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans select-none">
      {/* Toast Notification */}
      {savedNotification && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{savedNotification}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Profile Image Card */}
      <div className="border border-[#EAECF0] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white shadow-2xs">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar Thumbnail */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F4F5F7] flex items-center justify-center border border-[#EAECF0] overflow-hidden shrink-0 relative">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt="Profile Avatar"
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <CircleUserRound className="w-9 h-9 text-[#5D6B90]" />
            )}
          </div>

          {/* Info Text */}
          <div>
            <h3 className="text-[16px] font-bold text-[#101828] leading-tight">
              Profile image
            </h3>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mt-1">
              Jpegs and PNGs allowed. Max size: 2mb
            </p>
          </div>
        </div>

        {/* Upload Image Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="border border-[#BB1A8C] text-[#BB1A8C] hover:bg-[#BB1A8C]/5 rounded-full px-5 py-2 text-[14px] font-medium transition-colors cursor-pointer shrink-0"
        >
          Upload image
        </button>
      </div>

      {/* Your Profile Details Form */}
      <form onSubmit={handleSave}>
        <div className="mb-6">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#101828] leading-tight">
            Your profile details
          </h2>
          <p className="text-[14px] text-[#667085] mt-1">
            Update your profile details below
          </p>
        </div>

        <div className="space-y-5">
          {/* First name & Last name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[14px] font-medium text-[#344054] mb-2"
              >
                First name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-[14px] font-medium text-[#344054] mb-2"
              >
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-[14px] font-medium text-[#344054] mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-6">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="py-3 px-6 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save changes"
              )}
            </button>
            <button
              type="button"
              disabled={updateProfileMutation.isPending}
              onClick={handleCancel}
              className="py-3 px-6 rounded-xl border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#344054] text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      {/* Upload Image Modal */}
      <UploadImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentImage={profile?.avatarUrl}
        isUploading={uploadAvatarMutation.isPending}
        onSave={handleAvatarUpload}
      />
    </div>
  );
}
