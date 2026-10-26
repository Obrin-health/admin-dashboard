"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SettingsNav, { SettingsTab } from "@/components/settings/settings-nav";
import ProfileDetailsForm from "@/components/settings/profile-details-form";
import PasswordForm from "@/components/settings/password-form";
import SystemSettingsForm from "@/components/settings/system-settings-form";
import ServiceCategoriesTab from "@/components/settings/service-categories-tab";

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as SettingsTab | null;

  const validTabs: SettingsTab[] = [
    "profile",
    "password",
    "system",
    "categories",
  ];
  const initialTab: SettingsTab =
    tabParam && validTabs.includes(tabParam) ? tabParam : "profile";

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "profile") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tab);
      }
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12 font-sans select-none">
      {/* 2-column layout: Left Navigation & Right Content */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-14 pt-2">
        {/* Left Sub-nav */}
        <SettingsNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Right Active Tab Content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {activeTab === "profile" && <ProfileDetailsForm />}
          {activeTab === "password" && <PasswordForm />}
          {activeTab === "system" && <SystemSettingsForm />}
          {activeTab === "categories" && <ServiceCategoriesTab />}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BB1A8C]" />
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
