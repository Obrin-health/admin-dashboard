"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import UsersMetricsCard from "@/components/users/users-metrics-card";
import UsersTable from "@/components/users/users-table";
import UsersEmptyState from "@/components/users/users-empty-state";

function UsersPageContent() {
  const [viewState, setViewState] = useState<"data" | "empty">("data");

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#101828] tracking-tight">
            Users
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary Action Button */}
          <Link
            href="/provider/new"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] sm:text-[14px] font-medium shadow-xs transition-colors cursor-pointer"
          >
            Onboard new provider
          </Link>
        </div>
      </div>

      {/* 6 Key Users Metrics Grid */}
      <UsersMetricsCard />

      {/* Main Content: Table View vs Empty State */}
      {viewState === "data" ? (
        <UsersTable />
      ) : (
        <UsersEmptyState dashboardHref="/" onActionClick={() => setViewState("data")} />
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#667085] text-sm">Loading users...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}
