"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface BasicInformationData {
  providerName: string;
  providerType: string;
  phoneNumber: string;
  contactPerson: string;
  emailAddress: string;
  description: string;
  website: string;
  postalCode: string;
}

interface StepBasicInformationProps {
  data: BasicInformationData;
  onChange: (field: keyof BasicInformationData, value: string) => void;
  onNext: () => void;
  onCancel?: () => void;
}

export const StepBasicInformation: React.FC<StepBasicInformationProps> = ({
  data,
  onChange,
  onNext,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100/80 p-6 shadow-xs space-y-6">
      <h2 className="text-base font-semibold text-[#101828]">
        Basic Information
      </h2>

      {/* Row 1: Provider Name & Provider Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
            Provider name
          </label>
          <Input
            type="text"
            placeholder="ABC Pharmacy"
            value={data.providerName}
            onChange={(e) => onChange("providerName", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
            Provider Type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex h-11 items-center justify-between rounded-xl border border-gray-200 px-4 text-sm text-left bg-white outline-none focus:border-primary transition-colors cursor-pointer">
              <span
                className={
                  data.providerType ? "text-[#101828]" : "text-[#98A2B3]"
                }
              >
                {data.providerType || "Select option"}
              </span>
              <ChevronDown className="w-4 h-4 text-[#8A9BA8]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[var(--radix-dropdown-menu-trigger-width,180px)]"
            >
              <DropdownMenuItem
                onClick={() => onChange("providerType", "Pharmacy")}
              >
                Pharmacy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChange("providerType", "Clinic")}
              >
                Clinic
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 2: Phone Number & Contact Person */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
            Phone Number
          </label>
          <div className="flex h-11 items-center rounded-xl border border-gray-200 overflow-hidden focus-within:border-primary transition-colors bg-white">
            <div className="flex items-center gap-1.5 px-3 h-full border-r border-gray-200 bg-gray-50/50 text-sm cursor-pointer select-none">
              <span className="text-base leading-none">🇳🇬</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A9BA8]" />
            </div>
            <Input
              type="tel"
              placeholder="+234 08011223344"
              value={data.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              className="border-0 rounded-none h-full shadow-none focus-visible:border-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
            Contact Person
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            value={data.contactPerson}
            onChange={(e) => onChange("contactPerson", e.target.value)}
          />
        </div>
      </div>

      {/* Row 3: Email Address */}
      <div>
        <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
          Email Address
        </label>
        <Input
          type="email"
          placeholder="Enter email address"
          value={data.emailAddress}
          onChange={(e) => onChange("emailAddress", e.target.value)}
        />
      </div>

      {/* Row 4: Provider Description */}
      <div>
        <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
          Provider Description
        </label>
        <Textarea
          placeholder="Briefly describe the provider, their mission"
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      {/* Row 5: Website & Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
            Website
          </label>
          <Input
            type="text"
            placeholder="Enter website e.g google.com"
            value={data.website}
            onChange={(e) => onChange("website", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
            Postal code
          </label>
          <Input
            type="text"
            placeholder="100988"
            value={data.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Action Buttons (Extreme Right Aligned) */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/provider"
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-[#344054] hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepBasicInformation;
