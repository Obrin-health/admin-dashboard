"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowLeft } from "lucide-react";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();
  const isProviderDetails =
    pathname?.startsWith("/provider/") && pathname !== "/provider";

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

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group select-none">
          {/* Avatar Circle */}
          <div className="flex items-center justify-center size-10 rounded-full bg-[#D92D20] text-white font-semibold text-base shadow-xs shrink-0">
            K
          </div>

          {/* User Name & Role */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#101828] leading-tight">
                Kasongo Benawe...
              </span>
              <ChevronDown className="w-4 h-4 text-[#667085] transition-transform duration-200 group-hover:translate-y-0.5" />
            </div>
            <span className="text-[12px] font-normal text-[#667085] leading-tight mt-0.5">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
