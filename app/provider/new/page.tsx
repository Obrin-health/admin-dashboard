"use client";

import React, { useState } from "react";
import Image from "next/image";
import StepBasicInformation, {
  BasicInformationData,
} from "@/components/provider/step-basic-information";
import StepServicesSpecialist from "@/components/provider/step-services-specialist";
import StepLocationAvailabilities from "@/components/provider/step-location-availabilities";
import StepReviewSubmit from "@/components/provider/step-review-submit";
import ProviderSuccessModal from "@/components/provider/provider-success-modal";

const steps = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Services & Specialist" },
  { id: 3, name: "Location & Availabilities" },
  { id: 4, name: "Review & Submit" },
];

export default function OnboardProviderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Step 1 State
  const [basicInfo, setBasicInfo] = useState<BasicInformationData>({
    providerName: "XYZ Clinic",
    providerType: "Pharmacy",
    phoneNumber: "+234 08011223344",
    contactPerson: "John Doe",
    emailAddress: "emmanueladebayo2012@gmail.com",
    description:
      "Bloom Women's Health Centre is a women-focused healthcare provider offering accessible reproductive and sexual health services, consultations, testing, and family planning support.",
    website: "190 Allen Avenue, Ikeja",
    postalCode: "100988",
  });

  // Step 2 State
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "1",
    "2",
    "3",
  ]);

  const handleBasicInfoChange = (
    field: keyof BasicInformationData,
    value: string,
  ) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  return (
    <div className="w-full flex flex-col font-sans pb-12">
      {/* Page Title & Subtitle */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#101828] tracking-tight">
          Add New Provider
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Fill in the details below to onboard a new healthcare provider to the
          Obrin Health Platform
        </p>
      </div>

      {/* Main Grid: Form (Left) & Steps/Info (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-100 bg-[#FAFAFC] p-6 lg:p-8 shadow-xs">
          {currentStep === 1 && (
            <StepBasicInformation
              data={basicInfo}
              onChange={handleBasicInfoChange}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <StepServicesSpecialist
              selectedServices={selectedServices}
              onToggleService={handleToggleService}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <StepLocationAvailabilities
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <StepReviewSubmit
              basicInfo={basicInfo}
              selectedServices={selectedServices}
              onSubmit={() => setIsSuccessModalOpen(true)}
              onBack={() => setCurrentStep(3)}
            />
          )}
        </div>

        {/* Right Column: Info & Step Tracker (Sticky on scroll) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-0 self-start">
          {/* Top Info Card */}
          <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] p-5 shadow-xs">
            <div className="size-10 flex items-center justify-center p-1.5">
              <Image
                src="/image 7.png"
                alt="Provider Information"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
                unoptimized
              />
            </div>
            <h3 className="text-sm font-bold text-[#101828] mt-3 mb-1">
              Provider Information
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Fill in the details below to onboard a new healthcare provider to
              the Obrin Health Platform
            </p>
          </div>

          {/* Step Progress Tracker Card */}
          <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] p-5 shadow-xs">
            <h4 className="text-sm font-bold text-[#101828] mb-3">
              Step {currentStep} of {steps.length}
            </h4>
            <div className="space-y-2.5">
              {steps.map((step) => {
                const isActive = step.id === currentStep;

                return (
                  <div
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`rounded-xl p-3 flex items-center gap-3 transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#FDF2F8] border border-pink-100/70"
                        : "bg-white border border-gray-100 shadow-xs hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-[#667085]"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span
                      className={`text-sm ${
                        isActive
                          ? "font-semibold text-primary"
                          : "font-medium text-[#667085]"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ProviderSuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />
    </div>
  );
}
