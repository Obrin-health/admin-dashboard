"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Building2 } from "lucide-react";

export const UserQuickStatsMap: React.FC = () => {
  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Quick Statistics Header */}
      <div className="flex items-center gap-2.5">
        <div className="size-7 flex items-center justify-center shrink-0">
          <Image
            src="/provider/quick-stat.png"
            alt="Quick Statistics"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[12px] font-bold text-[#0780E2] tracking-wider uppercase font-general-sans">
          QUICK STATISTICS
        </span>
      </div>

      {/* 2x2 Quick Statistics Grid */}
      <div className="rounded-xl bg-[#FAFAFC] border border-[#EAECF0] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stat 1: Clinic Searches */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 border border-teal-100">
            <Building2 className="size-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Clinic Searches
            </span>
            <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
              245
            </span>
          </div>
        </div>

        {/* Stat 2: Total Referrals Generated */}
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center shrink-0">
            <Image
              src="/provider/referrals.png"
              alt="Total Referrals Generated"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Total Referrals Generated
            </span>
            <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
              245
            </span>
          </div>
        </div>

        {/* Stat 3: Total Redeemed */}
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center shrink-0">
            <Image
              src="/provider/redeemed.png"
              alt="Total Redeemed"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Total Redeemed
            </span>
            <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
              245
            </span>
          </div>
        </div>

        {/* Stat 4: Conversion Rate */}
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center shrink-0">
            <Image
              src="/provider/rate.png"
              alt="Conversion Rate"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Conversion Rate
            </span>
            <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
              245
            </span>
          </div>
        </div>
      </div>

      {/* Map Preview Card */}
      <div className="rounded-xl border border-[#EAECF0] overflow-hidden bg-white shadow-2xs">
        {/* Stylized SVG Map Illustration */}
        <div className="h-32 w-full bg-[#E8EEF5] relative overflow-hidden flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            viewBox="0 0 400 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Roads */}
            <path d="M-20 40 Q 150 70 420 20" stroke="#FFFFFF" strokeWidth="8" />
            <path d="M-20 120 Q 200 90 420 140" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M100 -20 Q 140 80 180 180" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M260 -20 Q 280 90 320 180" stroke="#FFE28C" strokeWidth="5" />
            <path d="M20 160 L 380 -20" stroke="#FFE28C" strokeWidth="6" />
            <text
              x="80"
              y="45"
              fill="#7E8B9B"
              fontSize="12"
              fontWeight="bold"
              letterSpacing="1"
            >
              AGEGE
            </text>
          </svg>

          {/* Pin & Label */}
          <div className="relative z-10 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-600 fill-red-600 drop-shadow-md" />
            <span className="text-xl font-bold text-[#101828] drop-shadow-xs">
              Ikeja
            </span>
          </div>
        </div>

        {/* Map Card Footer */}
        <div className="p-3 px-4 flex items-center justify-between bg-white text-xs border-t border-[#EAECF0]">
          <span className="text-[#344054] font-medium">Ikeja, Lagos</span>
          <button
            type="button"
            className="text-[#BB1A8C] font-semibold hover:underline cursor-pointer"
          >
            View on Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserQuickStatsMap;
