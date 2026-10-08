"use client";

import React from "react";
import QuickActionsCard from "@/components/overview/quick-actions-card";
import MetricsCard from "@/components/overview/metrics-card";
import TopAmbassadorsCard from "@/components/overview/top-ambassadors-card";
import CampaignsCard from "@/components/overview/campaigns-card";
import UsersAcquisitionCard from "@/components/overview/users-acquisition-card";
import ActiveUsersMapCard from "@/components/overview/active-users-map-card";
import AgeDistributionCard from "@/components/overview/age-distribution-card";

export default function OverviewPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
          Overview
        </h1>
      </div>

      {/* Welcome & Quick Action Shortcuts */}
      <QuickActionsCard />

      {/* 9 Core Performance Metrics Grid */}
      <MetricsCard />

      {/* Middle Row: Top Ambassadors (Left) & Campaigns Donut Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <TopAmbassadorsCard />
        </div>
        <div className="lg:col-span-5 flex">
          <CampaignsCard />
        </div>
      </div>

      {/* Users Acquisition Monthly Bar Chart */}
      <UsersAcquisitionCard />

      {/* Active Users Dot Matrix World Map & Regional Breakdown */}
      <ActiveUsersMapCard />

      {/* Demographic Age Distribution Breakdown */}
      <AgeDistributionCard />
    </div>
  );
}
