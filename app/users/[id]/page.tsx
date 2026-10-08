"use client";

import React, { useState } from "react";
import UserHeaderCard from "@/components/users/user-header-card";
import UserOverviewInfo from "@/components/users/user-overview-info";
import UserQuickStatsMap from "@/components/users/user-quick-stats-map";
import UserRecentReferrals from "@/components/users/user-recent-referrals";

export default function UserDetailPage() {
  const [activeTab, setActiveTab] = useState<"Overview" | "Referrals" | "Services">(
    "Overview"
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* 1. Top Section: User Identity, Mini Stats, and Tabs */}
      <UserHeaderCard activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* 2. Middle Section: User Information (Left) + Quick Statistics & Map (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <UserOverviewInfo />
            </div>
            <div className="lg:col-span-6">
              <UserQuickStatsMap />
            </div>
          </div>

          {/* 3. Bottom Section: Recent Referrals Table */}
          <UserRecentReferrals />
        </div>
      )}

      {/* Tab 2: Referrals */}
      {activeTab === "Referrals" && (
        <div className="space-y-6">
          <UserRecentReferrals />
        </div>
      )}

      {/* Tab 3: Services */}
      {activeTab === "Services" && (
        <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] min-h-[300px] flex flex-col items-center justify-center text-center p-8">
          <p className="text-[14px] text-[#667085]">
            No specific services registered for this user yet.
          </p>
        </div>
      )}
    </div>
  );
}
