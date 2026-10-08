"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteCampaignModal } from "@/components/campaigns/delete-campaign-modal";

export interface CampaignListRow {
  id: string;
  name: string;
  type: "Physical" | "Digital";
  duration: string;
  totalReferrals: number;
  status: "Completed" | "Active" | "Paused";
}

export const initialMockCampaignsList: CampaignListRow[] = [
  {
    id: "1",
    name: "Lagos Women's Health Outreach",
    type: "Physical",
    duration: "Sept, 10, 2026 - Sept 20 2026",
    totalReferrals: 245,
    status: "Completed",
  },
  {
    id: "2",
    name: "Unilag outreach",
    type: "Digital",
    duration: "Sept, 10, 2026 - Sept 20 2026",
    totalReferrals: 120,
    status: "Active",
  },
  {
    id: "3",
    name: "Lasu Outreach",
    type: "Digital",
    duration: "Sept, 10, 2026 - Sept 20 2026",
    totalReferrals: 100,
    status: "Paused",
  },
  {
    id: "4",
    name: "Lagos Women's Health Outreach",
    type: "Physical",
    duration: "Sept, 10, 2026 - Sept 20 2026",
    totalReferrals: 120,
    status: "Completed",
  },
  {
    id: "5",
    name: "Lagos Women's Health Outreach",
    type: "Digital",
    duration: "Sept, 10, 2026 - Sept 20 2026",
    totalReferrals: 120,
    status: "Completed",
  },
  {
    id: "6",
    name: "Lagos Women's Health Outreach",
    type: "Physical",
    duration: "Sept, 10, 2026 - Sept 20 2026",
    totalReferrals: 120,
    status: "Completed",
  },
  {
    id: "7",
    name: "Lagos Women's Health Outreach",
    type: "Physical",
    duration: "Sept, 10, 2026 - Sept 20 2026",
    totalReferrals: 120,
    status: "Completed",
  },
];

export const CampaignsTable: React.FC<{
  campaigns?: CampaignListRow[];
}> = ({ campaigns: initialCampaigns = initialMockCampaignsList }) => {
  const [campaignsList, setCampaignsList] = useState<CampaignListRow[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedType, setSelectedType] = useState("All types");
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignToDelete, setCampaignToDelete] =
    useState<CampaignListRow | null>(null);

  React.useEffect(() => {
    setCampaignsList(initialCampaigns);
  }, [initialCampaigns]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedType]);

  const filteredCampaigns = campaignsList.filter((camp) => {
    const matchesSearch = camp.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All status" || camp.status === selectedStatus;
    const matchesType =
      selectedType === "All types" || camp.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / pageSize));
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar (matching Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] placeholder-[#667085] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] transition-all shadow-2xs"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5">
          {/* Show: All status */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedStatus}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All status", "Active", "Completed", "Paused"].map((st) => (
                <DropdownMenuItem
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className="text-[13px] cursor-pointer"
                >
                  {st}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show: All types */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedType}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All types", "Physical", "Digital"].map((tp) => (
                <DropdownMenuItem
                  key={tp}
                  onClick={() => setSelectedType(tp)}
                  className="text-[13px] cursor-pointer"
                >
                  {tp}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-[#FAFAFC]/60 text-[12px] font-normal text-[#667085]">
                <th className="py-3.5 px-6 font-normal">Campaigns</th>
                <th className="py-3.5 px-6 font-normal">Type</th>
                <th className="py-3.5 px-6 font-normal">Duration</th>
                <th className="py-3.5 px-6 font-normal">Total Referrals</th>
                <th className="py-3.5 px-6 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {paginatedCampaigns.map((camp) => (
                <tr
                  key={camp.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* Campaign Name with Megaphone Icon */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative size-8 rounded-lg overflow-hidden shrink-0 border border-pink-100 bg-pink-50">
                        <Image
                          src="/campaign-megaphone.jpg"
                          alt="Icon"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-[13px] font-medium text-[#101828]">
                        {camp.name}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {camp.type === "Physical" ? (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#E7F8F0] text-[#0D894F]">
                        Physical
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
                        Digital
                      </span>
                    )}
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[13px]">
                    {camp.duration}
                  </td>

                  {/* Total Referrals */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    {camp.totalReferrals}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {camp.status === "Completed" && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
                        Completed
                      </span>
                    )}
                    {camp.status === "Active" && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
                        Active
                      </span>
                    )}
                    {camp.status === "Paused" && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF6EE] text-[#F79009]">
                        Paused
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-3">
                      <Link
                        href={`/campaigns/${camp.id}`}
                        className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                      >
                        View
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-[#667085] transition-colors cursor-pointer outline-none">
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-[13px] cursor-pointer">
                            View Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px] cursor-pointer">
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setCampaignToDelete(camp)}
                            className="text-[13px] text-red-600 cursor-pointer"
                          >
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="py-3.5 px-6 border-t border-[#EAECF0] flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Campaign Modal */}
      <DeleteCampaignModal
        isOpen={!!campaignToDelete}
        onClose={() => setCampaignToDelete(null)}
        campaignName={campaignToDelete?.name}
        onConfirm={() => {
          if (campaignToDelete) {
            setCampaignsList((prev) =>
              prev.filter((c: CampaignListRow) => c.id !== campaignToDelete.id)
            );
            setCampaignToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default CampaignsTable;
