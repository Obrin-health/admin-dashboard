"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CampaignHeaderCard from "@/components/campaigns/single/campaign-header-card";
import CampaignOverviewTab from "@/components/campaigns/single/campaign-overview-tab";
import CampaignAmbassadorsTab from "@/components/campaigns/single/campaign-ambassadors-tab";
import CampaignAcquiredUsersTab from "@/components/campaigns/single/campaign-acquired-users-tab";

function CampaignDetailContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Ambassadors" | "Acquired Users"
  >(() => {
    const tab = searchParams.get("tab");
    if (tab === "ambassadors") return "Ambassadors";
    if (tab === "acquired-users" || tab === "users") return "Acquired Users";
    return "Overview";
  });

  const handleEditClick = () => {
    // Navigate or trigger edit mode
    setActiveTab("Overview");
  };

  const handlePauseClick = () => {
    // Trigger pause campaign action
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* 1. Top Header Card (Megaphone icon, title, meta, 3 stat cards, Ambassadors tag cloud, tabs) */}
      <CampaignHeaderCard
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEditClick={handleEditClick}
        onPauseClick={handlePauseClick}
      />

      {/* Tab 1: Overview (Image 2) */}
      {activeTab === "Overview" && <CampaignOverviewTab />}

      {/* Tab 2: Ambassadors (Image 3) */}
      {activeTab === "Ambassadors" && <CampaignAmbassadorsTab />}

      {/* Tab 3: Acquired Users (Image 4) */}
      {activeTab === "Acquired Users" && <CampaignAcquiredUsersTab />}
    </div>
  );
}

export default function CampaignDetailPage() {
  return (
    <Suspense fallback={null}>
      <CampaignDetailContent />
    </Suspense>
  );
}
