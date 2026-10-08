"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AmbassadorsMetricsCard from "@/components/ambassadors/ambassadors-metrics-card";
import AmbassadorsTable, {
  AmbassadorRow,
  initialMockAmbassadors,
} from "@/components/ambassadors/ambassadors-table";
import AmbassadorsEmptyState from "@/components/ambassadors/ambassadors-empty-state";
import OnboardAmbassadorModal from "@/components/ambassadors/onboard-ambassador-modal";

function AmbassadorsPageContent() {
  const searchParams = useSearchParams();
  const emptyParam = searchParams.get("empty") === "true";

  const [viewState, setViewState] = useState<"data" | "empty">(
    emptyParam ? "empty" : "data"
  );
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [ambassadorsList, setAmbassadorsList] = useState<AmbassadorRow[]>(
    initialMockAmbassadors
  );

  const handleOnboardSuccess = (newAmb: {
    name: string;
    contactNumber: string;
    campaign: string;
    type: "Physical" | "Digital";
  }) => {
    const created: AmbassadorRow = {
      id: String(Date.now()),
      name: newAmb.name,
      avatarText:
        newAmb.name
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || "JD",
      contactNumber: newAmb.contactNumber,
      activeCampaign: newAmb.campaign,
      type: newAmb.type,
      totalUsersIntroduced: 0,
      status: "Active",
    };
    setAmbassadorsList((prev) => [created, ...prev]);
    setViewState("data");
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
            Ambassadors
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => setIsOnboardModalOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] sm:text-[14px] font-medium shadow-xs transition-colors cursor-pointer"
          >
            Onboard new Ambassador
          </button>
        </div>
      </div>

      {/* 6 Key Metrics Grid */}
      <AmbassadorsMetricsCard isEmpty={viewState === "empty"} />

      {/* Main Content: Table View vs Empty State */}
      {viewState === "data" ? (
        <AmbassadorsTable ambassadors={ambassadorsList} />
      ) : (
        <AmbassadorsEmptyState dashboardHref="/" />
      )}

      {/* Onboard Ambassador Modal */}
      <OnboardAmbassadorModal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        onSuccess={handleOnboardSuccess}
      />
    </div>
  );
}

export default function AmbassadorsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading ambassadors...</div>}>
      <AmbassadorsPageContent />
    </Suspense>
  );
}
