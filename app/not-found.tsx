"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  FileQuestion,
  Users,
  Building2,
  Layers,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Decorative Badge & Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
          <FileQuestion className="w-12 h-12" />
        </div>
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[12px] font-semibold px-3 py-0.5 rounded-full shadow-sm">
          404 ERROR
        </span>
      </div>

      {/* Main Copy */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#253B4B] tracking-tight mt-4 mb-2">
        Page Not Found
      </h1>
      <p className="text-[#8A9BA8] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Primary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-[#253B4B] text-sm font-medium hover:bg-gray-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </Link>
      </div>

      {/* Quick Navigation Suggestions */}
      <div className="w-full max-w-md pt-8 border-t border-gray-100">
        <p className="text-xs font-semibold text-[#8A9BA8] uppercase tracking-wider mb-4">
          Quick Links
        </p>
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-[#253B4B] transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#253B4B]">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium">Overview</span>
          </Link>

          <Link
            href="/provider"
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-[#253B4B] transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#253B4B]">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium">Provider</span>
          </Link>

          <Link
            href="/users"
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-[#253B4B] transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#253B4B]">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium">Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
