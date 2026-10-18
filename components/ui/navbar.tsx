"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowLeft, LogOut, User as UserIcon } from "lucide-react";
import React from "react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const isProviderDetails =
    pathname?.startsWith("/provider/") && pathname !== "/provider";
  const isUserDetails =
    pathname?.startsWith("/users/") && pathname !== "/users";
  const isAmbassadorDetails =
    pathname?.startsWith("/ambassadors/") && pathname !== "/ambassadors";
  const isCampaignDetails =
    pathname?.startsWith("/campaigns/") && pathname !== "/campaigns";
  const isReferralDetails =
    pathname?.startsWith("/referrals/") && pathname !== "/referrals";

  const displayName =
    user?.fullName ||
    (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : null) ||
    user?.email ||
    "Obrin Admin";

  const displayRole = user?.role?.label || (typeof user?.role === "string" ? user.role : "Super Admin");
  const initial = displayName.charAt(0).toUpperCase() || "O";

  return (
    <header className="w-full shrink-0 flex items-center justify-between pb-6 font-sans">
      {isProviderDetails ? (
        <Link
          href="/provider"
          className="inline-flex items-center gap-2.5 text-[#101828] font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#101828]" />
          <span>Back to providers</span>
        </Link>
      ) : isUserDetails ? (
        <Link
          href="/users"
          className="inline-flex items-center gap-2.5 text-[#101828] font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#101828]" />
          <span>Back to users</span>
        </Link>
      ) : isAmbassadorDetails ? (
        <Link
          href="/ambassadors"
          className="inline-flex items-center gap-2.5 text-[#101828] font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#101828]" />
          <span>Back to Ambassadors</span>
        </Link>
      ) : isCampaignDetails ? (
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2.5 text-[#101828] font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#101828]" />
          <span>Back to Campaigns</span>
        </Link>
      ) : isReferralDetails ? (
        <Link
          href="/referrals"
          className="inline-flex items-center gap-2.5 text-[#101828] font-semibold text-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#101828]" />
          <span>Back to Referrals</span>
        </Link>
      ) : (
        <div />
      )}

      <div className="flex items-center">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <Image
            src="/bell.png"
            alt="Notifications"
            width={24}
            height={24}
            className="w-5.5 h-5.5 object-contain"
            priority
            unoptimized
          />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-[1.5px] bg-[#E4E7EC] mx-4" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer group select-none outline-none">
            {/* Avatar Circle */}
            <div className="flex items-center justify-center size-10 rounded-full bg-[#D92D20] text-white font-semibold text-base shadow-xs shrink-0">
              {initial}
            </div>

            {/* User Name & Role */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#101828] leading-tight max-w-[150px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-4 h-4 text-[#667085] transition-transform duration-200 group-hover:translate-y-0.5" />
              </div>
              <span className="text-[12px] font-normal text-[#667085] leading-tight mt-0.5 capitalize">
                {displayRole}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="font-normal text-xs text-gray-500">
              Signed in as
              <p className="font-semibold text-gray-900 truncate mt-0.5">
                {user?.email || displayName}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Link href="/settings" className="flex items-center gap-2 w-full px-3 py-2 cursor-pointer">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
