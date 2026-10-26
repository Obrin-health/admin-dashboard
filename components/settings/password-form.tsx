"use client";

import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useChangePassword } from "@/hooks/use-settings";

export default function PasswordForm() {
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      setNotification("Password successfully updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update password. Please verify your current password.";
      setErrorMessage(msg);
    }
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
    setNotification(null);
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

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Header section with Reset button on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#101828] leading-tight">
            Reset Account Password
          </h2>
          <p className="text-[14px] text-[#667085] mt-1">
            Change your account password. Must be at least 8 characters with letters and numbers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="border border-[#BB1A8C] text-[#BB1A8C] hover:bg-[#BB1A8C]/5 rounded-full px-5 py-2 text-[14px] font-medium transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          Clear
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
                placeholder="Enter new password (min. 8 characters)"
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
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11.5 rounded-xl border border-[#D0D5DD] bg-white px-4 pr-11 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                placeholder="Re-enter new password"
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

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="py-3 px-6 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
