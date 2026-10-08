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
import { RemoveAmbassadorModal } from "@/components/campaigns/remove-ambassador-modal";

interface CampaignAmbassadorRow {
  id: string;
  ambassadorName: string;
  totalUsersIntroduced: number;
  referralLink: string;
  dateAdded: string;
  addedBy: string;
}

const mockCampaignAmbassadors: CampaignAmbassadorRow[] = [
  {
    id: "1",
    ambassadorName: "Emmanuel Adebayo",
    totalUsersIntroduced: 245,
    referralLink: "obrin.health/join/AMB00156",
    dateAdded: "Sept, 10, 2023",
    addedBy: "John Doe",
  },
  {
    id: "2",
    ambassadorName: "Emmanuel Adebayo",
    totalUsersIntroduced: 120,
    referralLink: "obrin.health/join/AMB00156",
    dateAdded: "Sept, 10, 2023",
    addedBy: "John Doe",
  },
  {
    id: "3",
    ambassadorName: "Emmanuel Adebayo",
    totalUsersIntroduced: 100,
    referralLink: "obrin.health/join/AMB00156",
    dateAdded: "Sept, 10, 2023",
    addedBy: "John Doe",
  },
  {
    id: "4",
    ambassadorName: "Emmanuel Adebayo",
    totalUsersIntroduced: 120,
    referralLink: "obrin.health/join/AMB00156",
    dateAdded: "Sept, 10, 2023",
    addedBy: "John Doe",
  },
  {
    id: "5",
    ambassadorName: "Emmanuel Adebayo",
    totalUsersIntroduced: 120,
    referralLink: "obrin.health/join/AMB00156",
    dateAdded: "Sept, 10, 2023",
    addedBy: "John Doe",
  },
  {
    id: "6",
    ambassadorName: "Emmanuel Adebayo",
    totalUsersIntroduced: 120,
    referralLink: "obrin.health/join/AMB00156",
    dateAdded: "Sept, 10, 2023",
    addedBy: "John Doe",
  },
  {
    id: "7",
    ambassadorName: "Emmanuel Adebayo",
    totalUsersIntroduced: 120,
    referralLink: "obrin.health/join/AMB00156",
    dateAdded: "Sept, 10, 2023",
    addedBy: "John Doe",
  },
];

export const CampaignAmbassadorsTab: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState("All actions");
  const [selectedRole, setSelectedRole] = useState("All roles");
  const [selectedDate, setSelectedDate] = useState("May 2023 – May 2024");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAmbassadorToRemove, setSelectedAmbassadorToRemove] =
    useState<CampaignAmbassadorRow | null>(null);

  return (
    <div className="space-y-4">
      {/* Header matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <h3 className="text-[18px] font-bold text-[#101828]">
          Recent Campaign Acquired Users
        </h3>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Show: All actions */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedAction}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All actions", "Active", "Pending"].map((act) => (
                <DropdownMenuItem
                  key={act}
                  onClick={() => setSelectedAction(act)}
                  className="text-[13px] cursor-pointer"
                >
                  {act}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show: All roles */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedRole}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All roles", "Lead", "Ambassador"].map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className="text-[13px] cursor-pointer"
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Date:</span>
              <span className="font-medium">{selectedDate}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {[
                "May 2023 – May 2024",
                "Last 30 Days",
                "Last 6 Months",
                "All Time",
              ].map((d) => (
                <DropdownMenuItem
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className="text-[13px] cursor-pointer"
                >
                  {d}
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
                <th className="py-3.5 px-6 font-normal">Ambassador</th>
                <th className="py-3.5 px-6 font-normal">Total Users Introduced</th>
                <th className="py-3.5 px-6 font-normal">Referral Link</th>
                <th className="py-3.5 px-6 font-normal">Date Added to Campaign</th>
                <th className="py-3.5 px-6 font-normal">Added By</th>
                <th className="py-3.5 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {mockCampaignAmbassadors.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Ambassador */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#BB1A8C] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        JD
                      </div>
                      <span>{row.ambassadorName}</span>
                    </div>
                  </td>

                  {/* Total Users Introduced */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    {row.totalUsersIntroduced}
                  </td>

                  {/* Referral Link */}
                  <td className="py-4 px-6 text-[#344054] font-mono whitespace-nowrap">
                    <span className="text-[#344054] hover:text-[#BB1A8C] transition-colors">
                      {row.referralLink}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[13px]">
                    {row.dateAdded}
                  </td>

                  {/* Added By */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#BB1A8C] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        JD
                      </div>
                      <span>{row.addedBy}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-3">
                      <Link
                        href={`/ambassadors/${row.id}`}
                        className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                      >
                        View
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-[#667085] transition-colors cursor-pointer outline-none">
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem className="text-[13px] cursor-pointer">
                            View Ambassador
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px] cursor-pointer">
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setSelectedAmbassadorToRemove(row)}
                            className="text-[13px] text-red-600 cursor-pointer"
                          >
                            Remove from Campaign
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

        {/* Footer (Page 1 of 10) */}
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

      {/* Remove Ambassador Modal */}
      <RemoveAmbassadorModal
        isOpen={!!selectedAmbassadorToRemove}
        onClose={() => setSelectedAmbassadorToRemove(null)}
        ambassadorName={selectedAmbassadorToRemove?.ambassadorName || "James Werinipre"}
        avatarUrl="/james-werinipre.jpg"
      />
    </div>
  );
};

export default CampaignAmbassadorsTab;
