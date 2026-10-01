"use client";

import React, { useState } from "react";
import { ChevronDown, MoreVertical, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface Referral {
  id: string;
  code: string;
  user: string;
  avatar: string;
  location: string;
  ambassador: string;
  campaign: string;
  date: string;
  status: "Redeemed" | "Pending";
}

const mockReferrals: Referral[] = [
  {
    id: "1",
    code: "OBR-2040",
    user: "XYZ Clinic",
    avatar: "JD",
    location: "Ikeja",
    ambassador: "Emmanuel Adebayo",
    campaign: "Unilag Campaign",
    date: "Sept., 10, 2023",
    status: "Redeemed",
  },
  {
    id: "2",
    code: "OBR-2040",
    user: "John Doe",
    avatar: "JD",
    location: "Yaba",
    ambassador: "Emmanuel Adebayo",
    campaign: "LASU Campaign",
    date: "Sept., 10, 2023",
    status: "Pending",
  },
  {
    id: "3",
    code: "OBR-2040",
    user: "John Doe",
    avatar: "JD",
    location: "Campaign",
    ambassador: "Emmanuel Adebayo",
    campaign: "Unilag Campaign",
    date: "Sept., 10, 2023",
    status: "Pending",
  },
  {
    id: "4",
    code: "OBR-2040",
    user: "John Doe",
    avatar: "JD",
    location: "Ambassador",
    ambassador: "Emmanuel Adebayo",
    campaign: "Unilag Campaign",
    date: "Sept., 10, 2023",
    status: "Redeemed",
  },
  {
    id: "5",
    code: "OBR-2040",
    user: "John Doe",
    avatar: "JD",
    location: "Ambassador",
    ambassador: "Emmanuel Adebayo",
    campaign: "Unilag Campaign",
    date: "Sept., 10, 2023",
    status: "Redeemed",
  },
  {
    id: "6",
    code: "OBR-2040",
    user: "John Doe",
    avatar: "JD",
    location: "Ambassador",
    ambassador: "Emmanuel Adebayo",
    campaign: "Unilag Campaign",
    date: "Sept., 10, 2023",
    status: "Pending",
  },
  {
    id: "7",
    code: "OBR-2040",
    user: "John Doe",
    avatar: "JD",
    location: "WhatsApp",
    ambassador: "Emmanuel Adebayo",
    campaign: "Unilag Campaign",
    date: "Sept., 10, 2023",
    status: "Redeemed",
  },
];

const services = [
  "General Consultation",
  "Woman Health",
  "Family Planning",
  "Family Planning",
  "Family Planning",
  "Family Planning",
  "Family Planning",
  "Family Planning",
];

export default function ProviderDetailsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "referrals">(
    "overview",
  );
  const [selectedAction, setSelectedAction] = useState<string>("All actions");
  const [selectedRole, setSelectedRole] = useState<string>("All roles");
  const [selectedDate, setSelectedDate] = useState<string>(
    "May 2023 – May 2024",
  );

  return (
    <div className="w-full flex flex-col font-sans space-y-6 pb-12">
      {/* 1. Top Provider Profile Card */}
      <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative size-14 rounded-full bg-blue-50 border-2 border-white shadow-xs overflow-hidden shrink-0 flex items-center justify-center text-blue-600 font-bold">
            <svg
              className="w-full h-full text-blue-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#101828]">XYZ Clinic</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#027A48] text-white">
                Active
                <Image src="/check.png" alt="Check" width={12} height={12} />
              </span>
            </div>
            <p className="text-xs text-[#5D6B90] font-medium mt-1">
              Provider ID: HFHG8794
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] sm:text-sm text-[#5D6B90] mt-4 leading-relaxed max-w-4xl">
          Bloom Women&apos;s Health Centre is a women-focused healthcare
          provider offering accessible reproductive and sexual health services,
          consultations, testing, and family planning support.
        </p>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 mt-6 -mb-6 px-1">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-normal w-32.5 transition-all relative cursor-pointer ${
              activeTab === "overview"
                ? "text-primary border-b-2 border-primary"
                : "text-[#5D6B90] hover:text-[#253B4B]"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("referrals")}
            className={`pb-3 text-sm font-normal w-32.5 transition-all relative cursor-pointer ${
              activeTab === "referrals"
                ? "text-primary border-b-2 border-primary"
                : "text-[#5D6B90] hover:text-[#253B4B]"
            }`}
          >
            Referrals
          </button>
        </div>
      </div>

      {/* 2. Middle Section: Provider Details (Left) + Quick Stat & Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-[#667085] font-normal">
                User ID :
              </span>
              <span className="col-span-7 text-[#101828] font-semibold">
                1204GHV HUIHHKJKN MK
              </span>
            </div>

            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-[#667085] font-normal">
                Email Address
              </span>
              <span className="col-span-7 text-[#101828] font-semibold">
                xyz@gmail.com
              </span>
            </div>

            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-[#667085] font-normal">
                Provider type:
              </span>
              <span className="col-span-7 text-[#101828] font-semibold">
                Pharmacy
              </span>
            </div>

            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-[#667085] font-normal">
                Address:
              </span>
              <span className="col-span-7 text-[#101828] font-semibold">
                190 Allen Avenue, Ikeja
              </span>
            </div>

            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-[#667085] font-normal">
                Location:
              </span>
              <span className="col-span-7 text-[#101828] font-semibold">
                Ikeja, Lagos
              </span>
            </div>

            <div className="grid grid-cols-12 items-center">
              <span className="col-span-5 text-[#667085] font-normal">
                Date Onboarded:
              </span>
              <span className="col-span-7 text-[#101828] font-semibold">
                10: 00AM, August 20, 2024
              </span>
            </div>
          </div>

          {/* Services */}
          <div className="mt-8">
            <h4 className="text-sm font-bold text-[#101828] mb-3">Services</h4>
            <div className="flex flex-wrap gap-2">
              {services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FDF2F8] text-primary border border-pink-100"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Stat & Map */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-100 bg-white shadow-xs flex flex-col gap-4 pb-5">
          {/* Header */}
          <div className="flex items-center gap-2.5 bg-[#EBF5FF80] p-5">
            <div className="size-8 flex items-center justify-center text-sky-500">
              <Image
                src="/provider/quick-stat.png"
                alt="Quick Stat"
                width={40}
                height={40}
              />
            </div>
            <div>
              <span className="text-[12px] font-medium text-[#0780E2] tracking-wider uppercase block leading-none font-general-sans">
                QUICK STAT
              </span>
              <span className="text-[10px] text-[#8A9BA8] block mt-0.5">
                14, Sept., 2024, 10:57 am
              </span>
            </div>
          </div>

          {/* Quick Stat 2x2 Grid */}
          <div className="rounded-xl bg-white border border-gray-100 grid grid-cols-2 gap-5 shadow-xs mx-5 p-5">
            {/* Stat 1 */}
            <div className="flex items-center gap-3">
              <div className="size-8 flex items-center justify-center text-blue-500 shrink-0">
                <Image
                  src="/provider/referrals.png"
                  alt="Total Referrals"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <span className="text-[12px] text-[#5D6B90] block leading-tight">
                  Total Referrals
                </span>
                <span className="text-[16px] font-[600] text-[#253B4B] font-general-sans">
                  245
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3">
              <div className="size-8 flex items-center justify-center text-sky-500 shrink-0">
                <Image
                  src="/provider/calculator.png"
                  alt="Redeemed"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <span className="text-[12px] text-[#5D6B90] block leading-tight">
                  Redeemed
                </span>
                <span className="text-[16px] font-semibold text-[#253B4B] font-general-sans">
                  245
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                <Image
                  src="/provider/redeemed.png"
                  alt="Redeemed"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <span className="text-[12px] text-[#5D6B90] block leading-tight">
                  Redeemed
                </span>
                <span className="text-[16px] font-semibold text-[#253B4B] font-general-sans">
                  245
                </span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <Image
                  src="/provider/rate.png"
                  alt="Conversion Rate"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <span className="text-[12px] text-[#5D6B90] block leading-tight">
                  Conversion Rate
                </span>
                <span className="text-[16px] font-semibold text-[#253B4B] font-general-sans">
                  245
                </span>
              </div>
            </div>
          </div>

          {/* Map Preview Card */}
          <div className="rounded-xl bg-white border border-gray-100 overflow-hidden shadow-xs flex flex-col mx-5">
            {/* Stylized SVG Map Illustration */}
            <div className="h-32 w-full bg-[#E8EEF5] relative overflow-hidden flex items-center justify-center">
              <svg
                className="absolute inset-0 w-full h-full opacity-60"
                viewBox="0 0 400 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Roads */}
                <path
                  d="M-20 40 Q 150 70 420 20"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                />
                <path
                  d="M-20 120 Q 200 90 420 140"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                />
                <path
                  d="M100 -20 Q 140 80 180 180"
                  stroke="#FFFFFF"
                  strokeWidth="7"
                />
                <path
                  d="M260 -20 Q 280 90 320 180"
                  stroke="#FFE28C"
                  strokeWidth="5"
                />
                <path d="M20 160 L 380 -20" stroke="#FFE28C" strokeWidth="6" />
                <text
                  x="80"
                  y="45"
                  fill="#7E8B9B"
                  fontSize="12"
                  fontWeight="bold"
                  letterSpacing="1"
                >
                  AGEGE
                </text>
              </svg>

              {/* Pin & Label */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="relative">
                  <MapPin className="w-7 h-7 text-red-600 fill-red-600 drop-shadow-md" />
                </div>
                <span className="text-xl font-bold text-[#101828] drop-shadow-xs">
                  Ikeja
                </span>
              </div>
            </div>

            {/* Map Card Footer */}
            <div className="p-3 px-4 flex items-center justify-between bg-white text-xs border-t border-gray-100">
              <span className="text-[#253B4B] font-medium">Ikeja, Lagos</span>
              <button
                type="button"
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                View on Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Recent Referrals Table */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#101828]">Recent Referrals</h3>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
            {/* Action Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
                <span>
                  Show:{" "}
                  <strong className="text-[#101828] font-medium">
                    {selectedAction}
                  </strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setSelectedAction("All actions")}
                >
                  All actions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedAction("Redeemed")}>
                  Redeemed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedAction("Pending")}>
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Role Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
                <span>
                  Show:{" "}
                  <strong className="text-[#101828] font-medium">
                    {selectedRole}
                  </strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedRole("All roles")}>
                  All roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("Clinic")}>
                  Clinic
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole("Pharmacy")}>
                  Pharmacy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
                <span>
                  Date:{" "}
                  <strong className="text-[#101828] font-medium">
                    {selectedDate}
                  </strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setSelectedDate("May 2023 – May 2024")}
                >
                  May 2023 – May 2024
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedDate("Jan 2024 – Dec 2024")}
                >
                  Jan 2024 – Dec 2024
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Referrals Table Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                    Referral Code
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                    User
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                    Location
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                    Ambassador
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                    Campaign
                  </th>
                  <th className="py-3.5 px-6 text-[12px] font-normal text-[#8A9BA8]">
                    Date Generated
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
                {mockReferrals.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Code */}
                    <td className="py-4 px-6 font-medium text-[#101828]">
                      {item.code}
                    </td>

                    {/* User */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary text-white flex items-center justify-center font-medium text-xs shrink-0">
                          {item.avatar}
                        </div>
                        <span className="font-medium text-[#101828]">
                          {item.user}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-[#253B4B]">
                      {item.location}
                    </td>

                    {/* Ambassador */}
                    <td className="py-4 px-6 text-[#253B4B]">
                      {item.ambassador}
                    </td>

                    {/* Campaign */}
                    <td className="py-4 px-6 text-[#253B4B]">
                      {item.campaign}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-[#253B4B]">{item.date}</td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {item.status === "Redeemed" ? (
                        <span className="text-[#027A48] font-medium text-xs">
                          Redeemed
                        </span>
                      ) : (
                        <span className="text-amber-500 font-medium text-xs">
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-primary font-medium hover:underline cursor-pointer"
                        >
                          View
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            aria-label="More options"
                            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100 outline-none flex items-center justify-center"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>
                              Copy referral code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Cancel referral
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
    </div>
  );
}
