"use client";

import React from "react";
import { User, Check } from "lucide-react";

interface UserHeaderCardProps {
  activeTab: "Overview" | "Referrals" | "Services";
  onTabChange: (tab: "Overview" | "Referrals" | "Services") => void;
}

const miniStats = [
  { label: "Clinic Search", value: "4" },
  { label: "Generated Code", value: "4" },
  { label: "Redeemed Code", value: "4" },
  { label: "Conversion", value: "80%" },
  { label: "Last Active", value: "10 Days Ago" },
];

export const UserHeaderCard: React.FC<UserHeaderCardProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-xs mb-6">
      {/* User Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="size-14 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
            <User className="size-7" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[19px] sm:text-[20px] font-bold text-[#101828]">
                Emmanuel Adebayo
              </h2>
              {/* Active Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#027A48] text-white">
                Active
                <Check className="size-3 stroke-[3]" />
              </span>
            </div>
            <p className="text-[13px] text-[#667085] mt-0.5">
              Provider ID: HFHG8794
            </p>
          </div>
        </div>
      </div>

      {/* Last Active Day */}
      <div className="mb-5 text-[13px]">
        <span className="text-[#667085]">Last Active day: </span>
        <span className="font-semibold text-[#101828]">
          Sept 10, 2026, 10:00AM
        </span>
      </div>

      {/* 5 Mini-Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        {miniStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-2xs hover:border-[#BB1A8C]/30 transition-colors"
          >
            <span className="text-[12px] text-[#667085] block leading-tight">
              {stat.label}
            </span>
            <span className="font-general-sans text-[22px] sm:text-[24px] font-bold text-[#101828] block mt-2 tracking-tight">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-[#EAECF0] -mb-6">
        {(["Overview", "Referrals", "Services"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`pb-3 text-[14px] font-medium transition-colors cursor-pointer relative ${
                isActive
                  ? "text-[#BB1A8C] font-semibold"
                  : "text-[#667085] hover:text-[#101828]"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#BB1A8C]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserHeaderCard;
