"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ProvidersMetricsCard } from "@/components/provider/providers-metrics-card";
import { ProvidersTable } from "@/components/provider/providers-table";

function ProviderPageContent() {
  return (
    <div className="w-full flex flex-col font-sans pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101828] tracking-tight">
            Providers
          </h1>
        </div>
        <Link
          href="/provider/new"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white text-[14px] font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          Onboard new provider
        </Link>
      </div>

      {/* Summary Metrics Cards */}
      <ProvidersMetricsCard />

      {/* Live Providers Table */}
      <ProvidersTable />
    </div>
  );
}

export default function ProviderPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex items-center justify-center py-20 text-[#667085] text-sm">
          Loading providers...
        </div>
      }
    >
      <ProviderPageContent />
    </Suspense>
  );
}
