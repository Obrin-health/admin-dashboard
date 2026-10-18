"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";

interface ActionItem {
  title: string;
  href: string;
  icon: string;
}

const actionItems: ActionItem[] = [
  {
    title: "Add a Provider",
    href: "/provider/new",
    icon: "/overview/add-provider.png",
  },
  {
    title: "Add an Ambassador",
    href: "/ambassadors",
    icon: "/overview/add-ambassador.png",
  },
  {
    title: "Create Campaigns",
    href: "/campaigns",
    icon: "/overview/create-campaigns.png",
  },
  {
    title: "Manage Admin Users",
    href: "/settings",
    icon: "/overview/manage-admin-users.png",
  },
];

export const QuickActionsCard: React.FC = () => {
  const { data: user } = useCurrentUser();
  const greetingName =
    user?.firstName ||
    (user?.fullName ? user.fullName.split(" ")[0] : null) ||
    "Admin";

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-[#FAFAFC] p-5 sm:p-6 mb-6 transition-all">
      <div className="mb-4">
        <h2 className="text-[17px] sm:text-[18px] font-semibold text-[#101828] flex items-center gap-1.5">
          <span>Welcome {greetingName}!</span>
          <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </h2>
        <p className="text-[13px] text-[#667085] mt-0.5">
          Monitor the overall performance of Obrin Health
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actionItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group flex items-center justify-between p-3.5 bg-white border border-[#EAECF0] rounded-xl hover:border-[#BB1A8C]/50 hover:shadow-xs transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-8 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gray-50">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <span className="text-[13px] font-medium text-[#101828] truncate group-hover:text-[#BB1A8C] transition-colors">
                {item.title}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#98A2B3] shrink-0 group-hover:text-[#BB1A8C] group-hover:translate-x-0.5 transition-all duration-200" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
