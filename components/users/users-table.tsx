"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  MoreVertical,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export interface UserRow {
  id: string;
  name: string;
  phone: string;
  source: "WhatsApp" | "Ambassador";
  campaign: string;
  referralsGenerated: number;
  redeemed: number;
  lastActiveDate: string;
}

export const initialMockUsers: UserRow[] = [
  {
    id: "1",
    name: "Emmanuel Adebayo",
    phone: "+234 8175927055",
    source: "WhatsApp",
    campaign: "Unilag Outreach",
    referralsGenerated: 245,
    redeemed: 245,
    lastActiveDate: "Sept, 10, 2023: 10:00AM",
  },
  {
    id: "2",
    name: "Emmanuel Adebayo",
    phone: "+234 8175927055",
    source: "Ambassador",
    campaign: "-",
    referralsGenerated: 120,
    redeemed: 120,
    lastActiveDate: "Sept, 10, 2023: 10:00AM",
  },
  {
    id: "3",
    name: "Emmanuel Adebayo",
    phone: "+234 8175927055",
    source: "Ambassador",
    campaign: "Unilag Outreach",
    referralsGenerated: 100,
    redeemed: 100,
    lastActiveDate: "Sept, 10, 2023: 10:00AM",
  },
  {
    id: "4",
    name: "Emmanuel Adebayo",
    phone: "+234 8175927055",
    source: "WhatsApp",
    campaign: "-",
    referralsGenerated: 120,
    redeemed: 120,
    lastActiveDate: "Sept, 10, 2023: 10:00AM",
  },
  {
    id: "5",
    name: "Emmanuel Adebayo",
    phone: "+234 8175927055",
    source: "Ambassador",
    campaign: "Unilag Outreach",
    referralsGenerated: 120,
    redeemed: 120,
    lastActiveDate: "Sept, 10, 2023: 10:00AM",
  },
  {
    id: "6",
    name: "Emmanuel Adebayo",
    phone: "+234 8175927055",
    source: "WhatsApp",
    campaign: "Ambassador",
    referralsGenerated: 120,
    redeemed: 120,
    lastActiveDate: "Sept, 10, 2023: 10:00AM",
  },
  {
    id: "7",
    name: "Emmanuel Adebayo",
    phone: "+234 8175927055",
    source: "WhatsApp",
    campaign: "WhatsApp",
    referralsGenerated: 120,
    redeemed: 120,
    lastActiveDate: "Sept, 10, 2023: 10:00AM",
  },
];

interface ColumnConfig {
  id: keyof UserRow | "actions";
  label: string;
  visible: boolean;
}

export const UsersTable: React.FC<{ users?: UserRow[] }> = ({
  users = initialMockUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("All campaigns");
  const [selectedSource, setSelectedSource] = useState("All source");
  const [selectedDate, setSelectedDate] = useState("May 2023 - May 2024");
  const [currentPage, setCurrentPage] = useState(1);

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "User", visible: true },
    { id: "phone", label: "Phone/Whatsapp", visible: true },
    { id: "source", label: "Source", visible: true },
    { id: "campaign", label: "Campaign", visible: true },
    { id: "referralsGenerated", label: "Referrals Generated", visible: true },
    { id: "redeemed", label: "Redeemed", visible: true },
    { id: "lastActiveDate", label: "Last Active Date", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isVisible = (id: string) =>
    columns.find((c) => c.id === id)?.visible ?? true;

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone.includes(searchQuery) ||
        u.campaign.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCampaign =
        selectedCampaign === "All campaigns" ||
        u.campaign.toLowerCase() === selectedCampaign.toLowerCase();

      const matchesSource =
        selectedSource === "All source" ||
        u.source.toLowerCase() === selectedSource.toLowerCase();

      return matchesSearch && matchesCampaign && matchesSource;
    });
  }, [users, searchQuery, selectedCampaign, selectedSource]);

  return (
    <div className="space-y-4">
      {/* Top Controls: Table View Column Button */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
            <SlidersHorizontal className="size-4 text-[#667085]" />
            <span>Table view column</span>
            <ChevronDown className="size-3.5 text-[#667085]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-1.5">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#8A9BA8] uppercase tracking-wider">
              Toggle Columns
            </div>
            {columns.map((col) => (
              <DropdownMenuItem
                key={col.id}
                onClick={(e) => {
                  e.preventDefault();
                  toggleColumn(col.id);
                }}
                className="flex items-center justify-between text-[13px] cursor-pointer"
              >
                <span>{col.label}</span>
                {col.visible && <Check className="size-4 text-[#BB1A8C]" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] w-full sm:max-w-xs shadow-2xs">
          <Search className="size-4 text-[#8A9BA8] shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] text-[#101828] placeholder-[#98A2B3] outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Campaign Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] md:text-[13px] font-normal text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              <span>Show:</span>
              <strong className="font-semibold text-[#101828]">
                {selectedCampaign}
              </strong>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All campaigns", "Unilag Outreach", "Ambassador", "WhatsApp"].map(
                (c) => (
                  <DropdownMenuItem
                    key={c}
                    onClick={() => setSelectedCampaign(c)}
                    className="text-[13px] cursor-pointer"
                  >
                    {c}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Source Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] md:text-[13px] font-normal text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              <span>Show:</span>
              <strong className="font-semibold text-[#101828]">
                {selectedSource}
              </strong>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All source", "WhatsApp", "Ambassador"].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => setSelectedSource(s)}
                  className="text-[13px] cursor-pointer"
                >
                  {s}
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

      {/* Data Table Container */}
      <div className="rounded-2xl border border-[#EAECF0] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-white text-[12px] font-normal text-[#667085]">
                {isVisible("name") && (
                  <th className="py-3.5 px-6 font-normal">User</th>
                )}
                {isVisible("phone") && (
                  <th className="py-3.5 px-6 font-normal">Phone/Whatsapp</th>
                )}
                {isVisible("source") && (
                  <th className="py-3.5 px-6 font-normal">Source</th>
                )}
                {isVisible("campaign") && (
                  <th className="py-3.5 px-6 font-normal">Campaign</th>
                )}
                {isVisible("referralsGenerated") && (
                  <th className="py-3.5 px-6 font-normal">
                    Referrals
                    <br className="sm:hidden" /> Generated
                  </th>
                )}
                {isVisible("redeemed") && (
                  <th className="py-3.5 px-6 font-normal">Redeemed</th>
                )}
                {isVisible("lastActiveDate") && (
                  <th className="py-3.5 px-6 font-normal">Last Active Date</th>
                )}
                {isVisible("actions") && (
                  <th className="py-3.5 px-6 font-normal text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-[13px]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.filter((c) => c.visible).length}
                    className="py-12 text-center text-[#667085]"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#FAFAFC] transition-colors"
                  >
                    {/* User Name */}
                    {isVisible("name") && (
                      <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                        {user.name}
                      </td>
                    )}

                    {/* Phone/Whatsapp */}
                    {isVisible("phone") && (
                      <td className="py-4 px-6 text-[#344054] whitespace-nowrap">
                        {user.phone}
                      </td>
                    )}

                    {/* Source Badge */}
                    {isVisible("source") && (
                      <td className="py-4 px-6 whitespace-nowrap">
                        {user.source === "WhatsApp" ? (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#E7F8F0] text-[#0D894F]">
                            WhatsApp
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
                            Ambassador
                          </span>
                        )}
                      </td>
                    )}

                    {/* Campaign */}
                    {isVisible("campaign") && (
                      <td className="py-4 px-6 text-[#344054] whitespace-nowrap">
                        {user.campaign}
                      </td>
                    )}

                    {/* Referrals Generated */}
                    {isVisible("referralsGenerated") && (
                      <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                        {user.referralsGenerated}
                      </td>
                    )}

                    {/* Redeemed */}
                    {isVisible("redeemed") && (
                      <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                        {user.redeemed}
                      </td>
                    )}

                    {/* Last Active Date */}
                    {isVisible("lastActiveDate") && (
                      <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[12px]">
                        {user.lastActiveDate}
                      </td>
                    )}

                    {/* Actions */}
                    {isVisible("actions") && (
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-3">
                          <Link
                            href={`/users/${user.id}`}
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
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[13px] cursor-pointer">
                                View Referrals
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-[13px] text-red-600 cursor-pointer">
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
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

export default UsersTable;
