"use client";

import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    setNotification("Password successfully updated!");
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full font-sans select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Header section with Reset Password button on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#101828] leading-tight">
            Reset Account Password
          </h2>
          <p className="text-[14px] text-[#667085] mt-1">
            Reset your account password details below.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="border border-[#BB1A8C] text-[#BB1A8C] hover:bg-[#BB1A8C]/5 rounded-full px-5 py-2 text-[14px] font-medium transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          Reset Password
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-[14px] font-medium text-[#344054] mb-2"
            >
              Current password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 pr-11 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467] p-1 cursor-pointer transition-colors"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-[14px] font-medium text-[#344054] mb-2"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 pr-11 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467] p-1 cursor-pointer transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[14px] font-medium text-[#344054] mb-2"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 pr-11 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467] p-1 cursor-pointer transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
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
            onClick={handleReset}
            className="py-2.5 px-6 rounded-full border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#344054] text-[14px] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
