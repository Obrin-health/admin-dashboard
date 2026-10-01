"use client";

import React from "react";
import { Check } from "lucide-react";

const availableServices = [
  { id: "1", label: "General Consultation" },
  { id: "2", label: "Women Health" },
  { id: "3", label: "Family Planning" },
  { id: "4", label: "General Consultation" },
  { id: "5", label: "Women Health" },
  { id: "6", label: "Family Planning" },
  { id: "7", label: "General Consultation" },
  { id: "8", label: "Women Health" },
  { id: "9", label: "Family Planning" },
];

interface StepServicesSpecialistProps {
  selectedServices: string[];
  onToggleService: (serviceId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepServicesSpecialist: React.FC<StepServicesSpecialistProps> = ({
  selectedServices,
  onToggleService,
  onNext,
  onBack,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100/80 p-6 shadow-xs space-y-6">
      <h2 className="text-base font-semibold text-[#101828]">
        Services & Specialist
      </h2>

      {/* 3x3 Selectable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {availableServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);

          return (
            <div
              key={service.id}
              onClick={() => onToggleService(service.id)}
              className={`rounded-xl border p-4 flex items-center gap-3.5 cursor-pointer transition-all duration-150 select-none ${
                isSelected
                  ? "border-primary/50 bg-[#FDF2F8]/30 shadow-xs"
                  : "border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50"
              }`}
            >
              {/* Custom Rounded Checkbox */}
              <div
                className={`size-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                  isSelected
                    ? "bg-primary border border-primary text-white"
                    : "border border-gray-300 bg-white"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Service Label */}
              <span className="text-[14px] font-medium text-[#101828]">
                {service.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Buttons (Extreme Right Aligned) */}
      <div className="flex items-center justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-[#344054] hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
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

export default StepServicesSpecialist;
