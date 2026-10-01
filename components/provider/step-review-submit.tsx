"use client";

import React from "react";
import { BasicInformationData } from "./step-basic-information";

interface StepReviewSubmitProps {
  basicInfo: BasicInformationData;
  selectedServices: string[];
  onSubmit: () => void;
  onBack: () => void;
}

const mockScheduleSummary = [
  { day: "Monday:", time: "8:00AM - 9:00PM" },
  { day: "Tuesday:", time: "8:00AM - 9:00PM" },
  { day: "Wednesday:", time: "8:00AM - 9:00PM" },
  { day: "Thursday:", time: "8:00AM - 9:00PM" },
  { day: "Friday:", time: "8:00AM - 9:00PM" },
  { day: "Saturday:", time: "8:00AM - 9:00PM" },
  { day: "Sunday:", time: "CLOSED" },
];

const mockServicesSummary = [
  "General Consultation",
  "Woman Health",
  "Family Planning",
  "Family Planning",
  "Family Planning",
  "Family Planning",
  "Family Planning",
  "Family Planning",
];

export const StepReviewSubmit: React.FC<StepReviewSubmitProps> = ({
  basicInfo,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Section Heading inside Card */}
        <h2 className="text-base font-semibold text-[#101828]">
          Provider Summary
        </h2>

        {/* 1. Header Profile Block */}
        <div className="flex items-start gap-4 pb-2">
          {/* Avatar */}
          <div className="relative size-14 rounded-full bg-blue-50 border-2 border-white shadow-xs overflow-hidden shrink-0 flex items-center justify-center text-blue-600 font-bold">
            <svg
              className="w-full h-full text-blue-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#101828]">
              {basicInfo.providerName || "XYZ Clinic"}
            </h3>
            <p className="text-xs text-[#8A9BA8] font-medium mt-0.5">
              Provider ID: HFHG8794
            </p>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mt-2.5 max-w-2xl">
              {basicInfo.description ||
                "Bloom Women's Health Centre is a women-focused healthcare provider offering accessible reproductive and sexual health services, consultations, testing, and family planning support."}
            </p>
          </div>
        </div>

        {/* 2. Key-Value Information Box */}
        <div className="border border-gray-100 rounded-xl p-5 sm:p-6 space-y-3.5 text-sm">
          <div className="grid grid-cols-12 items-center">
            <span className="col-span-5 text-[#667085] font-normal">
              User ID :
            </span>
            <span className="col-span-7 text-[#101828] font-semibold">
              1204GHV HUIHHKJKN MK
            </span>
          </div>

          <div className="grid grid-cols-12 items-center">
            <span className="col-span-5 text-[#667085] font-normal">
              Email Address
            </span>
            <span className="col-span-7 text-[#101828] font-semibold">
              {basicInfo.emailAddress || "emmanueladebayo2012@gmail.com"}
            </span>
          </div>

          <div className="grid grid-cols-12 items-center">
            <span className="col-span-5 text-[#667085] font-normal">
              Provider type:
            </span>
            <span className="col-span-7 text-[#101828] font-semibold">
              {basicInfo.providerType || "Pharmacy"}
            </span>
          </div>

          <div className="grid grid-cols-12 items-center">
            <span className="col-span-5 text-[#667085] font-normal">
              Address:
            </span>
            <span className="col-span-7 text-[#101828] font-semibold">
              {basicInfo.website || "190 Allen Avenue, Ikeja"}
            </span>
          </div>

          <div className="grid grid-cols-12 items-center">
            <span className="col-span-5 text-[#667085] font-normal">City</span>
            <span className="col-span-7 text-[#101828] font-semibold">
              Ikeja
            </span>
          </div>

          <div className="grid grid-cols-12 items-center">
            <span className="col-span-5 text-[#667085] font-normal">State</span>
            <span className="col-span-7 text-[#101828] font-semibold">
              Lagos
            </span>
          </div>
        </div>

        {/* 3. Services & Availability Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Services Box */}
          <div className="border border-gray-100 rounded-xl p-5 space-y-3.5">
            <h4 className="text-sm font-bold text-[#101828]">Services</h4>
            <div className="grid grid-cols-2 gap-2">
              {mockServicesSummary.map((service, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-[#FDF2F8] text-primary border border-pink-100 text-center truncate"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Box */}
          <div className="border border-gray-100 rounded-xl p-5 space-y-3.5">
            <h4 className="text-sm font-bold text-[#101828]">Availability</h4>
            <div className="space-y-1.5 text-xs">
              {mockScheduleSummary.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between py-0.5"
                >
                  <span className="text-[#667085]">{item.day}</span>
                  <span className="font-semibold text-[#101828]">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons (Extreme Right Aligned) */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-full text-sm font-semibold text-[#344054] hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-8 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          Submit Provider
        </button>
      </div>
    </div>
  );
};

export default StepReviewSubmit;
