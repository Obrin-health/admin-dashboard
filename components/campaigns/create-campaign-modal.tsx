"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Loader2,
  AlertCircle,
  Upload,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAmbassadorsList } from "@/hooks/use-ambassadors";
import {
  useCreateCampaign,
  useUploadCampaignImage,
} from "@/hooks/use-campaigns";
import type { CreateCampaignDto } from "@/types/campaigns";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: "form" | "success";
  onSuccess?: () => void;
}

interface SelectedAmbassador {
  id: string;
  name: string;
  initial: string;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  initialStep = "form",
  onSuccess,
}) => {
  const [step, setStep] = useState<"form" | "success">(initialStep);
  const [name, setName] = useState("");
  const [campaignType, setCampaignType] = useState<"PHYSICAL" | "DIGITAL">("PHYSICAL");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAmbassadors, setSelectedAmbassadors] = useState<SelectedAmbassador[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch real ambassadors for the picker
  const { data: ambassadorsData, isLoading: isAmbassadorsLoading } =
    useAmbassadorsList({ pageSize: 100 });
  const realAmbassadors = ambassadorsData?.items || ambassadorsData?.data || [];

  const createMutation = useCreateCampaign();
  const uploadMutation = useUploadCampaignImage();

  const resetForm = () => {
    setName("");
    setCampaignType("PHYSICAL");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setSelectedAmbassadors([]);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setStep("form");
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const handleFinish = () => {
    if (onSuccess) onSuccess();
    handleModalClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const removeAmbassador = (id: string) => {
    setSelectedAmbassadors((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Campaign name is required.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Both start and end dates are required.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before or equal to end date.");
      return;
    }

    if (selectedAmbassadors.length === 0) {
      setError("Please assign at least one ambassador to this campaign.");
      return;
    }

    try {
      let uploadedUrl: string | undefined = undefined;
      if (imageFile) {
        uploadedUrl = await uploadMutation.mutateAsync(imageFile);
      }

      const payload: CreateCampaignDto = {
        name: name.trim(),
        type: campaignType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        ambassadorIds: selectedAmbassadors.map((a) => a.id),
        description: description.trim() || undefined,
        imageUrl: uploadedUrl,
      };

      await createMutation.mutateAsync(payload);
      setStep("success");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(
        axiosErr.response?.data?.message ||
        "Failed to create campaign. Please try again."
      );
    }
  };

  const isSubmitting = createMutation.isPending || uploadMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && handleModalClose()}>
      {step === "form" ? (
        <DialogContent className="max-w-[560px] p-6 md:p-7 rounded-2xl bg-white shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
          {/* Header */}
          <DialogHeader className="flex flex-row items-start justify-between pb-4 border-b border-[#EAECF0] shrink-0">
            <div>
              <DialogTitle className="text-[18px] font-bold text-[#101828]">
                Create Campaign
              </DialogTitle>
              <p className="text-[13px] text-[#667085] mt-0.5">
                Set up a new campaign and assign it to an ambassador.
              </p>
            </div>
          </DialogHeader>

          {/* Error Alert */}
          {error && (
            <div className="mt-3 p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Body - Scrollable */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto pr-1 space-y-6 pt-4 text-[13px]"
          >
            {/* 1. CAMPAIGN INFORMATION */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold tracking-wider text-[#667085] uppercase">
                CAMPAIGN INFORMATION
              </h4>

              {/* Campaign Name */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Enter campaign name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-3.5 pr-20 py-2.5 rounded-lg border border-[#D0D5DD] text-[13px] text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] transition-colors"
                  />
                  <span className="absolute right-3.5 text-[12px] text-[#98A2B3] pointer-events-none">
                    {name.length} / 100
                  </span>
                </div>
              </div>

              {/* Campaign Type */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Campaign Type <span className="text-red-500">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] hover:bg-gray-50 focus:outline-none focus:border-[#BB1A8C] transition-colors cursor-pointer text-left">
                    <span>
                      {campaignType === "PHYSICAL" ? "Physical" : "Digital"}
                    </span>
                    <ChevronDown className="size-4 text-[#667085]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[500px]">
                    <DropdownMenuItem
                      onClick={() => setCampaignType("PHYSICAL")}
                      className="text-[13px] cursor-pointer"
                    >
                      Physical
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCampaignType("DIGITAL")}
                      className="text-[13px] cursor-pointer"
                    >
                      Digital
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Campaign Image Upload */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Campaign Banner / Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative size-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                      <Image
                        src={imagePreview}
                        alt="Campaign preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
                    <Upload className="size-4 text-[#667085]" />
                    <span>{imageFile ? "Change Image" : "Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imageFile && (
                    <span className="text-xs text-[#667085] truncate max-w-[200px]">
                      {imageFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Description Text Area */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Description
                </label>
                <div className="rounded-lg border border-[#D0D5DD] focus-within:border-[#BB1A8C] focus-within:ring-1 focus-within:ring-[#BB1A8C] transition-colors overflow-hidden bg-white">
                  <textarea
                    rows={4}
                    placeholder="Enter campaign description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3.5 text-[13px] text-[#101828] placeholder-[#98A2B3] resize-none focus:outline-none border-none"
                  />
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-[#EAECF0] bg-[#FAFAFC] text-[#667085]">
                    <button
                      type="button"
                      className="p-1 hover:text-[#101828] hover:bg-gray-200/50 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:text-[#101828] hover:bg-gray-200/50 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:text-[#101828] hover:bg-gray-200/50 rounded transition-colors"
                      title="Underline"
                    >
                      <Underline className="size-3.5" />
                    </button>
                    <span className="h-3.5 w-px bg-[#EAECF0]" />
                    <button
                      type="button"
                      className="p-1 hover:text-[#101828] hover:bg-gray-200/50 rounded transition-colors"
                      title="Bullet list"
                    >
                      <List className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:text-[#101828] hover:bg-gray-200/50 rounded transition-colors"
                      title="Numbered list"
                    >
                      <ListOrdered className="size-3.5" />
                    </button>
                    <span className="h-3.5 w-px bg-[#EAECF0]" />
                    <button
                      type="button"
                      className="p-1 hover:text-[#101828] hover:bg-gray-200/50 rounded transition-colors"
                      title="Insert link"
                    >
                      <Link2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CAMPAIGN SCHEDULE */}
            <div className="space-y-4 pt-2">
              <h4 className="text-[11px] font-bold tracking-wider text-[#667085] uppercase">
                CAMPAIGN SCHEDULE
              </h4>

              {/* Two dates grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[13px] text-[#101828] focus:outline-none focus:border-[#BB1A8C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] text-[13px] text-[#101828] focus:outline-none focus:border-[#BB1A8C]"
                    />
                  </div>
                </div>
              </div>

              {/* Ambassadors Select & Tags */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Assign Ambassadors <span className="text-red-500">*</span>
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] hover:bg-gray-50 focus:outline-none focus:border-[#BB1A8C] transition-colors cursor-pointer text-left">
                    <span>
                      {selectedAmbassadors.length === 0
                        ? "Select ambassadors..."
                        : `${selectedAmbassadors.length} Ambassador${selectedAmbassadors.length > 1 ? "s" : ""
                        } selected`}
                    </span>
                    <ChevronDown className="size-4 text-[#667085]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[500px] max-h-60 overflow-y-auto">
                    {isAmbassadorsLoading ? (
                      <div className="py-4 text-center text-xs text-[#667085]">
                        <Loader2 className="size-4 animate-spin inline-block mr-2" />
                        Loading ambassadors...
                      </div>
                    ) : realAmbassadors.length === 0 ? (
                      <div className="py-4 text-center text-xs text-[#667085]">
                        No ambassadors found.
                      </div>
                    ) : (
                      realAmbassadors.map((amb) => {
                        const ambName = amb.fullName || amb.name || "Ambassador";
                        const isSelected = selectedAmbassadors.some(
                          (a) => a.id === amb.id
                        );
                        return (
                          <DropdownMenuItem
                            key={amb.id}
                            disabled={isSelected}
                            onClick={() => {
                              if (isSelected) return;
                              setSelectedAmbassadors((prev) => [
                                ...prev,
                                {
                                  id: amb.id,
                                  name: ambName,
                                  initial: ambName[0]?.toUpperCase() || "A",
                                },
                              ]);
                            }}
                            className={`text-[13px] cursor-pointer flex items-center justify-between ${isSelected ? "opacity-50" : ""
                              }`}
                          >
                            <span>{ambName}</span>
                            {isSelected && (
                              <span className="text-xs text-[#BB1A8C]">Added</span>
                            )}
                          </DropdownMenuItem>
                        );
                      })
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selected Ambassador Dark Pills */}
                {selectedAmbassadors.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {selectedAmbassadors.map((amb) => (
                      <div
                        key={amb.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D2939] text-white text-[12px] shadow-xs"
                      >
                        <span className="size-4 rounded-full bg-white text-[#1D2939] text-[10px] font-bold flex items-center justify-center">
                          {amb.initial}
                        </span>
                        <span>{amb.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAmbassador(amb.id)}
                          className="text-gray-400 hover:text-white transition-colors cursor-pointer ml-1"
                          title="Remove"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#EAECF0]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-8 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                <span>{isSubmitting ? "Creating..." : "Continue"}</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleModalClose}
                className="py-2.5 px-6 rounded-xl border border-[#D0D5DD] bg-white text-[#BB1A8C] hover:bg-gray-50 text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Go back
              </button>
            </div>
          </form>
        </DialogContent>
      ) : (
        /* SUCCESS STEP */
        <DialogContent className="max-w-[420px] p-8 rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col items-center text-center">
          {/* Close button top right */}
          <button
            type="button"
            onClick={handleFinish}
            className="absolute right-5 top-5 p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>

          {/* Large Magenta Checkmark Icon */}
          <div className="relative my-4 flex items-center justify-center">
            <svg
              width="88"
              height="88"
              viewBox="0 0 88 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#BB1A8C]"
            >
              <path
                d="M 64 32 A 32 32 0 1 1 48 12"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 28 44 L 42 58 L 68 22"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-[20px] font-bold text-[#101828] mt-2 mb-1">
            Campaign Created
          </h3>
          <p className="text-[14px] text-[#667085] max-w-[280px] leading-relaxed mb-6">
            You have successfully created a new campaign
          </p>

          {/* Continue button */}
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-3 px-6 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[14px] font-semibold transition-colors shadow-xs cursor-pointer"
          >
            Continue
          </button>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CreateCampaignModal;
