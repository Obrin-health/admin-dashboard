"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  MoreVertical,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export interface ReferralRow {
  id: string;
  code: string;
  provider: string;
  providerInitials: string;
  user: string;
  generationDate: string;
  redemptionDate: string;
  status: "Redeemed" | "Active" | "Expired";
}

export const mockReferralsList: ReferralRow[] = [
  {
    id: "1",
    code: "OBR-2040",
    provider: "XYZ Clinic",
    providerInitials: "JD",
    user: "Emmanuel Adebayo",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Redeemed",
  },
  {
    id: "2",
    code: "OBR-2040",
    provider: "John Doe",
    providerInitials: "JD",
    user: "Emmanuel Adebayo",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Active",
  },
  {
    id: "3",
    code: "OBR-2040",
    provider: "John Doe",
    providerInitials: "JD",
    user: "Emmanuel Adebayo",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Expired",
  },
  {
    id: "4",
    code: "OBR-2040",
    provider: "John Doe",
    providerInitials: "JD",
    user: "Emmanuel Adebayo",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Redeemed",
  },
  {
    id: "5",
    code: "OBR-2040",
    provider: "John Doe",
    providerInitials: "JD",
    user: "Emmanuel Adebayo",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Redeemed",
  },
  {
    id: "6",
    code: "OBR-2040",
    provider: "John Doe",
    providerInitials: "JD",
    user: "Emmanuel Adebayo",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Redeemed",
  },
  {
    id: "7",
    code: "OBR-2040",
    provider: "John Doe",
    providerInitials: "JD",
    user: "Emmanuel Adebayo",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Redeemed",
  },
];

export const ReferralsTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedPhone, setSelectedPhone] = useState("All Phone number");
  const [selectedDate, setSelectedDate] = useState("May 2023 – May 2024");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReferrals = mockReferralsList.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All status" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReferralRow["status"]) => {
    switch (status) {
      case "Redeemed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
            Redeemed
          </span>
        );
      case "Active":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
            Active
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#FEF3F2] text-[#B42318]">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Controls Row: Table view column */}
      <div className="flex items-center justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
            <SlidersHorizontal className="size-4 text-[#667085]" />
            <span className="font-medium">Table view column</span>
            <ChevronDown className="size-3.5 text-[#667085]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {[
              "Referral Code",
              "Provider",
              "User",
              "Generation Date",
              "Redemption Date",
              "Status",
            ].map((col) => (
              <DropdownMenuItem key={col} className="text-[13px] cursor-pointer">
                ✓ {col}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] placeholder-[#667085] focus:outline-none focus:border-[#BB1A8C] transition-colors shadow-2xs"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Show: All status */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedStatus}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {["All status", "Redeemed", "Active", "Expired"].map((st) => (
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

          {/* Show: All Phone number */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedPhone}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {["All Phone number", "With Phone", "Without Phone"].map((ph) => (
                <DropdownMenuItem
                  key={ph}
                  onClick={() => setSelectedPhone(ph)}
                  className="text-[13px] cursor-pointer"
                >
                  {ph}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date: May 2023 - May 2024 */}
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

      {/* 3. Table Container */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-[#FAFAFC]/60 text-[12px] font-normal text-[#667085]">
                <th className="py-3.5 px-6 font-normal">Referral Code</th>
                <th className="py-3.5 px-6 font-normal">Provider</th>
                <th className="py-3.5 px-6 font-normal">User</th>
                <th className="py-3.5 px-6 font-normal">Generation Date</th>
                <th className="py-3.5 px-6 font-normal">Redemption Date</th>
                <th className="py-3.5 px-6 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {filteredReferrals.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* Referral Code */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    {row.code}
                  </td>

                  {/* Provider */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#BB1A8C] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {row.providerInitials}
                      </div>
                      <span>{row.provider}</span>
                    </div>
                  </td>

                  {/* User */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    {row.user}
                  </td>

                  {/* Generation Date */}
                  <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[13px]">
                    {row.generationDate}
                  </td>

                  {/* Redemption Date */}
                  <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[13px]">
                    {row.redemptionDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-3">
                      <Link
                        href={`/referrals/${row.id}`}
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px] cursor-pointer">
                            Copy Code
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

export default ReferralsTable;
