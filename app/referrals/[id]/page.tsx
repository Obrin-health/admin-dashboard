"use client";

import React from "react";
import ReferralSummaryCard from "@/components/referrals/single/referral-summary-card";
import ReferralUserCard from "@/components/referrals/single/referral-user-card";
import ReferralProviderCard from "@/components/referrals/single/referral-provider-card";
import ReferralHistoryTimeline from "@/components/referrals/single/referral-history-timeline";

export default function SingleReferralPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto pb-16 font-sans select-none">
      {/* 1. Referral Top Summary Card */}
      <ReferralSummaryCard
        code="OB-2012"
        generatedDate="Sept, 10, 2026"
        status="Redeemed"
      />

      {/* 2. Side-by-Side User & Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ReferralUserCard
          userId="USR-1075"
          name="Jane Doe"
          location="Chelsea, London"
          rating="5.0"
          joinedDate="Oct 2, 2026"
          lastActiveDate="Oct 2, 2026, 10:00AM"
          avatarUrl="/jane-doe-avatar.jpg"
        />

        <ReferralProviderCard
          providerId="Ikeja, PRV-0091"
          name="XYZ Clinic"
          location="Ikeja, Lagos"
          initials="JD"
          onboardingDate="October 10, 2026"
        />
      </div>

      {/* 3. History Timeline */}
      <ReferralHistoryTimeline />
    </div>
  );
}
