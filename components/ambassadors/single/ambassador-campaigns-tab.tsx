"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CampaignRow {
  id: string;
  campaign: string;
  type: "Physical" | "Digital";
  period: string;
  status: "Active" | "Inactive" | "Suspended";
}

const mockCampaignRows: CampaignRow[] = [
  {
    id: "1",
    campaign: "Unilag Outreach",
    type: "Physical",
    period: "Sept, 10, 2026 - Sept 20, 2026",
    status: "Inactive",
  },
  {
    id: "2",
    campaign: "Unilag Outreach",
    type: "Digital",
    period: "Sept, 10, 2026 - Sept 20, 2026",
    status: "Active",
  },
  {
    id: "3",
    campaign: "Unilag Outreach",
    type: "Digital",
    period: "Sept, 10, 2026 - Sept 20, 2026",
    status: "Inactive",
  },
  {
    id: "4",
    campaign: "Ambassador",
    type: "Physical",
    period: "Sept, 10, 2026 - Sept 20, 2026",
    status: "Suspended",
  },
  {
    id: "5",
    campaign: "Unilag Outreach",
    type: "Digital",
    period: "Sept, 10, 2026 - Sept 20, 2026",
    status: "Active",
  },
  {
    id: "6",
    campaign: "Ambassador",
    type: "Physical",
    period: "Sept, 10, 2026 - Sept 20, 2026",
    status: "Active",
  },
  {
    id: "7",
    campaign: "WhatsApp",
    type: "Physical",
    period: "Sept, 10, 2026 - Sept 20, 2026",
    status: "Active",
  },
];

export const AmbassadorCampaignsTab: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedType, setSelectedType] = useState("All types");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCampaigns = mockCampaignRows.filter((camp) => {
    const matchesStatus =
      selectedStatus === "All status" || camp.status === selectedStatus;
    const matchesType =
      selectedType === "All types" || camp.type === selectedType;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Header with Title and 2 Dropdowns (matching Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <h3 className="text-[18px] font-bold text-[#101828]">
          Campaigns
        </h3>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Show: All status */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedStatus}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All status", "Active", "Inactive", "Suspended"].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className="text-[13px] cursor-pointer"
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show: All types */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedType}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All types", "Physical", "Digital"].map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className="text-[13px] cursor-pointer"
                >
                  {t}
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
                <th className="py-3.5 px-6 font-normal">Campaign</th>
                <th className="py-3.5 px-6 font-normal">Type</th>
                <th className="py-3.5 px-6 font-normal">Period</th>
                <th className="py-3.5 px-6 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {filteredCampaigns.map((camp) => (
                <tr
                  key={camp.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* Campaign */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    {camp.campaign}
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

                  {/* Period */}
                  <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[13px]">
                    {camp.period}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {camp.status === "Active" && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
                        Active
                      </span>
                    )}
                    {camp.status === "Inactive" && (
                      <span className="inline-flex items-center px-1 text-[12px] font-medium text-[#F79009]">
                        Inactive
                      </span>
                    )}
                    {camp.status === "Suspended" && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF3F2] text-[#B42318]">
                        Suspended
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
                            Edit Period
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-[13px] text-red-600 cursor-pointer">
                            Deactivate
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

        {/* Footer with Pagination (Page 1 of 10) */}
        <div className="py-3.5 px-6 border-t border-[#EAECF0] flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">
            Page {currentPage} of 10
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
              disabled={currentPage >= 10}
              onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorCampaignsTab;
