import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AmbassadorDetailLoading() {
  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none space-y-6">
      {/* 1. Header Card Skeleton */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 shadow-xs">
        {/* Top Profile & Actions Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Skeleton className="size-14 rounded-full shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-44 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>
          {/* Actions Button */}
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        {/* 4 Mini Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-[#EAECF0] bg-white p-4.5 shadow-2xs space-y-2.5"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-14" />
            </div>
          ))}
        </div>

        {/* Current Campaign & Referral Link */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-8">
          {/* Left: Campaign card */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <div className="rounded-2xl border border-pink-100/70 bg-[#FDF2FA]/30 p-3">
              <div className="rounded-xl bg-white p-3.5 border border-[#F2F4F7] shadow-2xs flex items-center gap-3">
                <Skeleton className="size-11 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Referral Link */}
          <div className="lg:col-span-7 space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="rounded-2xl border border-[#EAECF0] bg-[#F9FAFB] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Tabs Bar Skeleton */}
        <div className="border-t border-[#EAECF0] pt-4 flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* 2. Overview Tab Skeleton Content */}
      <div className="space-y-6">
        {/* Row 1: Profile Info (Left) & Campaign Performance (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Info Rows */}
          <div className="lg:col-span-5 rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-7 shadow-xs">
            <div className="divide-y divide-[#F2F4F7]">
              {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                <div
                  key={row}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                >
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Campaign Performance */}
          <div className="lg:col-span-7 rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-52" />
              </div>
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>

            <div className="space-y-4 pt-2">
              {[78, 45, 90, 30, 15].map((pct, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: User Acquisition Chart */}
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-64" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>

          {/* Monthly bars */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4">
            {[65, 45, 20, 50, 85, 25, 15, 30, 40, 60, 20, 35].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <Skeleton
                  className="w-full max-w-[28px] rounded-t-md"
                  style={{ height: `${h}%` }}
                />
                <Skeleton className="h-3 w-6 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
