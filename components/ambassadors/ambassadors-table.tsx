"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Check,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export interface AmbassadorRow {
  id: string;
  name: string;
  avatarText: string;
  contactNumber: string;
  activeCampaign: string;
  type: "Physical" | "Digital";
  totalUsersIntroduced: number;
  status: "Active" | "Inactive" | "Suspended";
}

export const initialMockAmbassadors: AmbassadorRow[] = [
  {
    id: "1",
    name: "Emmanuel Adebayo",
    avatarText: "JD",
    contactNumber: "+234 8175927055",
    activeCampaign: "Unilag Outreach",
    type: "Physical",
    totalUsersIntroduced: 245,
    status: "Inactive",
  },
  {
    id: "2",
    name: "Emmanuel Adebayo",
    avatarText: "JD",
    contactNumber: "+234 8175927055",
    activeCampaign: "Unilag Outreach",
    type: "Digital",
    totalUsersIntroduced: 120,
    status: "Active",
  },
  {
    id: "3",
    name: "Emmanuel Adebayo",
    avatarText: "JD",
    contactNumber: "+234 8175927055",
    activeCampaign: "Unilag Outreach",
    type: "Digital",
    totalUsersIntroduced: 100,
    status: "Inactive",
  },
  {
    id: "4",
    name: "Emmanuel Adebayo",
    avatarText: "JD",
    contactNumber: "+234 8175927055",
    activeCampaign: "Ambassador",
    type: "Physical",
    totalUsersIntroduced: 120,
    status: "Suspended",
  },
  {
    id: "5",
    name: "Emmanuel Adebayo",
    avatarText: "JD",
    contactNumber: "+234 8175927055",
    activeCampaign: "Unilag Outreach",
    type: "Digital",
    totalUsersIntroduced: 120,
    status: "Active",
  },
  {
    id: "6",
    name: "Emmanuel Adebayo",
    avatarText: "JD",
    contactNumber: "+234 8175927055",
    activeCampaign: "Ambassador",
    type: "Physical",
    totalUsersIntroduced: 120,
    status: "Active",
  },
  {
    id: "7",
    name: "Emmanuel Adebayo",
    avatarText: "JD",
    contactNumber: "+234 8175927055",
    activeCampaign: "WhatsApp",
    type: "Physical",
    totalUsersIntroduced: 120,
    status: "Active",
  },
];

interface ColumnConfig {
  id: keyof AmbassadorRow | "actions";
  label: string;
  visible: boolean;
}

export const AmbassadorsTable: React.FC<{
  ambassadors?: AmbassadorRow[];
}> = ({ ambassadors = initialMockAmbassadors }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedCampaign, setSelectedCampaign] = useState("All campaigns");
  const [selectedSource, setSelectedSource] = useState("All source");
  const [selectedDate, setSelectedDate] = useState("May 2023 – May 2024");
  const [currentPage, setCurrentPage] = useState(1);

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "Ambassador", visible: true },
    { id: "contactNumber", label: "Contact Number", visible: true },
    { id: "activeCampaign", label: "Active Campaign", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "totalUsersIntroduced", label: "Total Users Introduced", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isVisible = (id: string) =>
    columns.find((c) => c.id === id)?.visible ?? true;

  // Filter ambassadors
  const filteredAmbassadors = ambassadors.filter((amb) => {
    const matchesSearch =
      amb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.contactNumber.includes(searchQuery) ||
      amb.activeCampaign.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All status" || amb.status === selectedStatus;

    const matchesCampaign =
      selectedCampaign === "All campaigns" ||
      amb.activeCampaign === selectedCampaign;

    const matchesSource =
      selectedSource === "All source" || amb.type === selectedSource;

    return matchesSearch && matchesStatus && matchesCampaign && matchesSource;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Controls */}
      <div className="space-y-3">
        {/* Table View Column Button */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[#344054] text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <SlidersHorizontal className="size-3.5 text-[#667085]" />
              <span>Table view column</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2 space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-[#8A9BA8] uppercase tracking-wider">
                Toggle Columns
              </div>
              {columns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => toggleColumn(col.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[13px] text-[#344054] hover:bg-gray-100 transition-colors text-left cursor-pointer"
                >
                  <span>{col.label}</span>
                  {col.visible && <Check className="size-3.5 text-[#BB1A8C]" />}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
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
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Show: All status */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <span className="text-[#667085]">Show:</span>
                <span className="font-medium">{selectedStatus}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {["All status", "Active", "Inactive", "Suspended"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className="text-[13px] cursor-pointer"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Show: All campaigns */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <span className="text-[#667085]">Show:</span>
                <span className="font-medium">{selectedCampaign}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {[
                  "All campaigns",
                  "Unilag Outreach",
                  "Ambassador",
                  "WhatsApp",
                ].map((camp) => (
                  <DropdownMenuItem
                    key={camp}
                    onClick={() => setSelectedCampaign(camp)}
                    className="text-[13px] cursor-pointer"
                  >
                    {camp}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Show: All source */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <span className="text-[#667085]">Show:</span>
                <span className="font-medium">{selectedSource}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {["All source", "Physical", "Digital"].map((src) => (
                  <DropdownMenuItem
                    key={src}
                    onClick={() => setSelectedSource(src)}
                    className="text-[13px] cursor-pointer"
                  >
                    {src}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Picker */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <Calendar className="size-3.5 text-[#667085] hidden sm:inline" />
                <span className="text-[#667085]">Date:</span>
                <span className="font-medium">{selectedDate}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {[
                  "May 2023 – May 2024",
                  "Last 30 Days",
                  "Last 6 Months",
                  "Year to Date",
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
      </div>

      {/* Table Container */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-[#FAFAFC] text-[12px] font-normal text-[#667085]">
                {isVisible("name") && (
                  <th className="py-3 px-6 font-normal">Ambassador</th>
                )}
                {isVisible("contactNumber") && (
                  <th className="py-3 px-6 font-normal">Contact Number</th>
                )}
                {isVisible("activeCampaign") && (
                  <th className="py-3 px-6 font-normal">Active Campaign</th>
                )}
                {isVisible("type") && (
                  <th className="py-3 px-6 font-normal">Type</th>
                )}
                {isVisible("totalUsersIntroduced") && (
                  <th className="py-3 px-6 font-normal">
                    Total Users Introduced
                  </th>
                )}
                {isVisible("status") && (
                  <th className="py-3 px-6 font-normal">Status</th>
                )}
                {isVisible("actions") && (
                  <th className="py-3 px-6 font-normal text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {filteredAmbassadors.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.filter((c) => c.visible).length}
                    className="py-12 text-center text-[#667085]"
                  >
                    No ambassadors found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAmbassadors.map((amb) => (
                  <tr
                    key={amb.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Ambassador with JD Initials Badge */}
                    {isVisible("name") && (
                      <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-[#BB1A8C] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                            {amb.avatarText}
                          </div>
                          <span className="text-[13px] font-medium text-[#101828]">
                            {amb.name}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Contact Number */}
                    {isVisible("contactNumber") && (
                      <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[13px]">
                        {amb.contactNumber}
                      </td>
                    )}

                    {/* Active Campaign */}
                    {isVisible("activeCampaign") && (
                      <td className="py-4 px-6 text-[#344054] whitespace-nowrap">
                        {amb.activeCampaign}
                      </td>
                    )}

                    {/* Type Badge */}
                    {isVisible("type") && (
                      <td className="py-4 px-6 whitespace-nowrap">
                        {amb.type === "Physical" ? (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#E7F8F0] text-[#0D894F]">
                            Physical
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
                            Digital
                          </span>
                        )}
                      </td>
                    )}

                    {/* Total Users Introduced */}
                    {isVisible("totalUsersIntroduced") && (
                      <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                        {amb.totalUsersIntroduced}
                      </td>
                    )}

                    {/* Status Badge */}
                    {isVisible("status") && (
                      <td className="py-4 px-6 whitespace-nowrap">
                        {amb.status === "Active" && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
                            Active
                          </span>
                        )}
                        {amb.status === "Inactive" && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF6EE] text-[#F79009]">
                            Inactive
                          </span>
                        )}
                        {amb.status === "Suspended" && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF3F2] text-[#B42318]">
                            Suspended
                          </span>
                        )}
                      </td>
                    )}

                    {/* Actions */}
                    {isVisible("actions") && (
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-3">
                          <Link
                            href={`/ambassadors/${amb.id}`}
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
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[13px] cursor-pointer">
                                View Referrals
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[13px] cursor-pointer">
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-[13px] text-red-600 cursor-pointer">
                                Suspend Ambassador
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
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= 10}
              onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorsTable;
