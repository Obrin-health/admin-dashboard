import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/types/auth";
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  // Restrict unauthorized access: redirect to login if no auth token cookie exists
  if (!token) {
    redirect("/login");
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
