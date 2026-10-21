"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useProvidersList,
  useSuspendProvider,
  useActivateProvider,
} from "@/hooks/use-providers";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { SuspendProviderModal } from "@/components/provider/suspend-provider-modal";
import { ProviderEmptyState } from "@/components/provider/empty-state";
import type { ProviderDetail, ProviderStatus, ProviderType } from "@/types/providers";

function getInitials(name: string): string {
  if (!name) return "PR";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatProviderType(type: string | undefined): string {
  if (!type) return "Provider";
  switch (type.toUpperCase()) {
    case "CLINIC":
      return "Clinic";
    case "PHARMACY":
      return "Pharmacy";
    case "HOSPITAL":
      return "Hospital";
    case "LABORATORY":
      return "Laboratory";
    case "DELIVERY_PARTNER":
      return "Delivery Partner";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
}

export const ProvidersTable: React.FC = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All types");
  const [selectedStatus, setSelectedStatus] = useState<string>("All status");

  const { currentPage, setCurrentPage } = useTablePagination();
  const pageSize = 10;

  // Search debounce with ref guard to avoid resetting page on mount
  const prevSearchRef = useRef(searchInput);
  useEffect(() => {
    if (prevSearchRef.current === searchInput) {
      return;
    }
    prevSearchRef.current = searchInput;
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, setCurrentPage]);

  // Map filters to API params
  const apiType: ProviderType | undefined =
    selectedType === "Clinic"
      ? "CLINIC"
      : selectedType === "Pharmacy"
      ? "PHARMACY"
      : selectedType === "Hospital"
      ? "HOSPITAL"
      : selectedType === "Laboratory"
      ? "LABORATORY"
      : selectedType === "Delivery Partner"
      ? "DELIVERY_PARTNER"
      : undefined;

  const apiStatus: ProviderStatus | undefined =
    selectedStatus === "Active"
      ? "ACTIVE"
      : selectedStatus === "Suspended"
      ? "SUSPENDED"
      : undefined;

  // Fetch paginated providers
  const { data, isLoading, isFetching } = useProvidersList({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    type: apiType,
    status: apiStatus,
  });

  const providers = data?.data || [];
  const meta = data?.meta || {
    page: currentPage,
    pageSize,
    total: 0,
    totalPages: 1,
  };

  // Suspend / Activate Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    provider: ProviderDetail | null;
    isSuspending: boolean;
  }>({
    isOpen: false,
    provider: null,
    isSuspending: true,
  });

  const suspendMutation = useSuspendProvider();
  const activateMutation = useActivateProvider();

  const handleOpenSuspendModal = (provider: ProviderDetail, isSuspending: boolean) => {
    setModalState({
      isOpen: true,
      provider,
      isSuspending,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!modalState.provider) return;
    const { id } = modalState.provider;
    try {
      if (modalState.isSuspending) {
        await suspendMutation.mutateAsync(id);
      } else {
        await activateMutation.mutateAsync(id);
      }
      setModalState((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Failed to update provider status:", error);
    }
  };

  const isActionLoading = suspendMutation.isPending || activateMutation.isPending;

  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedType("All types");
    setSelectedStatus("All status");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    debouncedSearch.length > 0 ||
    selectedType !== "All types" ||
    selectedStatus !== "All status";

  if (!isLoading && meta.total === 0 && !hasActiveFilters) {
    return <ProviderEmptyState dashboardHref="/" />;
  }

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5 border-b border-[#EFF1F5] pb-4">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-80 rounded-xl border border-gray-200 bg-white focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-[#8A9BA8] shrink-0" />
          <input
            type="text"
            placeholder="Search providers by name, location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent text-[14px] text-[#101828] placeholder:text-[#8A9BA8] outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-[13px] text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
              <span>
                Type:{" "}
                <strong className="text-[#101828] font-medium">
                  {selectedType}
                </strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All types", "Clinic", "Pharmacy", "Hospital", "Laboratory", "Delivery Partner"].map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setCurrentPage(1);
                  }}
                  className="cursor-pointer"
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-[13px] text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
              <span>
                Status:{" "}
                <strong className="text-[#101828] font-medium">
                  {selectedStatus}
                </strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["All status", "Active", "Suspended"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                  className="cursor-pointer"
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline font-medium px-2 py-1 cursor-pointer"
            >
              Reset
            </button>
          )}

          {isFetching && !isLoading && (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          )}
        </div>
      </div>

      {/* Data Table Card */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFC]">
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Provider
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Location
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Referrals
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Redeemed
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[14px]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gray-200" />
                        <div className="space-y-1.5">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                          <div className="h-3 w-20 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-10 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-10 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-4 w-12 bg-gray-200 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8A9BA8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-medium text-[#101828]">
                        No providers found
                      </p>
                      <p className="text-xs text-[#667085]">
                        No providers match the selected search or filter criteria.
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                providers.map((provider) => {
                  const locationDisplay =
                    provider.location ||
                    [provider.area || provider.city, provider.state]
                      .filter(Boolean)
                      .join(", ") ||
                    "-";

                  const isActive =
                    String(provider.status).toUpperCase() === "ACTIVE";

                  return (
                    <tr
                      key={provider.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Provider Column */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/provider/${provider.id}`}
                          className="flex items-center gap-3 group"
                        >
                          {provider.logoUrl ? (
                            <div className="relative size-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                              <Image
                                src={provider.logoUrl}
                                alt={provider.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                              {getInitials(provider.name)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#101828] group-hover:text-primary transition-colors">
                              {provider.name}
                            </span>
                            {provider.reference && (
                              <span className="text-[12px] text-[#667085]">
                                {provider.reference}
                              </span>
                            )}
                          </div>
                        </Link>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-6 text-[#253B4B]">
                        {formatProviderType(provider.type)}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6 text-[#253B4B]">
                        {locationDisplay}
                      </td>

                      {/* Referrals */}
                      <td className="py-4 px-6 text-[#253B4B] font-medium">
                        {(provider.quickStats?.totalReferrals ?? 0).toLocaleString()}
                      </td>

                      {/* Redeemed */}
                      <td className="py-4 px-6 text-[#253B4B] font-medium">
                        {(provider.quickStats?.redeemed ?? 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF3] text-[#027A48]">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3F2] text-[#D92D20]">
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/provider/${provider.id}`}
                            className="text-primary font-semibold hover:underline text-[13px] cursor-pointer"
                          >
                            View
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label="More options"
                              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100 outline-none flex items-center justify-center"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                onClick={() => router.push(`/provider/${provider.id}`)}
                                className="cursor-pointer"
                              >
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOpenSuspendModal(provider, isActive)}
                                className={`cursor-pointer ${
                                  isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"
                                }`}
                              >
                                {isActive ? "Suspend provider" : "Activate provider"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <span suppressHydrationWarning className="text-[13px] text-[#667085]">
            Page {meta.page} of {meta.totalPages || 1}
            {meta.total > 0 && ` (${meta.total} total providers)`}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#253B4B] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= meta.totalPages || isLoading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#253B4B] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Suspend / Activate Provider Modal */}
      <SuspendProviderModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmStatusChange}
        providerName={modalState.provider?.name || "Provider"}
        isSuspending={modalState.isSuspending}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default ProvidersTable;
