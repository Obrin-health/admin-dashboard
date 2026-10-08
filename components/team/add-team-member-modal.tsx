"use client";

import React, { useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => void;
}

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTeamMemberModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const roleOptions = ["Super Admin", "Admin", "Support"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmit({
      firstName,
      lastName,
      email,
      role: role || "Admin",
    });
    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("Admin");
    setIsRoleDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[500px] bg-white rounded-3xl p-7 sm:p-8 shadow-2xl z-10 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-[#101828] leading-tight">
              Add new team member
            </h2>
            <p className="text-[14px] text-[#667085] mt-1">
              Fill the details of new team member below
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#667085] hover:text-[#101828] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First name & Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="teamFirstName"
                className="block text-[13px] font-medium text-[#344054] mb-1.5"
              >
                First name
              </label>
              <input
                id="teamFirstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="teamLastName"
                className="block text-[13px] font-medium text-[#344054] mb-1.5"
              >
                Last name
              </label>
              <input
                id="teamLastName"
                type="text"
                placeholder="Oshuporu"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
                required
              />
            </div>
          </div>

          {/* Email address */}
          <div>
            <label
              htmlFor="teamEmail"
              className="block text-[13px] font-medium text-[#344054] mb-1.5"
            >
              Email address
            </label>
            <input
              id="teamEmail"
              type="email"
              placeholder="emma_oshu@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C]"
              required
            />
          </div>

          {/* Role Selection Dropdown */}
          <div className="relative">
            <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
              Select role
            </label>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
              className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 flex items-center justify-between text-[14px] text-[#101828] outline-none transition-colors hover:border-[#98A2B3] focus:border-[#BB1A8C] cursor-pointer"
            >
              <span>{role || "Select Option"}</span>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer mt-4"
          >
            Add team member
          </button>
        </form>
      </div>
    </div>
  );
}
