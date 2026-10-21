"use client";

import React, { useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import UserHeaderCard from "@/components/users/user-header-card";
import UserOverviewInfo from "@/components/users/user-overview-info";
import UserQuickStatsMap from "@/components/users/user-quick-stats-map";
import UserRecentReferrals from "@/components/users/user-recent-referrals";
import SuspendUserModal from "@/components/users/suspend-user-modal";
import {
  useUserDetail,
  useSuspendUser,
  useActivateUser,
} from "@/hooks/use-users";

function UserDetailContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"Overview" | "Referrals" | "Services">(() => {
    const tab = searchParams.get("tab");
    if (tab === "referrals") return "Referrals";
    if (tab === "services") return "Services";
    return "Overview";
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"suspend" | "activate">("suspend");

  const { data: user, isLoading, error, refetch } = useUserDetail(id);
  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();

  const handleOpenSuspend = () => {
    setModalAction("suspend");
    setIsModalOpen(true);
  };

  const handleOpenActivate = () => {
    setModalAction("activate");
    setIsModalOpen(true);
  };

  const handleConfirmModal = async () => {
    if (!id) return;
    try {
      if (modalAction === "suspend") {
        await suspendMutation.mutateAsync(id);
      } else {
        await activateMutation.mutateAsync(id);
      }
      setIsModalOpen(false);
    } catch {
      // Error handled by mutation
    }
  };

  const isActionLoading =
    suspendMutation.isPending || activateMutation.isPending;

  if (error) {
    return (
      <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans">
        <div className="mb-4">
          <Link
            href="/users"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#667085] hover:text-[#101828] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Users</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle className="size-8 text-red-600" />
          <h2 className="text-[17px] font-bold text-red-900">
            Failed to Load User Details
          </h2>
          <p className="text-[13px] text-red-700 max-w-md">
            We couldn't retrieve the user information. The user may not exist or
            the server encountered an error.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="size-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12 font-sans select-none">
      {/* 1. Top Section: User Identity, Mini Stats, and Tabs */}
      <UserHeaderCard
        user={user}
        isLoading={isLoading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSuspendClick={handleOpenSuspend}
        onActivateClick={handleOpenActivate}
        isActionLoading={isActionLoading}
      />

      {/* Tab 1: Overview */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* 2. Middle Section: User Information (Left) + Quick Statistics & Map (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <UserOverviewInfo user={user} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-6">
              <UserQuickStatsMap user={user} isLoading={isLoading} />
            </div>
          </div>

          {/* 3. Bottom Section: Recent Referrals Table */}
          {id && <UserRecentReferrals userId={id} />}
        </div>
      )}

      {/* Tab 2: Referrals */}
      {activeTab === "Referrals" && (
        <div className="space-y-6">
          {id && <UserRecentReferrals userId={id} />}
        </div>
      )}

      {/* Tab 3: Services */}
      {activeTab === "Services" && (
        <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] min-h-[300px] flex flex-col items-center justify-center text-center p-8">
          <p className="text-[14px] text-[#667085]">
            No specific services registered for this user yet.
          </p>
        </div>
      )}

      {/* Suspend / Activate Confirmation Dialog */}
      <SuspendUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmModal}
        userName={user?.name || user?.reference || "this user"}
        isSuspending={modalAction === "suspend"}
        isLoading={isActionLoading}
      />
    </div>
  );
}

export default function UserDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[1400px] mx-auto py-12 flex justify-center items-center text-[#667085] text-sm">
          Loading user details...
        </div>
      }
    >
      <UserDetailContent />
    </Suspense>
  );
}
