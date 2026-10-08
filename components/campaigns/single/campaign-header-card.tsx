"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  User,
  Megaphone,
  ChevronDown,
  X,
  Edit,
  PauseCircle,
  Trash2,
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

interface CampaignHeaderCardProps {
  activeTab: "Overview" | "Ambassadors" | "Acquired Users";
  onTabChange: (tab: "Overview" | "Ambassadors" | "Acquired Users") => void;
  onEditClick?: () => void;
  onPauseClick?: () => void;
  onEndClick?: () => void;
}

interface AmbassadorTag {
  id: string;
  name: string;
  initial: string;
  colorBg: string;
}

const initialAmbassadorTags: AmbassadorTag[] = [
  { id: "1", name: "Boluwatife Olusola", initial: "B", colorBg: "bg-emerald-600 text-white" },
  { id: "2", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "3", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "4", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "5", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "6", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "7", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "8", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "9", name: "Peter Adegbenga", initial: "P", colorBg: "bg-blue-600 text-white" },
  { id: "10", name: "Kanyisola Adepeju", initial: "K", colorBg: "bg-red-600 text-white" },
  { id: "11", name: "Kanyisola Adepeju", initial: "K", colorBg: "bg-red-600 text-white" },
];

export const CampaignHeaderCard: React.FC<CampaignHeaderCardProps> = ({
  activeTab,
  onTabChange,
  onEditClick,
  onPauseClick,
}) => {
  const [ambassadorTags, setAmbassadorTags] = useState<AmbassadorTag[]>(
    initialAmbassadorTags
  );
  const [selectedAmbassadorToRemove, setSelectedAmbassadorToRemove] =
    useState<AmbassadorTag | null>(() => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("modal") === "remove") {
          return { id: "0", name: "James Werinipre", initial: "J", colorBg: "bg-blue-600 text-white" };
        }
      }
      return null;
    });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("modal") === "delete";
    }
    return false;
  });

  const handleConfirmRemove = () => {
    if (selectedAmbassadorToRemove) {
      setAmbassadorTags((prev) =>
        prev.filter((t) => t.id !== selectedAmbassadorToRemove.id)
      );
      setSelectedAmbassadorToRemove(null);
    }
  };

  const miniStats = [
    { label: "Users Acquired", value: "500" },
    { label: "Converted Users", value: "4" },
    { label: "Conversion Rate", value: "40%" },
  ];

  const tabs: Array<"Overview" | "Ambassadors" | "Acquired Users"> = [
    "Overview",
    "Ambassadors",
    "Acquired Users",
  ];

  return (
    <>
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs">
        {/* 1. Header Profile & Actions Button */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="relative size-14 rounded-2xl overflow-hidden border border-pink-100 bg-pink-50 shadow-xs shrink-0 p-1">
              <Image
                src="/campaign-megaphone.jpg"
                alt="Unilag Outreach"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#101828]">
                  Unilag Outreach
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FDF2FA] text-[#C11574]">
                  Physical
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF3] text-[#027A48]">
                  Active
                </span>
              </div>
              <p className="text-[13px] text-[#667085] mt-0.5">
                Campaign ID: CMP10123
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
                <DropdownMenuItem
                  onClick={onEditClick}
                  className="text-[13px] font-medium text-[#101828] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <Edit className="size-4 text-[#667085]" />
                  <span>Edit Campaign</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onPauseClick}
                  className="text-[13px] font-medium text-[#101828] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <PauseCircle className="size-4 text-[#667085]" />
                  <span>Pause Campaign</span>
                </DropdownMenuItem>
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

        {/* 2. Meta Info Row (Duration, John Doe, Physical) */}
        <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#475467] mb-6">
          <div className="inline-flex items-center gap-2">
            <Calendar className="size-4 text-[#667085]" />
            <span>
              Duration:{" "}
              <strong className="text-[#101828] font-medium">
                Sept 10, 2026 - Sept 20,2026
              </strong>
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <User className="size-4 text-[#667085]" />
            <span>
              <strong className="text-[#101828] font-medium">John Doe</strong>
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Megaphone className="size-4 text-[#667085]" />
            <span>Physical</span>
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
              className="inline-flex items-center gap-1 text-[#BB1A8C] font-semibold hover:underline cursor-pointer"
            >
              <span>Add new</span>
              <span className="size-4 rounded-full bg-[#BB1A8C] text-white flex items-center justify-center text-[11px] font-bold">
                +
              </span>
            </button>
          </div>

          {/* Pill tags */}
          <div className="flex flex-wrap items-center gap-2">
            {ambassadorTags.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-[12px] text-[#344054] shadow-2xs group"
              >
                <span
                  className={`size-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${tag.colorBg}`}
                >
                  {tag.initial}
                </span>
                <span className="font-medium text-[#344054]">{tag.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedAmbassadorToRemove(tag)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer ml-0.5"
                  title="Remove"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <span className="text-[12px] font-medium text-[#BB1A8C] cursor-pointer hover:underline pl-1">
              +20 others
            </span>
          </div>
        </div>

        {/* 5. Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-[#EAECF0] -mb-6 md:-mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`pb-3 text-[14px] font-medium transition-colors relative cursor-pointer ${
                  isActive
                    ? "text-[#101828] font-semibold"
                    : "text-[#667085] hover:text-[#101828]"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BB1A8C] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Remove Ambassador Confirmation Modal */}
      <RemoveAmbassadorModal
        isOpen={!!selectedAmbassadorToRemove}
        onClose={() => setSelectedAmbassadorToRemove(null)}
        onConfirm={handleConfirmRemove}
        ambassadorName={selectedAmbassadorToRemove?.name || "James Werinipre"}
        avatarUrl="/james-werinipre.jpg"
      />

      {/* Delete Campaign Confirmation Modal */}
      <DeleteCampaignModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        campaignName="Unilag Outreach"
      />
    </>
  );
};

export default CampaignHeaderCard;
