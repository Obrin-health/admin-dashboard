"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CircleUserRound, CheckCircle2 } from "lucide-react";
import UploadImageModal from "./upload-image-modal";

export default function ProfileDetailsForm() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("obrinhealth@gmail.com");
  const [profileImage, setProfileImage] = useState<string>("/settings-avatar.jpg");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification("Profile details saved successfully!");
    setTimeout(() => {
      setSavedNotification(null);
    }, 3500);
  };

  const handleCancel = () => {
    setFirstName("John");
    setLastName("Doe");
    setEmail("obrinhealth@gmail.com");
  };

  return (
    <div className="w-full font-sans select-none">
      {/* Toast Notification */}
      {savedNotification && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{savedNotification}</span>
        </div>
      )}

      {/* Profile Image Card */}
      <div className="border border-[#EAECF0] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white shadow-2xs">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar Thumbnail */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F4F5F7] flex items-center justify-center border border-[#EAECF0] overflow-hidden shrink-0 relative">
            {profileImage ? (
              <Image
                src={profileImage}
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
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
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
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Email address */}
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
              className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-10">
          <button
            type="submit"
            className="py-2.5 px-6 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-medium shadow-xs transition-colors cursor-pointer"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="py-2.5 px-6 rounded-full border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#344054] text-[14px] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Modal Dialog */}
      <UploadImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentImage={profileImage}
        onSave={(newImage) => setProfileImage(newImage)}
      />
    </div>
  );
}
