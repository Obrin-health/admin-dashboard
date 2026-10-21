"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  useProviderDetail,
  useSuspendProvider,
  useActivateProvider,
} from "@/hooks/use-providers";
import { SuspendProviderModal } from "@/components/provider/suspend-provider-modal";
import { ProviderQuickStatsMap } from "@/components/provider/provider-quick-stats-map";
import { ProviderReferralsTable } from "@/components/provider/provider-referrals-table";

function getInitials(name?: string): string {
  if (!name) return "PR";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatProviderType(type?: string): string {
  if (!type) return "Provider";
  switch (type.toUpperCase()) {
    case "CLINIC":
      return "Clinic";
    case "PHARMACY":
      return "Pharmacy";
    case "HOSPITAL":
      return "Hospital";
    case "LABORATORY":
      return "Laboratory";
    case "DELIVERY_PARTNER":
      return "Delivery Partner";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

function ProviderDetailPageContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"overview" | "referrals">(() => {
    const tabParam = searchParams.get("tab");
    return tabParam === "referrals" ? "referrals" : "overview";
  });

  const { data: provider, isLoading, error, refetch } = useProviderDetail(id);

  const suspendMutation = useSuspendProvider();
  const activateMutation = useActivateProvider();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuspendingAction, setIsSuspendingAction] = useState(true);

  const isActive = String(provider?.status).toUpperCase() === "ACTIVE";

  const handleOpenStatusModal = () => {
    setIsSuspendingAction(isActive);
    setIsModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!id) return;
    try {
      if (isSuspendingAction) {
        await suspendMutation.mutateAsync(id);
      } else {
        await activateMutation.mutateAsync(id);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const isActionLoading = suspendMutation.isPending || activateMutation.isPending;

  if (isLoading) {
    return (
      <div className="w-full flex flex-col font-sans space-y-6 pb-12 animate-pulse">
        {/* Top bar skeleton */}
        <div className="h-6 w-36 bg-gray-200 rounded" />

        {/* Profile Card Skeleton */}
        <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="h-12 w-3/4 bg-gray-100 rounded mt-4" />
        </div>

        {/* Middle Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 rounded-2xl border border-gray-100 bg-white p-6 h-80" />
          <div className="lg:col-span-5 rounded-2xl border border-gray-100 bg-white p-6 h-80" />
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center font-sans">
        <div className="p-3 bg-red-50 text-red-600 rounded-full mb-3">
          <AlertTriangle className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-[#101828]">
          Provider Not Found
        </h2>
        <p className="text-sm text-[#667085] mt-1 max-w-md">
          The requested provider does not exist or you may not have permission to view it.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Link
            href="/provider"
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#253B4B] hover:bg-gray-50 transition-colors"
          >
            Back to Providers
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const locationDisplay =
    provider.location ||
    [provider.addressLine, provider.area || provider.city, provider.state]
      .filter(Boolean)
      .join(", ") ||
    "Not specified";

  return (
    <div className="w-full flex flex-col font-sans space-y-6 pb-12">

      {/* 1. Top Provider Profile Card */}
      <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar / Logo */}
            {provider.logoUrl ? (
              <div className="relative size-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs">
                <Image
                  src={provider.logoUrl}
                  alt={provider.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-14 rounded-full bg-primary/10 text-primary border-2 border-white shadow-xs overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg">
                {getInitials(provider.name)}
              </div>
            )}

            {/* Provider Header Details */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-[#101828]">
                  {provider.name}
                </h2>
                {isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#027A48] text-white">
                    Active
                    <Image src="/check.png" alt="Check" width={12} height={12} />
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D92D20] text-white">
                    Suspended
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5D6B90] font-medium mt-1">
                Provider ID: {provider.reference || provider.id}
              </p>
            </div>
          </div>

          {/* Action Button: Suspend / Activate */}
          <div className="flex items-center gap-2.5 self-end sm:self-start">
            <button
              type="button"
              disabled={isActionLoading}
              onClick={handleOpenStatusModal}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 ${isActive
                  ? "border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300"
                  : "border border-green-200 text-green-700 bg-white hover:bg-green-50 hover:border-green-300"
                }`}
            >
              {isActionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isActive ? "Suspend provider" : "Activate provider"}</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] text-[#5D6B90] mt-4 leading-relaxed max-w-4xl">
          {provider.description || "No description provided for this healthcare provider."}
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-gray-200 mt-6 -mb-6 px-1">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-medium w-32.5 transition-all relative cursor-pointer ${activeTab === "overview"
                ? "text-primary border-b-2 border-primary"
                : "text-[#5D6B90] hover:text-[#253B4B]"
              }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("referrals")}
            className={`pb-3 text-sm font-medium w-32.5 transition-all relative cursor-pointer ${activeTab === "referrals"
                ? "text-primary border-b-2 border-primary"
                : "text-[#5D6B90] hover:text-[#253B4B]"
              }`}
          >
            Referrals
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <>
          {/* Middle Section: Provider Details (Left) + Quick Stat & Map (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Details */}
            <div className="lg:col-span-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#101828] mb-5">
                Provider Information
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-12 items-center">
                  <span className="col-span-5 text-[#667085] font-normal">
                    Reference ID:
                  </span>
                  <span className="col-span-7 text-[#101828] font-semibold font-mono text-xs sm:text-sm">
                    {provider.reference || provider.id}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center">
                  <span className="col-span-5 text-[#667085] font-normal">
                    Email Address:
                  </span>
                  <span className="col-span-7 text-[#101828] font-semibold break-all">
                    {provider.email || "Not specified"}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center">
                  <span className="col-span-5 text-[#667085] font-normal">
                    Phone / WhatsApp:
                  </span>
                  <span className="col-span-7 text-[#101828] font-semibold">
                    {provider.phone || provider.whatsappNumber || "Not specified"}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center">
                  <span className="col-span-5 text-[#667085] font-normal">
                    Provider Type:
                  </span>
                  <span className="col-span-7 text-[#101828] font-semibold">
                    {formatProviderType(provider.type)}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center">
                  <span className="col-span-5 text-[#667085] font-normal">
                    Address:
                  </span>
                  <span className="col-span-7 text-[#101828] font-semibold">
                    {provider.addressLine || "Not specified"}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center">
                  <span className="col-span-5 text-[#667085] font-normal">
                    Location:
                  </span>
                  <span className="col-span-7 text-[#101828] font-semibold">
                    {locationDisplay}
                  </span>
                </div>

                <div className="grid grid-cols-12 items-center">
                  <span className="col-span-5 text-[#667085] font-normal">
                    Date Onboarded:
                  </span>
                  <span className="col-span-7 text-[#101828] font-semibold">
                    {formatDate(provider.onboardedAt || provider.createdAt)}
                  </span>
                </div>

                {provider.website && (
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-5 text-[#667085] font-normal">
                      Website:
                    </span>
                    <a
                      href={
                        provider.website.startsWith("http")
                          ? provider.website
                          : `https://${provider.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-7 text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>{provider.website}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Services Badges */}
              <div className="mt-8 pt-5 border-t border-gray-100">
                <h4 className="text-sm font-bold text-[#101828] mb-3">
                  Services Offered
                </h4>
                {provider.services && provider.services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service) => (
                      <span
                        key={service.id || service.slug}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FDF2F8] text-primary border border-pink-100"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8A9BA8]">
                    No specific services listed for this provider.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Quick Stat & Map */}
            <div className="lg:col-span-5">
              <ProviderQuickStatsMap provider={provider} isLoading={isLoading} />
            </div>
          </div>

          {/* Bottom Section: Recent Referrals Table */}
          <ProviderReferralsTable providerId={provider.id} />
        </>
      ) : (
        /* Referrals Tab: Full Width Referrals Table */
        <div className="w-full">
          <ProviderReferralsTable providerId={provider.id} />
        </div>
      )}

      {/* Suspend / Activate Provider Modal */}
      <SuspendProviderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        providerName={provider.name}
        isSuspending={isSuspendingAction}
        isLoading={isActionLoading}
      />
    </div>
  );
}

export default function ProviderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex items-center justify-center py-20 text-[#667085] text-sm">
          Loading provider details...
        </div>
      }
    >
      <ProviderDetailPageContent />
    </Suspense>
  );
}
