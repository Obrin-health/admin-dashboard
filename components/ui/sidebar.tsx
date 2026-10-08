"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import React from "react";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "GENERAL",
    items: [
      {
        label: "Overview",
        href: "/",
        icon: "/sidebar-icons/overview.png",
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: "/sidebar-icons/users.png",
      },
      {
        label: "Provider",
        href: "/provider",
        icon: "/sidebar-icons/hospital.png",
      },
      {
        label: "Ambassadors",
        href: "/ambassadors",
        icon: "/sidebar-icons/users.png",
      },
      {
        label: "Campaigns",
        href: "/campaigns",
        icon: "/sidebar-icons/volume-high.png",
      },
      {
        label: "Referrals",
        href: "/referrals",
        icon: "/sidebar-icons/profile-add.png",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: "/sidebar-icons/setting-2.png",
      },
      {
        label: "Team",
        href: "/team",
        icon: "/sidebar-icons/users.png",
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-65 min-w-65 h-full shrink-0 flex flex-col pr-4 select-none font-sans overflow-y-auto no-scrollbar">
      {/* Obrin Health Logo */}
      <div className="pt-5 pb-6 px-4">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="Obrin Health"
            width={140}
            height={50}
            className="w-auto h-auto max-h-11.5 object-contain"
            priority
            unoptimized
          />
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-6">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {/* Section Header */}
            <div className="flex items-center justify-between px-4 py-2 text-[12px] font-medium tracking-wider text-[#8A9BA8] uppercase">
              <span className="text-[#5D6B90]">{section.title}</span>
              <ChevronRight className="w-4 h-4 text-[#5D6B90]" fontWeight={2} />
            </div>

            {/* Section Nav Items */}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-colors duration-150 text-[14px] ${
                        isActive
                          ? "bg-primary text-white font-semibold shadow-sm"
                          : "text-[#253B4B] font-normal hover:bg-black/5"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={20}
                        height={20}
                        priority
                        unoptimized
                        className={`w-5 h-5 object-contain ${
                          isActive ? "brightness-0 invert" : ""
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
