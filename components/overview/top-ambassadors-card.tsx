"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Ambassador {
  id: string;
  rank: number;
  name: string;
  email: string;
  avatar: string;
  totalUsersIntroduced: number;
}

const mockAmbassadors: Ambassador[] = [
  {
    id: "1",
    rank: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    avatar: "/ambassador-avatar.jpg",
    totalUsersIntroduced: 200,
  },
  {
    id: "2",
    rank: 2,
    name: "Abigail Anna",
    email: "abigail@gmail.com",
    avatar: "/ambassador-avatar.jpg",
    totalUsersIntroduced: 200,
  },
  {
    id: "3",
    rank: 3,
    name: "Helen Sarah",
    email: "sarah@gmail.com",
    avatar: "/ambassador-avatar.jpg",
    totalUsersIntroduced: 200,
  },
  {
    id: "4",
    rank: 4,
    name: "Helen Sarah",
    email: "sarah@gmail.com",
    avatar: "/ambassador-avatar.jpg",
    totalUsersIntroduced: 200,
  },
  {
    id: "5",
    rank: 5,
    name: "Helen Sarah",
    email: "sarah@gmail.com",
    avatar: "/ambassador-avatar.jpg",
    totalUsersIntroduced: 200,
  },
];

const timeFilterOptions = [
  "Past 7 days",
  "Past 14 days",
  "Past 30 days",
  "Past 90 days",
  "All time",
];

export const TopAmbassadorsCard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("Past 7 days");

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-[#F2F4F7]">
        <div>
          <h3 className="text-[17px] font-semibold text-[#101828]">
            Top Ambassadors
          </h3>
          <p className="text-[12px] text-[#667085] mt-1">
            This is based on the number of user accumulated via campaigns.
          </p>
        </div>

        {/* Time Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors shadow-2xs self-start shrink-0 cursor-pointer">
            <span>{selectedFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {timeFilterOptions.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setSelectedFilter(opt)}
                className="text-[13px] cursor-pointer"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Ambassador List */}
      <div className="divide-y divide-[#F2F4F7]">
        {mockAmbassadors.map((ambassador) => (
          <div
            key={ambassador.id}
            className="py-3.5 first:pt-4 last:pb-0 flex items-center justify-between gap-3 hover:bg-[#FAFAFC] -mx-2 px-2 rounded-lg transition-colors"
          >
            {/* Rank badge + Avatar + Name/Email */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="size-6 rounded-full bg-[#BB1A8C] text-white text-[11px] font-semibold flex items-center justify-center shrink-0 shadow-2xs">
                {ambassador.rank}
              </span>

              <div className="size-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[#F2F4F7]">
                <Image
                  src={ambassador.avatar}
                  alt={ambassador.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#101828] truncate leading-tight">
                  {ambassador.name}
                </p>
                <p className="text-[11px] text-[#667085] truncate leading-tight mt-0.5">
                  {ambassador.email}
                </p>
              </div>
            </div>

            {/* Total Users Introduced & View Profile */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-right">
              <div>
                <span className="block text-[11px] text-[#667085] leading-none mb-1">
                  Total User Introduced
                </span>
                <span className="font-general-sans text-[15px] sm:text-[16px] font-bold text-[#101828] leading-none">
                  {ambassador.totalUsersIntroduced}
                </span>
              </div>

              <Link
                href={`/ambassadors/${ambassador.id}`}
                className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors shrink-0"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAmbassadorsCard;
