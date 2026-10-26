"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ReferralSummaryCard from "@/components/referrals/single/referral-summary-card";
import ReferralUserCard from "@/components/referrals/single/referral-user-card";
import ReferralProviderCard from "@/components/referrals/single/referral-provider-card";
import ReferralHistoryTimeline from "@/components/referrals/single/referral-history-timeline";
import {
  useReferralDetail,
  useRedeemReferral,
  useCancelReferral,
} from "@/hooks/use-referrals";
import type { ReferralTimelineEvent } from "@/types/referrals";

export default function SingleReferralPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "";

  const { data: referral, isLoading, isError } = useReferralDetail(id);
  const redeemMutation = useRedeemReferral();
  const cancelMutation = useCancelReferral();

  const formatDate = (dateStr?: unknown): string => {
    if (!dateStr || typeof dateStr !== "string") return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const code = referral?.code || "-";
  const status = referral?.status || "Active";
  const generatedDate = formatDate(
    referral?.generationDate || referral?.dateGenerated || referral?.createdAt
  );

  // User details
  const userName =
    (typeof referral?.user === "object" &&
      (referral?.user?.fullName || referral?.user?.name)) ||
    (typeof referral?.user === "string" && referral.user) ||
    "User";

  const userId =
    (typeof referral?.user === "object" && referral?.user?.id) ||
    referral?.id ||
    "-";

  const userLocation =
    (typeof referral?.user === "object" && referral?.user?.location) ||
    "-";

  const userRating =
    (typeof referral?.user === "object" && referral?.user?.rating) ||
    undefined;

  const userJoinedDate = formatDate(
    typeof referral?.user === "object"
      ? referral?.user?.joinedDate || referral?.user?.createdAt
      : undefined
  );

  const userLastActiveDate = formatDate(
    typeof referral?.user === "object"
      ? referral?.user?.lastActiveDate
      : undefined
  );

  const userAvatarUrl =
    typeof referral?.user === "object"
      ? referral?.user?.avatarUrl || referral?.user?.photoUrl
      : null;

  // Provider details
  const providerName =
    (typeof referral?.provider === "object" && referral?.provider?.name) ||
    (typeof referral?.provider === "string" && referral.provider) ||
    "Provider";

  const providerId =
    (typeof referral?.provider === "object" && referral?.provider?.id) ||
    "-";

  const providerLocation =
    (typeof referral?.provider === "object" &&
      (referral?.provider?.location ||
        referral?.provider?.address ||
        referral?.provider?.city)) ||
    "-";

  const providerInitials =
    (typeof referral?.provider === "object" && referral?.provider?.initials) ||
    providerName.slice(0, 2).toUpperCase();

  const providerOnboardingDate = formatDate(
    typeof referral?.provider === "object"
      ? referral?.provider?.onboardingDate || referral?.provider?.createdAt
      : undefined
  );

  // Timeline events
  const timelineEvents: ReferralTimelineEvent[] = useMemo(() => {
    if (referral?.history && Array.isArray(referral.history) && referral.history.length > 0) {
      return referral.history;
    }

    const events: ReferralTimelineEvent[] = [];

    if (referral?.createdAt || referral?.generationDate) {
      events.push({
        id: "1",
        title: `Referral code generated for ${userName}`,
        timestamp: formatDate(referral.createdAt || referral.generationDate),
      });
    }

    if (referral?.redeemedAt || referral?.redemptionDate) {
      events.push({
        id: "2",
        title: `Referral code redeemed by ${providerName}`,
        timestamp: formatDate(referral.redeemedAt || referral.redemptionDate),
      });
    }

    if (referral?.convertedAt) {
      events.push({
        id: "3",
        title: `Referral converted successfully`,
        timestamp: formatDate(referral.convertedAt),
      });
    }

    if (referral?.cancelledAt) {
      events.push({
        id: "4",
        title: `Referral cancelled${
          referral.cancelReason ? `: ${referral.cancelReason}` : ""
        }`,
        timestamp: formatDate(referral.cancelledAt),
      });
    }

    return events;
  }, [referral, userName, providerName]);

  const handleRedeem = () => {
    if (code && code !== "-") {
      redeemMutation.mutate({ code });
    }
  };

  const handleCancel = () => {
    if (id) {
      cancelMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto py-24 flex flex-col items-center justify-center gap-3 text-[#667085]">
        <Loader2 className="size-8 animate-spin text-[#BB1A8C]" />
        <span className="text-sm">Loading referral details...</span>
      </div>
    );
  }

  if (isError || !referral) {
    return (
      <div className="w-full max-w-[1400px] mx-auto py-24 text-center space-y-4">
        <h3 className="text-lg font-bold text-[#101828]">Referral Not Found</h3>
        <p className="text-sm text-[#667085]">
          Could not find referral details for ID &quot;{id}&quot;.
        </p>
        <Link
          href="/referrals"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#BB1A8C] hover:underline"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Referrals</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-16 font-sans select-none">
      {/* Back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#667085] hover:text-[#101828] transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>
      </div>

      {/* 1. Referral Top Summary Card */}
      <ReferralSummaryCard
        id={referral.id}
        code={code}
        generatedDate={generatedDate}
        status={status}
        onRedeem={handleRedeem}
        onCancel={handleCancel}
        isRedeeming={redeemMutation.isPending}
        isCancelling={cancelMutation.isPending}
      />

      {/* 2. Side-by-Side User & Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ReferralUserCard
          userId={userId}
          name={userName}
          location={userLocation}
          rating={userRating}
          joinedDate={userJoinedDate}
          lastActiveDate={userLastActiveDate}
          avatarUrl={userAvatarUrl}
        />

        <ReferralProviderCard
          providerId={providerId}
          name={providerName}
          location={providerLocation}
          initials={providerInitials}
          onboardingDate={providerOnboardingDate}
        />
      </div>

      {/* 3. History Timeline */}
      <ReferralHistoryTimeline events={timelineEvents} />
    </div>
  );
}
