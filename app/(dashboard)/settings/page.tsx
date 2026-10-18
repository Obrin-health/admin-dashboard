"use client";

import React, { useState } from "react";
import SettingsNav, { SettingsTab } from "@/components/settings/settings-nav";
import ProfileDetailsForm from "@/components/settings/profile-details-form";
import PasswordForm from "@/components/settings/password-form";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12 font-sans select-none">
      {/* 2-column layout: Left Navigation & Right Content */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-14 pt-2">
        {/* Left Sub-nav */}
        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Right Active Tab Content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {activeTab === "profile" ? (
            <ProfileDetailsForm />
          ) : (
            <PasswordForm />
          )}
        </div>
      </div>
    </div>
  );
}
