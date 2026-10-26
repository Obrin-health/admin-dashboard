"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Check, Loader2 } from "lucide-react";
import type { TeamRole } from "@/types/team";

export interface TeamMember {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "Super Admin" | "Admin" | "Support";
  dateJoined: string;
  lastActive: string;
  status: "Active" | "Inactive" | "Disabled";
  avatarInitials: string;
}

export interface EditTeamMemberPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamRole;
}

interface EditTeamMemberModalProps {
  isOpen: boolean;
  member: TeamMember | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSave: (payload: EditTeamMemberPayload) => void;
}

export default function EditTeamMemberModal({
  isOpen,
  member,
  isSubmitting = false,
  onClose,
  onSave,
}: EditTeamMemberModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Super Admin" | "Admin" | "Support">("Admin");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (member) {
      if (member.firstName || member.lastName) {
        setFirstName(member.firstName || "");
        setLastName(member.lastName || "");
      } else {
        const parts = (member.name || "").trim().split(/\s+/);
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      setEmail(member.email || "");
      setRole(member.role || "Admin");
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const roleOptions: ("Super Admin" | "Admin" | "Support")[] = [
    "Super Admin",
    "Admin",
    "Support",
  ];

  const mapRoleToApi = (r: "Super Admin" | "Admin" | "Support"): TeamRole => {
    switch (r) {
      case "Super Admin":
        return "SUPER_ADMIN";
      case "Support":
        return "SUPPORT";
      default:
        return "ADMIN";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      return;
    }

    onSave({
      id: member.id,
      firstName: trimmedFirst,
      lastName: trimmedLast,
      email: trimmedEmail,
      role: mapRoleToApi(role),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[480px] bg-white rounded-3xl p-7 sm:p-8 shadow-2xl z-10 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-[#101828] leading-tight">
              Edit team member
            </h2>
            <p className="text-[14px] text-[#667085] mt-1">
              Update team member details and access role below
            </p>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="p-1 rounded-full text-[#667085] hover:text-[#101828] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C]"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C]"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C]"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="relative">
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Role
            </label>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
              className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 flex items-center justify-between text-[14px] text-[#101828] outline-none transition-colors hover:border-[#98A2B3] focus:border-[#BB1A8C] cursor-pointer disabled:opacity-50"
            >
              <span>{role}</span>
              <ChevronDown className="w-4 h-4 text-[#667085]" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#EAECF0] rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                {roleOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setRole(opt);
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-[14px] text-[#344054] hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{opt}</span>
                    {role === opt && (
                      <Check className="w-4 h-4 text-[#BB1A8C]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
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
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#344054] text-[14px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
