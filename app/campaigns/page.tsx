"use client";

import React, { useState } from "react";
import CampaignsMetricsCard from "@/components/campaigns/campaigns-metrics-card";
import CampaignsTable, {
  CampaignListRow,
  initialMockCampaignsList,
} from "@/components/campaigns/campaigns-table";
import CreateCampaignModal from "@/components/campaigns/create-campaign-modal";

export default function CampaignsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("modal") === "create" || params.get("modal") === "success";
    }
    return false;
  });
  const [initialModalStep] = useState<"form" | "success">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("modal") === "success" ? "success" : "form";
    }
    return "form";
  });
  const [campaignsList, setCampaignsList] = useState<CampaignListRow[]>(
    initialMockCampaignsList
  );

  const handleCreateSuccess = (newCamp: {
    name: string;
    type: "Physical" | "Digital";
    startDate: string;
    endDate: string;
  }) => {
    const created: CampaignListRow = {
      id: String(Date.now()),
      name: newCamp.name,
      type: newCamp.type,
      duration: `${newCamp.startDate} - ${newCamp.endDate}`,
      totalReferrals: 0,
      status: "Active",
    };
    setCampaignsList((prev) => [created, ...prev]);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
            Campaigns
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] sm:text-[14px] font-medium shadow-xs transition-colors cursor-pointer"
          >
            Create new campaign
          </button>
        </div>
      </div>

      {/* 6 Key Metrics Grid */}
      <CampaignsMetricsCard />

      {/* Campaigns Table */}
      <CampaignsTable campaigns={campaignsList} />

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        initialStep={initialModalStep}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
