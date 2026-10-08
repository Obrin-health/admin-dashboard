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

interface ReferralItem {
  id: string;
  code: string;
  provider: string;
  avatar: string;
  location: string;
  generationDate: string;
  redemptionDate: string;
  status: "Active" | "Suspended";
}

const mockReferrals: ReferralItem[] = [
  {
    id: "1",
    code: "OBR-2040",
    provider: "XYZ Clinic",
    avatar: "JD",
    location: "Ikeja",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Suspended",
  },
  {
    id: "2",
    code: "OBR-2040",
    provider: "Alpha Health",
    avatar: "JD",
    location: "Yaba",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Active",
  },
  {
    id: "3",
    code: "OBR-2040",
    provider: "BY Pharmacy",
    avatar: "JD",
    location: "Ikeja",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Active",
  },
  {
    id: "4",
    code: "OBR-2040",
    provider: "XYZ Clinic",
    avatar: "JD",
    location: "Ikeja",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Active",
  },
  {
    id: "5",
    code: "OBR-2040",
    provider: "BY Pharmacy",
    avatar: "JD",
    location: "Ikeja",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Active",
  },
  {
    id: "6",
    code: "OBR-2040",
    provider: "XYZ Clinic",
    avatar: "JD",
    location: "Ikeja",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Active",
  },
  {
    id: "7",
    code: "OBR-2040",
    provider: "BY Pharmacy",
    avatar: "JD",
    location: "Ikeja",
    generationDate: "Sept, 10, 2023",
    redemptionDate: "Sept, 10, 2023",
    status: "Active",
  },
];

export const UserRecentReferrals: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState("All actions");
  const [selectedRole, setSelectedRole] = useState("All roles");
  const [selectedDate, setSelectedDate] = useState("May 2023 - May 2024");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full space-y-4 pt-4">
      {/* Header and Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-[18px] font-bold text-[#101828]">
          Recent Referrals
        </h3>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Actions Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] md:text-[13px] font-normal text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              <span>Show:</span>
              <strong className="font-semibold text-[#101828]">
                {selectedAction}
              </strong>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All actions", "Redeemed", "Generated", "Pending"].map((a) => (
                <DropdownMenuItem
                  key={a}
                  onClick={() => setSelectedAction(a)}
                  className="text-[13px] cursor-pointer"
                >
                  {a}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Roles Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] md:text-[13px] font-normal text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              <span>Show:</span>
              <strong className="font-semibold text-[#101828]">
                {selectedRole}
              </strong>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All roles", "Admin", "User", "Ambassador"].map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className="text-[13px] cursor-pointer"
                >
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] md:text-[13px] font-normal text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              <span>Date:</span>
              <strong className="font-semibold text-[#101828]">
                {selectedDate}
              </strong>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[
                "May 2023 - May 2024",
                "Past 30 days",
                "Past 90 days",
                "All time",
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

      {/* Referrals Table Container */}
      <div className="rounded-2xl border border-[#EAECF0] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-white text-[12px] font-normal text-[#667085]">
                <th className="py-3.5 px-6 font-normal">Referral Code</th>
                <th className="py-3.5 px-6 font-normal">Provider</th>
                <th className="py-3.5 px-6 font-normal">Location</th>
                <th className="py-3.5 px-6 font-normal">Generation Date</th>
                <th className="py-3.5 px-6 font-normal">Redemption Date</th>
                <th className="py-3.5 px-6 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-[13px]">
              {mockReferrals.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#FAFAFC] transition-colors"
                >
                  {/* Referral Code */}
                  <td className="py-4 px-6 text-[#344054] font-medium whitespace-nowrap">
                    {item.code}
                  </td>

                  {/* Provider */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#BB1A8C] text-white flex items-center justify-center font-semibold text-xs shrink-0">
                        {item.avatar}
                      </div>
                      <span className="font-medium text-[#101828]">
                        {item.provider}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                    {item.location}
                  </td>

                  {/* Generation Date */}
                  <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                    {item.generationDate}
                  </td>

                  {/* Redemption Date */}
                  <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                    {item.redemptionDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {item.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF3F2] text-[#D92D20]">
                        Suspended
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-3">
                      <Link
                        href={`/referrals/${item.id}`}
                        className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                      >
                        View
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-[#667085] transition-colors cursor-pointer outline-none">
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem className="text-[13px] cursor-pointer">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-[13px] text-red-600 cursor-pointer">
                            Suspend Code
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

        {/* Table Footer with Pagination */}
        <div className="py-3.5 px-6 border-t border-[#EAECF0] flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">
            Page {currentPage} of 10
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage === 10}
              onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRecentReferrals;
