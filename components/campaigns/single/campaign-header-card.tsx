"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Megaphone,
  ChevronDown,
  X,
  PlayCircle,
  PauseCircle,
  StopCircle,
  XCircle,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RemoveAmbassadorModal } from "@/components/campaigns/remove-ambassador-modal";
import { DeleteCampaignModal } from "@/components/campaigns/delete-campaign-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useActivateCampaign,
  usePauseCampaign,
  useEndCampaign,
  useCancelCampaign,
  useDeleteCampaign,
  useRemoveCampaignAmbassador,
  useAddCampaignAmbassadors,
} from "@/hooks/use-campaigns";
import { useAmbassadorsList } from "@/hooks/use-ambassadors";
import type { CampaignItem, CampaignAmbassadorSummary } from "@/types/campaigns";

interface CampaignHeaderCardProps {
  id: string;
  campaign?: CampaignItem;
  isLoading?: boolean;
  activeTab: "Overview" | "Ambassadors" | "Acquired Users";
  onTabChange: (tab: "Overview" | "Ambassadors" | "Acquired Users") => void;
}

const colorBgs = [
  "bg-emerald-600 text-white",
  "bg-blue-600 text-white",
  "bg-purple-600 text-white",
  "bg-rose-600 text-white",
  "bg-amber-600 text-white",
];

export const CampaignHeaderCard: React.FC<CampaignHeaderCardProps> = ({
  id,
  campaign,
  isLoading = false,
  activeTab,
  onTabChange,
}) => {
  const router = useRouter();

  const [selectedAmbassadorToRemove, setSelectedAmbassadorToRemove] =
    useState<CampaignAmbassadorSummary | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddAmbassadorOpen, setIsAddAmbassadorOpen] = useState(false);
  const [selectedAmbassadorIdToAdd, setSelectedAmbassadorIdToAdd] = useState("");

  // Mutations
  const activateMutation = useActivateCampaign();
  const pauseMutation = usePauseCampaign();
  const endMutation = useEndCampaign();
  const cancelMutation = useCancelCampaign();
  const deleteMutation = useDeleteCampaign();
  const removeAmbassadorMutation = useRemoveCampaignAmbassador();
  const addAmbassadorsMutation = useAddCampaignAmbassadors();

  // Load all ambassadors for the Add Ambassador picker
  const { data: allAmbassadorsData, isLoading: isAllAmbassadorsLoading } =
    useAmbassadorsList({ pageSize: 100 });
  const allAmbassadors =
    allAmbassadorsData?.items || allAmbassadorsData?.data || [];

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      setIsDeleteModalOpen(false);
      router.push("/campaigns");
    } catch {
      // Handled by react-query
    }
  };

  const handleRemoveConfirm = async () => {
    if (!selectedAmbassadorToRemove) return;
    try {
      await removeAmbassadorMutation.mutateAsync({
        id,
        ambassadorId: selectedAmbassadorToRemove.id,
      });
      setSelectedAmbassadorToRemove(null);
    } catch {
      // Handled by react-query
    }
  };

  const handleAddAmbassador = async () => {
    if (!selectedAmbassadorIdToAdd) return;
    try {
      await addAmbassadorsMutation.mutateAsync({
        id,
        payload: { ambassadorIds: [selectedAmbassadorIdToAdd] },
      });
      setSelectedAmbassadorIdToAdd("");
      setIsAddAmbassadorOpen(false);
    } catch {
      // Handled
    }
  };

  const formatPeriod = (start?: string, end?: string) => {
    if (!start && !end) return "-";
    const fmt = (d: string) => {
      try {
        const parsed = new Date(d);
        if (isNaN(parsed.getTime())) return d;
        return parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return d;
      }
    };
    if (start && end) return `${fmt(start)} - ${fmt(end)}`;
    if (start) return fmt(start);
    return fmt(end!);
  };

  const name = campaign?.name || "Campaign Details";
  const type =
    (campaign?.type || "PHYSICAL").toUpperCase() === "DIGITAL"
      ? "Digital"
      : "Physical";
  const rawStatus = (campaign?.status || "ACTIVE").toUpperCase();
  const status =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "COMPLETED"
        ? "Completed"
        : rawStatus === "PAUSED"
          ? "Paused"
          : rawStatus === "CANCELLED"
            ? "Cancelled"
            : rawStatus === "SCHEDULED"
              ? "Scheduled"
              : "Archived";

  const duration = formatPeriod(campaign?.startDate, campaign?.endDate);

  const usersAcquired =
    typeof campaign?.usersAcquired === "number"
      ? campaign.usersAcquired.toLocaleString()
      : typeof campaign?.totalReferrals === "number"
        ? campaign.totalReferrals.toLocaleString()
        : "0";

  const convertedUsers =
    typeof campaign?.convertedUsers === "number"
      ? campaign.convertedUsers.toLocaleString()
      : "0";

  const conversionRate =
    typeof campaign?.conversionRate === "number"
      ? `${Math.round(campaign.conversionRate)}%`
      : "0%";

  const miniStats = [
    { label: "Users Acquired", value: usersAcquired },
    { label: "Converted Users", value: convertedUsers },
    { label: "Conversion Rate", value: conversionRate },
  ];

  const ambassadorList = campaign?.ambassadors || [];

  const tabs: Array<"Overview" | "Ambassadors" | "Acquired Users"> = [
    "Overview",
    "Ambassadors",
    "Acquired Users",
  ];

  return (
    <>
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs relative">
        {isLoading && !campaign && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-20 rounded-2xl">
            <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
          </div>
        )}

        {/* 1. Header Profile & Actions Button */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="relative size-14 rounded-2xl overflow-hidden border border-pink-100 bg-pink-50 shadow-xs shrink-0 p-1 flex items-center justify-center">
              {campaign?.imageUrl ? (
                <Image
                  src={campaign.imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="size-full bg-linear-to-br from-[#BB1A8C] to-[#E5383B] rounded-xl flex items-center justify-center text-white">
                  <Megaphone className="size-6" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#101828]">
                  {name}
                </h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${type === "Digital"
                    ? "bg-[#FDF2FA] text-[#C11574]"
                    : "bg-[#E7F8F0] text-[#0D894F]"
                    }`}
                >
                  {type}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${status === "Active"
                    ? "bg-[#ECFDF3] text-[#027A48]"
                    : status === "Paused"
                      ? "bg-[#FEF6EE] text-[#B54708]"
                      : status === "Completed"
                        ? "bg-[#F2F4F7] text-[#344054]"
                        : "bg-[#FEF3F2] text-[#B42318]"
                    }`}
                >
                  {status}
                </span>
              </div>
              <p className="text-[13px] text-[#667085] mt-0.5">
                Campaign ID: {id || "-"}
              </p>
            </div>
          </div>

          {/* Actions Dropdown Button */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors cursor-pointer outline-none">
                <span>Actions</span>
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 p-1.5 shadow-lg rounded-xl border border-gray-100 bg-white"
              >
                {status !== "Active" && (
                  <DropdownMenuItem
                    onClick={() => activateMutation.mutate(id)}
                    className="text-[13px] font-medium text-[#027A48] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                    <PlayCircle className="size-4 text-[#027A48]" />
                    <span>Activate Campaign</span>
                  </DropdownMenuItem>
                )}

                {status === "Active" && (
                  <DropdownMenuItem
                    onClick={() => pauseMutation.mutate(id)}
                    className="text-[13px] font-medium text-[#B54708] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                    <PauseCircle className="size-4 text-[#B54708]" />
                    <span>Pause Campaign</span>
                  </DropdownMenuItem>
                )}

                {status !== "Completed" && (
                  <DropdownMenuItem
                    onClick={() => endMutation.mutate(id)}
                    className="text-[13px] font-medium text-[#344054] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                    <StopCircle className="size-4 text-[#344054]" />
                    <span>End Campaign</span>
                  </DropdownMenuItem>
                )}

                {status !== "Cancelled" && (
                  <DropdownMenuItem
                    onClick={() => cancelMutation.mutate(id)}
                    className="text-[13px] font-medium text-[#B42318] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  >
                    <XCircle className="size-4 text-[#B42318]" />
                    <span>Cancel Campaign</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-[13px] font-medium text-red-600 py-2 px-3 cursor-pointer hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <Trash2 className="size-4 text-red-600" />
                  <span>Delete Campaign</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 2. Meta Info Row (Duration, Type) */}
        <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#475467] mb-6">
          <div className="inline-flex items-center gap-2">
            <Calendar className="size-4 text-[#667085]" />
            <span>
              Duration:{" "}
              <strong className="text-[#101828] font-medium">{duration}</strong>
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Megaphone className="size-4 text-[#667085]" />
            <span>{type}</span>
          </div>
        </div>

        {/* 3. Three Mini Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {miniStats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-2xs"
            >
              <span className="text-[13px] text-[#667085] block truncate">
                {item.label}
              </span>
              <p className="font-general-sans text-[#101828] text-[24px] font-bold mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* 4. Ambassadors Tag Cloud */}
        <div className="space-y-2.5 mb-8">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-[#667085] font-normal">Ambassadors</span>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => setIsAddAmbassadorOpen(true)}
              className="inline-flex items-center gap-1 text-[#BB1A8C] font-semibold hover:underline cursor-pointer"
            >
              <span>Add new</span>
              <span className="size-4 rounded-full bg-[#BB1A8C] text-white flex items-center justify-center text-[11px] font-bold">
                +
              </span>
            </button>
          </div>

          {/* Pill tags */}
          {ambassadorList.length === 0 ? (
            <p className="text-xs text-[#667085]">
              No ambassadors assigned to this campaign yet.
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {ambassadorList.map((tag, idx) => {
                let ambName = "Ambassador";
                let ambId = String(idx + 1);
                if (typeof tag === "object" && tag !== null) {
                  const t = tag as Record<string, unknown>;
                  if (typeof t.fullName === "string" && t.fullName.trim()) {
                    ambName = t.fullName.trim();
                  } else if (typeof t.name === "string" && t.name.trim()) {
                    ambName = t.name.trim();
                  } else if (typeof t.ambassador === "object" && t.ambassador !== null) {
                    const amb = t.ambassador as Record<string, unknown>;
                    if (typeof amb.fullName === "string") ambName = amb.fullName;
                    else if (typeof amb.name === "string") ambName = amb.name;
                  }
                  if (typeof t.id === "string") ambId = t.id;
                  else if (typeof t.ambassadorId === "string") ambId = t.ambassadorId;
                }
                const initial = ambName.charAt(0).toUpperCase() || "A";
                const colorBg = colorBgs[idx % colorBgs.length];

                return (
                  <div
                    key={ambId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-[12px] text-[#344054] shadow-2xs group"
                  >
                    <span
                      className={`size-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colorBg}`}
                    >
                      {initial}
                    </span>
                    <span className="font-medium text-[#344054]">{ambName}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedAmbassadorToRemove(tag)}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-0.5"
                      title="Remove"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Tabs Navigation Bar */}
        <div className="flex items-center gap-8 border-b border-[#EAECF0] text-[14px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`pb-3 font-semibold transition-colors relative cursor-pointer outline-none ${isActive ? "text-[#BB1A8C]" : "text-[#667085] hover:text-[#101828]"
                  }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BB1A8C] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delete Campaign Modal */}
      <DeleteCampaignModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        campaignName={name}
        isLoading={deleteMutation.isPending}
      />

      {/* Remove Ambassador Modal */}
      <RemoveAmbassadorModal
        isOpen={Boolean(selectedAmbassadorToRemove)}
        onClose={() => setSelectedAmbassadorToRemove(null)}
        onConfirm={handleRemoveConfirm}
        ambassadorName={
          selectedAmbassadorToRemove?.fullName ||
          selectedAmbassadorToRemove?.name ||
          "Ambassador"
        }
        avatarUrl={
          selectedAmbassadorToRemove?.avatarUrl ||
          selectedAmbassadorToRemove?.photoUrl
        }
        isLoading={removeAmbassadorMutation.isPending}
      />

      {/* Add Ambassador Dialog */}
      <Dialog
        open={isAddAmbassadorOpen}
        onOpenChange={(open) => !open && setIsAddAmbassadorOpen(false)}
      >
        <DialogContent className="max-w-105 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <DialogTitle className="text-[17px] font-bold text-[#101828]">
              Add Ambassador to Campaign
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                Select Ambassador
              </label>
              <select
                value={selectedAmbassadorIdToAdd}
                onChange={(e) => setSelectedAmbassadorIdToAdd(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] focus:outline-none focus:border-[#BB1A8C]"
              >
                <option value="">Choose an ambassador...</option>
                {allAmbassadors
                  .filter(
                    (amb) => !ambassadorList.some((a) => a.id === amb.id)
                  )
                  .map((amb) => (
                    <option key={amb.id} value={amb.id}>
                      {amb.fullName || amb.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddAmbassadorOpen(false)}
                className="py-2 px-4 rounded-xl border border-[#D0D5DD] text-[13px] text-[#344054] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  !selectedAmbassadorIdToAdd ||
                  addAmbassadorsMutation.isPending
                }
                onClick={handleAddAmbassador}
                className="py-2 px-5 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {addAmbassadorsMutation.isPending && (
                  <Loader2 className="size-3.5 animate-spin" />
                )}
                <span>Add</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampaignHeaderCard;
