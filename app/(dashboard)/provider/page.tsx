"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
// ProviderEmptyState is ready to use when data is empty or during backend integration
// import ProviderEmptyState from "@/components/provider/empty-state";

interface Provider {
  id: string;
  name: string;
  avatar: string;
  type: "Clinic" | "Pharmacy";
  location: string;
  referrals: number;
  redeemed: number;
  status: "Active" | "Suspended";
}

const mockProviders: Provider[] = [
  {
    id: "1",
    name: "XYZ Clinic",
    avatar: "JD",
    type: "Clinic",
    location: "Ikeja",
    referrals: 245,
    redeemed: 245,
    status: "Suspended",
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "JD",
    type: "Pharmacy",
    location: "Yaba",
    referrals: 120,
    redeemed: 120,
    status: "Active",
  },
  {
    id: "3",
    name: "John Doe",
    avatar: "JD",
    type: "Clinic",
    location: "Campaign",
    referrals: 100,
    redeemed: 100,
    status: "Active",
  },
  {
    id: "4",
    name: "John Doe",
    avatar: "JD",
    type: "Clinic",
    location: "Ambassador",
    referrals: 120,
    redeemed: 120,
    status: "Active",
  },
  {
    id: "5",
    name: "John Doe",
    avatar: "JD",
    type: "Pharmacy",
    location: "Ambassador",
    referrals: 120,
    redeemed: 120,
    status: "Active",
  },
  {
    id: "6",
    name: "John Doe",
    avatar: "JD",
    type: "Pharmacy",
    location: "Ambassador",
    referrals: 120,
    redeemed: 120,
    status: "Active",
  },
  {
    id: "7",
    name: "John Doe",
    avatar: "JD",
    type: "Pharmacy",
    location: "WhatsApp",
    referrals: 120,
    redeemed: 120,
    status: "Active",
  },
];

const statsRow1 = [
  { label: "Total Providers", value: "5k" },
  { label: "Active Providers", value: "1.2k" },
  { label: "Suspended Providers", value: "3.2k" },
];

const statsRow2 = [
  { label: "Total Referrals Received", value: "1.2k" },
  { label: "Total Redeemed Referrals", value: "200" },
  { label: "Overall Conversion Rate", value: "50%" },
];

const ProviderPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All types");
  const [selectedStatus, setSelectedStatus] = useState<string>("All status");

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All types" || provider.type === selectedType;
    const matchesStatus =
      selectedStatus === "All status" || provider.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full flex flex-col font-sans pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#101828] tracking-tight">
          Providers
        </h1>
        <Link
          href="/provider/new"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white text-[14px] font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          Onboard new provider
        </Link>
      </div>

      {/* Metrics Card (Figma Inspect Spec) */}
      <div className="w-full flex flex-col rounded-[8px] border border-white bg-linear-to-b from-white via-white/95 to-white/75 backdrop-blur-2xl shadow-[0px_4px_24px_-1px_rgba(209,205,199,0.25)] px-8 py-6 mb-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {statsRow1.map((item, idx) => (
            <div
              key={item.label}
              className={`${
                idx === 0 ? "md:pr-8" : idx === 2 ? "md:pl-8" : "md:px-8"
              } py-2 md:py-0`}
            >
              <span className="text-[13px] font-normal text-[#667085]">
                {item.label}
              </span>
              <p className="font-general-sans text-[#253B4B] text-[32px] font-semibold mt-2 tracking-tight">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Divider & Row 2 with 30px gap */}
        <div className="border-t border-gray-100 mt-7.5 pt-7.5">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {statsRow2.map((item, idx) => (
              <div
                key={item.label}
                className={`${
                  idx === 0 ? "md:pr-8" : idx === 2 ? "md:pl-8" : "md:px-8"
                } py-2 md:py-0`}
              >
                <span className="text-[13px] font-normal text-[#667085]">
                  {item.label}
                </span>
                <p className="font-general-sans text-[#253B4B] text-[32px] font-semibold mt-2 tracking-tight">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5 border-b border-[#EFF1F5] pb-4">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-1 py-1.5 w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8A9BA8] shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[14px] text-[#101828] outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-[13px] text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
              <span>
                Show:{" "}
                <strong className="text-[#101828] font-medium">
                  {selectedType}
                </strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedType("All types")}>
                All types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("Clinic")}>
                Clinic
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedType("Pharmacy")}>
                Pharmacy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-[13px] text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
              <span>
                Show:{" "}
                <strong className="text-[#101828] font-medium">
                  {selectedStatus}
                </strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedStatus("All status")}>
                All status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("Active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedStatus("Suspended")}>
                Suspended
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                  User
                </th>
                <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                  Type
                </th>
                <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                  Location
                </th>
                <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                  Referrals
                </th>
                <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                  Redeemed
                </th>
                <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                  Status
                </th>
                <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[14px]">
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A9BA8]">
                    No providers match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <tr
                    key={provider.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* User Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary text-white flex items-center justify-center font-medium text-xs shrink-0">
                          {provider.avatar}
                        </div>
                        <span className="font-medium text-[#101828]">
                          {provider.name}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6 text-[#253B4B]">
                      {provider.type}
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-[#253B4B]">
                      {provider.location}
                    </td>

                    {/* Referrals */}
                    <td className="py-4 px-6 text-[#253B4B]">
                      {provider.referrals}
                    </td>

                    {/* Redeemed */}
                    <td className="py-4 px-6 text-[#253B4B]">
                      {provider.redeemed}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {provider.status === "Active" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF3] text-[#027A48]">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3F2] text-[#D92D20]">
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/provider/${provider.id}`}
                          className="text-primary font-medium hover:underline cursor-pointer"
                        >
                          View
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label="More options"
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100 outline-none flex items-center justify-center"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link
                                href={`/provider/${provider.id}`}
                                className="w-full flex"
                              >
                                View details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit provider</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:text-red-700">
                              {provider.status === "Active"
                                ? "Suspend provider"
                                : "Activate provider"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
          <span className="text-[13px] text-[#667085]">Page 1 of 10</span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="px-4 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#253B4B] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-4 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#253B4B] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPage;
