"use client";

import React, { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CampaignHeaderCard from "@/components/campaigns/single/campaign-header-card";
import CampaignOverviewTab from "@/components/campaigns/single/campaign-overview-tab";
import CampaignAmbassadorsTab from "@/components/campaigns/single/campaign-ambassadors-tab";
import CampaignAcquiredUsersTab from "@/components/campaigns/single/campaign-acquired-users-tab";
import { useCampaignDetail } from "@/hooks/use-campaigns";

function CampaignDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = typeof params?.id === "string" ? params.id : "";

  const [activeTab, setActiveTab] = useState<
    "Overview" | "Ambassadors" | "Acquired Users"
  >(() => {
    const tab = searchParams.get("tab");
    if (tab === "ambassadors") return "Ambassadors";
    if (tab === "acquired-users" || tab === "users") return "Acquired Users";
    return "Overview";
  });

  const { data: campaign, isLoading } = useCampaignDetail(id);

  return (
    <div className="w-full max-w-350 mx-auto pb-12 font-sans select-none">
      {/* 1. Top Header Card */}
      <CampaignHeaderCard
        id={id}
        campaign={campaign}
        isLoading={isLoading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab 1: Overview */}
      {activeTab === "Overview" && <CampaignOverviewTab id={id} />}

      {/* Tab 2: Ambassadors */}
      {activeTab === "Ambassadors" && <CampaignAmbassadorsTab id={id} />}

      {/* Tab 3: Acquired Users */}
      {activeTab === "Acquired Users" && <CampaignAcquiredUsersTab id={id} />}
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
