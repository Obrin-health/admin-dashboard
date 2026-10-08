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
} from "lucide-react";
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

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: "form" | "success";
  onSuccess?: (campaignData: {
    name: string;
    type: "Physical" | "Digital";
    startDate: string;
    endDate: string;
  }) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  initialStep = "form",
  onSuccess,
}) => {
  const [step, setStep] = useState<"form" | "success">(initialStep);
  const [name, setName] = useState("Lagos Women's Health Outreach Campaign");
  const [campaignType, setCampaignType] = useState<string>("Physical");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("11-10-2024");
  const [endDate, setEndDate] = useState("11-10-2024");

  const [ambassadors, setAmbassadors] = useState([
    { id: "1", name: "Peter Johnson", initial: "P" },
    { id: "2", name: "Peter Johnson", initial: "P" },
    { id: "3", name: "Peter Johnson", initial: "P" },
  ]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  const handleFinish = () => {
    if (onSuccess) {
      onSuccess({
        name: name || "New Campaign",
        type: (campaignType as "Physical" | "Digital") || "Physical",
        startDate,
        endDate,
      });
    }
    setStep("form");
    onClose();
  };

  const handleModalClose = () => {
    setStep("form");
    onClose();
  };

  const removeAmbassador = (id: string) => {
    setAmbassadors((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
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
            <button
              type="button"
              onClick={handleModalClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </DialogHeader>

          {/* Form Body - Scrollable */}
          <form onSubmit={handleContinue} className="flex-1 overflow-y-auto pr-1 space-y-6 pt-4 text-[13px]">
            {/* 1. CAMPAIGN INFORMATION */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold tracking-wider text-[#667085] uppercase">
                CAMPAIGN INFORMATION
              </h4>

              {/* Campaign Name */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Campaign Name
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
                  Campaign Type
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] hover:bg-gray-50 focus:outline-none focus:border-[#BB1A8C] transition-colors cursor-pointer text-left">
                    <span className={campaignType ? "text-[#101828]" : "text-[#98A2B3]"}>
                      {campaignType || "Select type"}
                    </span>
                    <ChevronDown className="size-4 text-[#667085]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[500px]">
                    {["Physical", "Digital"].map((t) => (
                      <DropdownMenuItem
                        key={t}
                        onClick={() => setCampaignType(t)}
                        className="text-[13px] cursor-pointer"
                      >
                        {t}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description Rich Text Area */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Description
                </label>
                <div className="rounded-lg border border-[#D0D5DD] focus-within:border-[#BB1A8C] focus-within:ring-1 focus-within:ring-[#BB1A8C] transition-colors overflow-hidden bg-white">
                  <textarea
                    rows={4}
                    placeholder="Enter description"
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
                    Start Date
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-[#D0D5DD] text-[13px] text-[#101828] focus:outline-none focus:border-[#BB1A8C]"
                    />
                    <Calendar className="absolute right-3.5 size-4 text-[#667085] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                    End Date
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg border border-[#D0D5DD] text-[13px] text-[#101828] focus:outline-none focus:border-[#BB1A8C]"
                    />
                    <Calendar className="absolute right-3.5 size-4 text-[#667085] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ambassadors Select & Tags */}
              <div>
                <label className="block text-[13px] font-medium text-[#344054] mb-1.5">
                  Ambassadors
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] hover:bg-gray-50 focus:outline-none focus:border-[#BB1A8C] transition-colors cursor-pointer text-left">
                    <span>{ambassadors.length} Ambassadors added</span>
                    <ChevronDown className="size-4 text-[#667085]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[500px]">
                    {[
                      "Peter Johnson",
                      "James Werinipre",
                      "Boluwatife Olusola",
                      "Kanyisola Adepeju",
                    ].map((name) => (
                      <DropdownMenuItem
                        key={name}
                        onClick={() => {
                          if (ambassadors.some((a) => a.name === name)) return;
                          setAmbassadors((prev) => [
                            ...prev,
                            { id: String(Date.now()), name, initial: name[0] },
                          ]);
                        }}
                        className="text-[13px] cursor-pointer"
                      >
                        + Add {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selected Ambassador Dark Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {ambassadors.map((amb) => (
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
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#EAECF0]">
              <button
                type="submit"
                className="py-2.5 px-8 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="py-2.5 px-6 rounded-xl border border-[#D0D5DD] bg-white text-[#BB1A8C] hover:bg-gray-50 text-[13px] font-medium transition-colors cursor-pointer"
              >
                Go back
              </button>
            </div>
          </form>
        </DialogContent>
      ) : (
        /* SUCCESS STEP (Image 2) */
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
