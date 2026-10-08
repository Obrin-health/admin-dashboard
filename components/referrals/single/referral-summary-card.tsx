"use client";

import React, { useState } from "react";
import { Copy, Check, CheckCircle2 } from "lucide-react";

interface ReferralSummaryCardProps {
  code?: string;
  generatedDate?: string;
  status?: string;
}

export const ReferralSummaryCard: React.FC<ReferralSummaryCardProps> = ({
  code = "OB-2012",
  generatedDate = "Sept, 10, 2026",
  status = "Redeemed",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAECF0]">
        {/* 1. Referral Code */}
        <div className="sm:pr-8 pb-4 sm:pb-0 flex flex-col justify-center">
          <span className="text-[13px] md:text-[14px] text-[#475467] font-normal leading-tight">
            Referral Code
          </span>
          <div className="flex items-center gap-2.5 mt-2.5">
            <span className="font-general-sans text-[#101828] text-[28px] md:text-[34px] font-bold tracking-tight leading-none">
              {code}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-gray-100 text-[#C11574] hover:text-[#9B1373] transition-colors cursor-pointer"
              title="Copy Referral Code"
            >
              {copied ? (
                <Check className="size-4 text-emerald-600" />
              ) : (
                <Copy className="size-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* 2. Generated Date */}
        <div className="sm:px-8 py-4 sm:py-0 flex flex-col justify-center">
          <span className="text-[13px] md:text-[14px] text-[#475467] font-normal leading-tight">
            Generated
          </span>
          <p className="font-general-sans text-[#101828] text-[28px] md:text-[34px] font-bold tracking-tight mt-2.5 leading-none">
            {generatedDate}
          </p>
        </div>

        {/* 3. Status Badge */}
        <div className="sm:pl-8 pt-4 sm:pt-0 flex flex-col justify-center items-start">
          <span className="text-[13px] md:text-[14px] text-[#475467] font-normal leading-tight mb-3">
            Status
          </span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#A6F4C5] bg-[#ECFDF3] text-[#027A48] text-[13px] font-medium shadow-2xs">
            <CheckCircle2 className="size-4 text-[#027A48]" />
            <span>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSummaryCard;
