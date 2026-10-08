"use client";

import React from "react";
import Link from "next/link";
import ReferralsMetricsCard from "@/components/referrals/referrals-metrics-card";
import ReferralsTable from "@/components/referrals/referrals-table";

export default function ReferralsPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
            Referrals
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ambassadors"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] sm:text-[14px] font-medium shadow-xs transition-colors cursor-pointer"
          >
            Onboard new Ambassador
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Grid Card */}
      <ReferralsMetricsCard />

      {/* Referrals Table with Search, Filter & Pagination */}
      <ReferralsTable />
    </div>
  );
}
