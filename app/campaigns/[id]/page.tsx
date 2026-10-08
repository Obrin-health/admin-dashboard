"use client";

import React, { useState } from "react";
import CampaignHeaderCard from "@/components/campaigns/single/campaign-header-card";
import CampaignOverviewTab from "@/components/campaigns/single/campaign-overview-tab";
import CampaignAmbassadorsTab from "@/components/campaigns/single/campaign-ambassadors-tab";
import CampaignAcquiredUsersTab from "@/components/campaigns/single/campaign-acquired-users-tab";

export default function CampaignDetailPage() {
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Ambassadors" | "Acquired Users"
  >(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "ambassadors") return "Ambassadors";
      if (tab === "acquired-users" || tab === "users") return "Acquired Users";
    }
    return "Overview";
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* 1. Top Header Card (Megaphone icon, title, meta, 3 stat cards, Ambassadors tag cloud, tabs) */}
      <CampaignHeaderCard
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
