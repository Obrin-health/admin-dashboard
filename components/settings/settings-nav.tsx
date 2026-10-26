"use client";

import React from "react";

export type SettingsTab = "profile" | "password" | "system" | "categories";

interface SettingsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsNav({
  activeTab,
  onTabChange,
}: SettingsNavProps) {
  const profileItems: { id: SettingsTab; label: string }[] = [
    { id: "profile", label: "Profile Details" },
    { id: "password", label: "Password" },
  ];

  const systemItems: { id: SettingsTab; label: string }[] = [
    { id: "system", label: "System Settings" },
    { id: "categories", label: "Service Categories" },
  ];

  const renderNavList = (items: { id: SettingsTab; label: string }[]) => (
    <ul className="space-y-4">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center text-left text-[14px] transition-colors cursor-pointer group py-0.5 ${isActive
                  ? "text-[#BB1A8C] font-semibold"
                  : "text-[#667085] font-normal hover:text-[#101828]"
                }`}
            >
              {/* Active Indicator Bar */}
              <span
                className={`w-0.75 h-5 rounded-full mr-3.5 transition-all duration-200 ${isActive ? "bg-[#BB1A8C]" : "bg-transparent"
                  }`}
              />
              <span>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav className="w-full sm:w-56 shrink-0 font-sans select-none space-y-7">
      {/* Profile Section */}
      <div>
        <div className="mb-4">
          <span className="text-[12px] font-semibold text-[#8A9BA8] tracking-wider uppercase">
            PROFILE
          </span>
        </div>
        {renderNavList(profileItems)}
      </div>

      {/* System Section */}
      <div>
        <div className="mb-4">
          <span className="text-[12px] font-semibold text-[#8A9BA8] tracking-wider uppercase">
            SYSTEM
          </span>
        </div>
        {renderNavList(systemItems)}
      </div>
    </nav>
  );
}
