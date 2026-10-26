"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Check,
  Calendar,
  SlidersHorizontal,
  Loader2,
  AlertTriangle,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTablePagination } from "@/hooks/use-table-pagination";
import {
  useAmbassadorsList,
  useSuspendAmbassador,
  useActivateAmbassador,
  useDeactivateAmbassador,
} from "@/hooks/use-ambassadors";
import { SuspendAmbassadorModal } from "@/components/ambassadors/single/suspend-ambassador-modal";
import type {
  AmbassadorListItem,
  AmbassadorStatus,
} from "@/types/ambassadors";

export interface AmbassadorRow {
  id: string;
  name: string;
  avatarText: string;
  contactNumber: string;
  activeCampaign: string;
  type: "Physical" | "Digital";
  totalUsersIntroduced: number;
  status: "Active" | "Inactive" | "Suspended";
  photoUrl?: string | null;
}


interface ColumnConfig {
  id: keyof AmbassadorRow | "actions";
  label: string;
  visible: boolean;
}

function getInitials(name: string): string {
  if (!name) return "AM";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function mapApiToRow(item: AmbassadorListItem): AmbassadorRow {
  let displayName = "Ambassador";
  if (typeof item.fullName === "string" && item.fullName.trim()) {
    displayName = item.fullName.trim();
  } else if (typeof item.name === "string" && item.name.trim()) {
    displayName = item.name.trim();
  }

  const rawStatus = (typeof item.status === "string" ? item.status : "ACTIVE").toUpperCase();
  const status: "Active" | "Inactive" | "Suspended" =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "SUSPENDED"
      ? "Suspended"
      : "Inactive";

  const rawType = (typeof item.type === "string" ? item.type : "PHYSICAL").toUpperCase();
  const type: "Physical" | "Digital" =
    rawType === "DIGITAL" ? "Digital" : "Physical";

  let campaignName = "-";
  if (typeof item.activeCampaign === "string" && item.activeCampaign.trim()) {
    campaignName = item.activeCampaign.trim();
  } else if (typeof item.activeCampaign === "object" && item.activeCampaign !== null) {
    const c = item.activeCampaign as Record<string, unknown>;
    campaignName =
      (typeof c.name === "string" && c.name.trim()) ||
      (typeof c.title === "string" && c.title.trim()) ||
      "-";
  }

  const contactNumber =
    typeof item.phoneNumber === "string"
      ? item.phoneNumber
      : typeof item.contactNumber === "string"
      ? item.contactNumber
      : "-";

  return {
    id: typeof item.id === "string" ? item.id : String(item.id || ""),
    name: displayName,
    avatarText: getInitials(displayName),
    contactNumber,
    activeCampaign: campaignName,
    type,
    totalUsersIntroduced: typeof item.totalUsersIntroduced === "number" ? item.totalUsersIntroduced : 0,
    status,
    photoUrl: typeof item.photoUrl === "string" ? item.photoUrl : (typeof item.avatarUrl === "string" ? item.avatarUrl : null),
  };
}

export const AmbassadorsTable: React.FC<{
  ambassadors?: AmbassadorRow[];
}> = ({ ambassadors: propAmbassadors }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedCampaign, setSelectedCampaign] = useState("All campaigns");
  const [selectedSource, setSelectedSource] = useState("All source");
  const [selectedDate, setSelectedDate] = useState("May 2023 – May 2024");
  const { currentPage, setCurrentPage } = useTablePagination();

  // Suspend modal state
  const [suspendTarget, setSuspendTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Status mutations
  const suspendMutation = useSuspendAmbassador();
  const activateMutation = useActivateAmbassador();
  const deactivateMutation = useDeactivateAmbassador();

  // Search debounce
  const prevSearchRef = useRef(searchQuery);
  useEffect(() => {
    if (prevSearchRef.current === searchQuery) {
      return;
    }
    prevSearchRef.current = searchQuery;
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, setCurrentPage]);

  // Map status to API filter
  const apiStatus: AmbassadorStatus | undefined =
    selectedStatus === "Active"
      ? "ACTIVE"
      : selectedStatus === "Suspended"
      ? "SUSPENDED"
      : selectedStatus === "Inactive"
      ? "INACTIVE"
      : undefined;

  const pageSize = 10;

  // React Query fetch
  const { data: apiResponse, isLoading, isError } = useAmbassadorsList({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    status: apiStatus,
  });

  // Decide data source
  // Decide data source
  const rawApiItems = apiResponse?.items || apiResponse?.data;
  const hasApiData = Array.isArray(rawApiItems);

  const displayList: AmbassadorRow[] = hasApiData
    ? rawApiItems.map(mapApiToRow)
    : propAmbassadors || [];

  // Local filtering (applied for campaign and source filters, as well as status and search)
  const filteredAmbassadors = displayList.filter((amb) => {
    const matchesCampaign =
      selectedCampaign === "All campaigns" ||
      amb.activeCampaign.toLowerCase() === selectedCampaign.toLowerCase();

    const matchesSource =
      selectedSource === "All source" ||
      amb.type.toLowerCase() === selectedSource.toLowerCase();

    const matchesStatus =
      selectedStatus === "All status" ||
      amb.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      amb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.contactNumber.includes(searchQuery) ||
      amb.activeCampaign.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCampaign && matchesSource && matchesStatus && matchesSearch;
  });

  const hasLocalFilter =
    selectedCampaign !== "All campaigns" || selectedSource !== "All source";

  const totalCount = hasLocalFilter
    ? filteredAmbassadors.length
    : apiResponse?.meta?.total ??
      apiResponse?.total ??
      filteredAmbassadors.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedAmbassadors =
    hasApiData && !hasLocalFilter
      ? filteredAmbassadors
      : filteredAmbassadors.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "Ambassador", visible: true },
    { id: "contactNumber", label: "Contact Number", visible: true },
    { id: "activeCampaign", label: "Active Campaign", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "totalUsersIntroduced", label: "Total Users Introduced", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isVisible = (id: string) =>
    columns.find((c) => c.id === id)?.visible ?? true;

  const campaignOptions = [
    "All campaigns",
    ...Array.from(
      new Set(displayList.map((a) => a.activeCampaign).filter(Boolean))
    ),
  ];

  const handleSuspendConfirm = async () => {
    if (!suspendTarget) return;
    try {
      await suspendMutation.mutateAsync(suspendTarget.id);
    } catch {
      // handled
    } finally {
      setSuspendTarget(null);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateMutation.mutateAsync(id);
    } catch {
      // handled
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateMutation.mutateAsync(id);
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Controls */}
      <div className="space-y-3">
        {/* Table View Column Button */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[#344054] text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <SlidersHorizontal className="size-3.5 text-[#667085]" />
              <span>Table view column</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2 space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-[#8A9BA8] uppercase tracking-wider">
                Toggle Columns
              </div>
              {columns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => toggleColumn(col.id)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[13px] text-[#344054] hover:bg-gray-100 transition-colors text-left cursor-pointer"
                >
                  <span>{col.label}</span>
                  {col.visible && <Check className="size-3.5 text-[#BB1A8C]" />}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#667085]" />
            <input
              type="text"
              placeholder="Search by name, phone or campaign"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] placeholder-[#667085] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] transition-all shadow-2xs"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Show: All status */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <span className="text-[#667085]">Show:</span>
                <span className="font-medium">{selectedStatus}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {["All status", "Active", "Inactive", "Suspended"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setCurrentPage(1);
                    }}
                    className="text-[13px] cursor-pointer"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Show: All campaigns */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <span className="text-[#667085]">Show:</span>
                <span className="font-medium truncate max-w-[120px]">{selectedCampaign}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {campaignOptions.map((camp) => (
                  <DropdownMenuItem
                    key={camp}
                    onClick={() => setSelectedCampaign(camp)}
                    className="text-[13px] cursor-pointer"
                  >
                    {camp}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Show: All source */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <span className="text-[#667085]">Show:</span>
                <span className="font-medium">{selectedSource}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {["All source", "Physical", "Digital"].map((src) => (
                  <DropdownMenuItem
                    key={src}
                    onClick={() => setSelectedSource(src)}
                    className="text-[13px] cursor-pointer"
                  >
                    {src}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Picker */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                <Calendar className="size-3.5 text-[#667085] hidden sm:inline" />
                <span className="text-[#667085]">Date:</span>
                <span className="font-medium">{selectedDate}</span>
                <ChevronDown className="size-3.5 text-[#667085]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {[
                  "May 2023 – May 2024",
                  "Last 30 Days",
                  "Last 6 Months",
                  "Year to Date",
                  "All Time",
                ].map((d) => (
                  <DropdownMenuItem
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className="text-[13px] cursor-pointer"
                  >
                    {d}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-[#FAFAFC] text-[12px] font-normal text-[#667085]">
                {isVisible("name") && (
                  <th className="py-3 px-6 font-normal">Ambassador</th>
                )}
                {isVisible("contactNumber") && (
                  <th className="py-3 px-6 font-normal">Contact Number</th>
                )}
                {isVisible("activeCampaign") && (
                  <th className="py-3 px-6 font-normal">Active Campaign</th>
                )}
                {isVisible("type") && (
                  <th className="py-3 px-6 font-normal">Type</th>
                )}
                {isVisible("totalUsersIntroduced") && (
                  <th className="py-3 px-6 font-normal">Total Users Introduced</th>
                )}
                {isVisible("status") && (
                  <th className="py-3 px-6 font-normal">Status</th>
                )}
                {isVisible("actions") && (
                  <th className="py-3 px-6 font-normal text-right">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAECF0]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
                      <span className="text-[13px]">Loading ambassadors...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedAmbassadors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#667085]">
                    No ambassadors found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAmbassadors.map((amb) => (
                  <tr
                    key={amb.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    {/* Ambassador Profile */}
                    {isVisible("name") && (
                      <td className="py-4 px-6 whitespace-nowrap">
                        <Link
                          href={`/ambassadors/${amb.id}`}
                          className="flex items-center gap-3 group/link"
                        >
                          {amb.photoUrl ? (
                            <div className="relative size-10 rounded-full overflow-hidden border border-[#EAECF0] shrink-0">
                              <Image
                                src={amb.photoUrl}
                                alt={amb.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="size-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#475467] font-semibold text-[13px] border border-[#EAECF0] shrink-0">
                              {amb.avatarText}
                            </div>
                          )}
                          <span className="text-[13px] font-semibold text-[#101828] group-hover/link:text-[#BB1A8C] transition-colors">
                            {amb.name}
                          </span>
                        </Link>
                      </td>
                    )}

                    {/* Contact Number */}
                    {isVisible("contactNumber") && (
                      <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[13px]">
                        {amb.contactNumber}
                      </td>
                    )}

                    {/* Active Campaign */}
                    {isVisible("activeCampaign") && (
                      <td className="py-4 px-6 text-[#344054] whitespace-nowrap">
                        {amb.activeCampaign}
                      </td>
                    )}

                    {/* Type Badge */}
                    {isVisible("type") && (
                      <td className="py-4 px-6 whitespace-nowrap">
                        {amb.type === "Physical" ? (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#E7F8F0] text-[#0D894F]">
                            Physical
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
                            Digital
                          </span>
                        )}
                      </td>
                    )}

                    {/* Total Users Introduced */}
                    {isVisible("totalUsersIntroduced") && (
                      <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                        {amb.totalUsersIntroduced}
                      </td>
                    )}

                    {/* Status Badge */}
                    {isVisible("status") && (
                      <td className="py-4 px-6 whitespace-nowrap">
                        {amb.status === "Active" && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
                            Active
                          </span>
                        )}
                        {amb.status === "Inactive" && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF6EE] text-[#F79009]">
                            Inactive
                          </span>
                        )}
                        {amb.status === "Suspended" && (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF3F2] text-[#B42318]">
                            Suspended
                          </span>
                        )}
                      </td>
                    )}

                    {/* Actions */}
                    {isVisible("actions") && (
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-3">
                          <Link
                            href={`/ambassadors/${amb.id}`}
                            className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                          >
                            View
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-[#667085] transition-colors cursor-pointer outline-none">
                              <MoreVertical className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => router.push(`/ambassadors/${amb.id}`)}
                                className="text-[13px] cursor-pointer"
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/ambassadors/${amb.id}?tab=users`)}
                                className="text-[13px] cursor-pointer"
                              >
                                View Users Introduced
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/ambassadors/${amb.id}?tab=campaigns`)}
                                className="text-[13px] cursor-pointer"
                              >
                                View Campaigns
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* Status action items */}
                              {amb.status === "Suspended" ? (
                                <DropdownMenuItem
                                  onClick={() => handleActivate(amb.id)}
                                  className="text-[13px] text-green-600 cursor-pointer font-medium"
                                >
                                  <UserCheck className="size-4 mr-2" />
                                  <span>Activate Ambassador</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    setSuspendTarget({
                                      id: amb.id,
                                      name: amb.name,
                                    })
                                  }
                                  className="text-[13px] text-amber-600 cursor-pointer font-medium"
                                >
                                  <AlertTriangle className="size-4 mr-2" />
                                  <span>Suspend Ambassador</span>
                                </DropdownMenuItem>
                              )}

                              {amb.status !== "Inactive" && (
                                <DropdownMenuItem
                                  onClick={() => handleDeactivate(amb.id)}
                                  className="text-[13px] text-red-600 cursor-pointer font-medium"
                                >
                                  <UserX className="size-4 mr-2" />
                                  <span>Deactivate Ambassador</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="py-3.5 px-6 border-t border-[#EAECF0] flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * (hasApiData ? pageSize : 5) + 1,
              totalCount
            )}
            –
            {Math.min(
              currentPage * (hasApiData ? pageSize : 5),
              totalCount
            )}{" "}
            of {totalCount} ambassadors
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              Previous
            </button>
            <span className="text-[13px] font-medium text-[#344054] px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Suspend Confirmation Modal */}
      {suspendTarget && (
        <SuspendAmbassadorModal
          isOpen={Boolean(suspendTarget)}
          onClose={() => setSuspendTarget(null)}
          onConfirm={handleSuspendConfirm}
          ambassadorName={suspendTarget.name}
        />
      )}
    </div>
  );
};

export default AmbassadorsTable;
