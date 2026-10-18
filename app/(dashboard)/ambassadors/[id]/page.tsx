"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AmbassadorHeaderCard from "@/components/ambassadors/single/ambassador-header-card";
import AmbassadorOverviewTab from "@/components/ambassadors/single/ambassador-overview-tab";
import AmbassadorUsersIntroducedTab from "@/components/ambassadors/single/ambassador-users-introduced-tab";
import AmbassadorCampaignsTab from "@/components/ambassadors/single/ambassador-campaigns-tab";
import EditAmbassadorModal from "@/components/ambassadors/single/edit-ambassador-modal";
import SuspendAmbassadorModal from "@/components/ambassadors/single/suspend-ambassador-modal";

function AmbassadorDetailContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "Overview" | "Users Introduced" | "Campaigns"
  >(() => {
    const tab = searchParams.get("tab");
    if (tab === "users" || tab === "users-introduced") return "Users Introduced";
    if (tab === "campaigns") return "Campaigns";
    return "Overview";
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* 1. Header Card (Avatar, Actions button, 4 mini-stat cards, Current campaign, Referral link, and Tabs) */}
      <AmbassadorHeaderCard
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEditClick={() => setIsEditModalOpen(true)}
        onSuspendClick={() => setIsSuspendModalOpen(true)}
      />

      {/* Tab 1: Overview */}
      {activeTab === "Overview" && <AmbassadorOverviewTab />}

      {/* Tab 2: Users Introduced */}
      {activeTab === "Users Introduced" && <AmbassadorUsersIntroducedTab />}

      {/* Tab 3: Campaigns */}
      {activeTab === "Campaigns" && <AmbassadorCampaignsTab />}

      {/* Edit Ambassador Modal Dialog */}
      <EditAmbassadorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Suspend Ambassador Confirmation Dialog */}
      <SuspendAmbassadorModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        ambassadorName="Emmanuel Adebayo"
      />
    </div>
  );
}

export default function AmbassadorDetailPage() {
  return (
    <Suspense fallback={null}>
      <AmbassadorDetailContent />
    </Suspense>
  );
}
