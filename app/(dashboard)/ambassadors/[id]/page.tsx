"use client";

import React, { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AmbassadorHeaderCard from "@/components/ambassadors/single/ambassador-header-card";
import AmbassadorOverviewTab from "@/components/ambassadors/single/ambassador-overview-tab";
import AmbassadorUsersIntroducedTab from "@/components/ambassadors/single/ambassador-users-introduced-tab";
import AmbassadorCampaignsTab from "@/components/ambassadors/single/ambassador-campaigns-tab";
import EditAmbassadorModal from "@/components/ambassadors/single/edit-ambassador-modal";
import SuspendAmbassadorModal from "@/components/ambassadors/single/suspend-ambassador-modal";
import AmbassadorDetailLoading from "./loading";
import {
  useAmbassadorDetail,
  useSuspendAmbassador,
  useActivateAmbassador,
} from "@/hooks/use-ambassadors";

function AmbassadorDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params.id === "string" ? params.id : "";

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

  // Load single ambassador detail from GET /v1/admin/ambassadors/{id}
  const { data: ambassador, isLoading } = useAmbassadorDetail(id);

  // Mutations
  const suspendMutation = useSuspendAmbassador();
  const activateMutation = useActivateAmbassador();

  let displayName = "Ambassador";
  if (typeof ambassador?.fullName === "string" && ambassador.fullName.trim()) {
    displayName = ambassador.fullName.trim();
  } else if (typeof ambassador?.name === "string" && ambassador.name.trim()) {
    displayName = ambassador.name.trim();
  }

  const handleSuspendConfirm = async () => {
    if (!id) return;
    try {
      await suspendMutation.mutateAsync(id);
    } catch {
      // handled
    } finally {
      setIsSuspendModalOpen(false);
    }
  };

  const handleActivateClick = async () => {
    if (!id) return;
    try {
      await activateMutation.mutateAsync(id);
    } catch {
      // handled
    }
  };

  if (isLoading && !ambassador) {
    return <AmbassadorDetailLoading />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* 1. Header Card (Avatar, Actions button, 4 mini-stat cards, Current campaign, Referral link, and Tabs) */}
      <AmbassadorHeaderCard
        ambassador={ambassador}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEditClick={() => setIsEditModalOpen(true)}
        onSuspendClick={() => setIsSuspendModalOpen(true)}
        onActivateClick={handleActivateClick}
      />

      {/* Tab 1: Overview */}
      {activeTab === "Overview" && (
        <AmbassadorOverviewTab id={id} ambassador={ambassador} />
      )}

      {/* Tab 2: Users Introduced */}
      {activeTab === "Users Introduced" && (
        <AmbassadorUsersIntroducedTab id={id} />
      )}

      {/* Tab 3: Campaigns */}
      {activeTab === "Campaigns" && (
        <AmbassadorCampaignsTab id={id} />
      )}

      {/* Edit Ambassador Modal Dialog */}
      <EditAmbassadorModal
        id={id}
        ambassador={ambassador}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Suspend Ambassador Confirmation Dialog */}
      <SuspendAmbassadorModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleSuspendConfirm}
        ambassadorName={displayName}
      />
    </div>
  );
}

export default function AmbassadorDetailPage() {
  return (
    <Suspense fallback={<AmbassadorDetailLoading />}>
      <AmbassadorDetailContent />
    </Suspense>
  );
}
