"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/reset-password";

  if (isAuthPage) {
    return (
      <main className="w-full h-screen overflow-y-auto bg-[#F9FAFB] font-sans">
        {children}
      </main>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex p-5 bg-background font-sans">
      <Sidebar />
      <div className="bg-white rounded-[40px] flex-1 min-w-0 h-full flex flex-col p-6 overflow-hidden">
        <Navbar />
        <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
