"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import {
  useServiceCategories,
  useCreateServiceCategory,
  useUpdateServiceCategory,
} from "@/hooks/use-settings";
import type { ServiceCategoryItem } from "@/types/settings";

export default function ServiceCategoriesTab() {
  const { data: categories, isLoading } = useServiceCategories();
  const createMutation = useCreateServiceCategory();
  const updateMutation = useUpdateServiceCategory();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug.trim() || !newName.trim()) return;

    try {
      await createMutation.mutateAsync({
        slug: newSlug.trim().toLowerCase().replace(/\s+/g, "-"),
        name: newName.trim(),
        description: newDesc.trim() || undefined,
      });
      setIsAddModalOpen(false);
      setNewSlug("");
      setNewName("");
      setNewDesc("");
      setNotification("Service category created successfully!");
      setTimeout(() => setNotification(null), 3500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create category.";
      setErrorMessage(msg);
    }
  };

  const handleToggleActive = async (category: ServiceCategoryItem) => {
    try {
      await updateMutation.mutateAsync({
        id: category.id,
        payload: {
          isActive: !category.isActive,
        },
      });
      setNotification(`Category "${category.name}" updated!`);
      setTimeout(() => setNotification(null), 3500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update category status.";
      setErrorMessage(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full font-sans select-none space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-[#EAECF0] rounded-2xl p-4 bg-white shadow-2xs animate-pulse flex items-center justify-between"
          >
            <div className="space-y-1.5">
              <div className="h-4 w-40 bg-gray-100 rounded" />
              <div className="h-3 w-28 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-11 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const items: ServiceCategoryItem[] = Array.isArray(categories)
    ? categories
    : [];

  return (
    <div className="w-full font-sans select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#101828] leading-tight">
            Service Categories
          </h2>
          <p className="text-[14px] text-[#667085] mt-1">
            Manage provider medical specialties and clinical service categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="border border-[#EAECF0] rounded-2xl p-8 bg-white text-center text-[#667085]">
            No service categories found.
          </div>
        ) : (
          items.map((cat) => (
            <div
              key={cat.id}
              className="border border-[#EAECF0] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-[15px] text-[#101828]">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#667085] bg-gray-100 px-2 py-0.5 rounded">
                    {cat.slug}
                  </span>
                  {typeof cat._count?.providers === "number" && (
                    <span className="text-[11px] text-[#BB1A8C] bg-[#FCE7F6] px-2 py-0.5 rounded-full font-medium">
                      {cat._count.providers} provider{cat._count.providers === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
                {cat.description && (
                  <p className="text-[13px] text-[#667085] mt-1">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[12px] text-[#667085]">
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() => handleToggleActive(cat)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    cat.isActive ? "bg-[#BB1A8C]" : "bg-gray-200"
                  } disabled:opacity-50`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      cat.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => !createMutation.isPending && setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-3xl p-7 shadow-2xl z-10 transition-all select-none">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-[18px] font-bold text-[#101828]">
                  Add Service Category
                </h3>
                <p className="text-[13px] text-[#667085] mt-0.5">
                  Enter category name and slug
                </p>
              </div>
              <button
                type="button"
                disabled={createMutation.isPending}
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-[#667085] hover:text-[#101828] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dental Care"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newSlug || newSlug === newName.toLowerCase().replace(/\s+/g, "-")) {
                      setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. dental-care"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#D0D5DD] bg-white px-3.5 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C]"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description of this category..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-xl border border-[#D0D5DD] bg-white p-3 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C] resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 py-3 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    "Create category"
                  )}
                </button>
                <button
                  type="button"
                  disabled={createMutation.isPending}
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#D0D5DD] bg-white hover:bg-gray-50 text-[#344054] text-[14px] font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
