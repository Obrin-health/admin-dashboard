"use client";

import React, { useState } from "react";
import { Copy, Check, CheckCircle2, XCircle, Clock } from "lucide-react";

interface ReferralSummaryCardProps {
  id?: string;
  code?: string;
  generatedDate?: string;
  status?: string;
  onRedeem?: () => void;
  onCancel?: () => void;
  isRedeeming?: boolean;
  isCancelling?: boolean;
}

export const ReferralSummaryCard: React.FC<ReferralSummaryCardProps> = ({
  code = "-",
  generatedDate = "-",
  status = "Active",
  onRedeem,
  onCancel,
  isRedeeming = false,
  isCancelling = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code || code === "-") return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Rejection handled
    }
  };

  const getStatusBadge = () => {
    const raw = (status || "").toUpperCase();
    if (raw === "REDEEMED") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-200 bg-[#FDF2FA] text-[#C11574] text-[13px] font-medium shadow-2xs">
          <CheckCircle2 className="size-4 text-[#C11574]" />
          <span>Redeemed</span>
        </div>
      );
    }
    if (raw === "ACTIVE") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#A6F4C5] bg-[#ECFDF3] text-[#027A48] text-[13px] font-medium shadow-2xs">
          <CheckCircle2 className="size-4 text-[#027A48]" />
          <span>Active</span>
        </div>
      );
    }
    if (raw === "CONVERTED") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-[#EFF8FF] text-[#175CD3] text-[13px] font-medium shadow-2xs">
          <CheckCircle2 className="size-4 text-[#175CD3]" />
          <span>Converted</span>
        </div>
      );
    }
    if (raw === "EXPIRED") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-200 bg-[#FEF6EE] text-[#B54708] text-[13px] font-medium shadow-2xs">
          <Clock className="size-4 text-[#B54708]" />
          <span>Expired</span>
        </div>
      );
    }
    if (raw === "CANCELLED" || raw === "REJECTED") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-[#FEF3F2] text-[#B42318] text-[13px] font-medium shadow-2xs">
          <XCircle className="size-4 text-[#B42318]" />
          <span>{status}</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-[#F2F4F7] text-[#344054] text-[13px] font-medium shadow-2xs">
        <span>{status}</span>
      </div>
    );
  };

  const isActive = (status || "").toUpperCase() === "ACTIVE";

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
            {code !== "-" && (
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
            )}
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

        {/* 3. Status Badge & Actions */}
        <div className="sm:pl-8 pt-4 sm:pt-0 flex flex-col justify-center items-start">
          <span className="text-[13px] md:text-[14px] text-[#475467] font-normal leading-tight mb-3">
            Status
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {getStatusBadge()}
            {isActive && onRedeem && (
              <button
                type="button"
                disabled={isRedeeming}
                onClick={onRedeem}
                className="px-3 py-1 rounded-full bg-[#027A48] hover:bg-[#026038] text-white text-[12px] font-medium transition-colors disabled:opacity-50"
              >
                {isRedeeming ? "Redeeming..." : "Redeem"}
              </button>
            )}
            {isActive && onCancel && (
              <button
                type="button"
                disabled={isCancelling}
                onClick={onCancel}
                className="px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-[12px] font-medium transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSummaryCard;
