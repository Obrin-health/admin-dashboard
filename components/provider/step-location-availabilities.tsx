"use client";

import React, { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface DaySchedule {
  day: string;
  start: string;
  end: string;
  enabled: boolean;
}

const defaultSchedule: DaySchedule[] = [
  { day: "Monday", start: "8:00 AM", end: "5:00 PM", enabled: true },
  { day: "Tuesday", start: "8:00 AM", end: "5:00 PM", enabled: true },
  { day: "Wednesday", start: "8:00 AM", end: "5:00 PM", enabled: true },
  { day: "Thursday", start: "8:00 AM", end: "5:00 PM", enabled: true },
  { day: "Friday", start: "8:00 AM", end: "5:00 PM", enabled: true },
  { day: "Saturday", start: "8:00 AM", end: "5:00 PM", enabled: true },
  { day: "Sunday", start: "8:00 AM", end: "5:00 PM", enabled: true },
];

const timeOptions = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

const stateOptions = ["Lagos", "Abuja", "Ogun", "Rivers", "Oyo", "Kano"];
const cityOptions = ["Ikeja", "Yaba", "Lekki", "Surulere", "Victoria Island"];

interface StepLocationAvailabilitiesProps {
  onNext: () => void;
  onBack: () => void;
}

export const StepLocationAvailabilities: React.FC<
  StepLocationAvailabilitiesProps
> = ({ onNext, onBack }) => {
  const [address, setAddress] = useState("");
  const [state, setState] = useState("Lagos");
  const [city, setCity] = useState("Ikeja");
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  const updateTime = (index: number, field: "start" | "end", value: string) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Location & Availability Card */}
      <div className="bg-white rounded-xl border border-gray-100/80 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-semibold text-[#101828]">
          Location & Availability
        </h2>

        {/* Row 1: Address & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
              Address
            </label>
            <Input
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
              State
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex h-11 items-center justify-between rounded-xl border border-gray-200 px-4 text-sm text-left bg-white outline-none focus:border-primary transition-colors cursor-pointer">
                <span className="text-[#101828]">{state}</span>
                <ChevronDown className="w-4 h-4 text-[#8A9BA8]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                {stateOptions.map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setState(s)}>
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Row 2: City & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
              City
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex h-11 items-center justify-between rounded-xl border border-gray-200 px-4 text-sm text-left bg-white outline-none focus:border-primary transition-colors cursor-pointer">
                <span className="text-[#101828]">{city}</span>
                <ChevronDown className="w-4 h-4 text-[#8A9BA8]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                {cityOptions.map((c) => (
                  <DropdownMenuItem key={c} onClick={() => setCity(c)}>
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#7D89B0] mb-2">
              Country
            </label>
            <div className="flex h-11 items-center rounded-xl border border-gray-200 overflow-hidden bg-white">
              <div className="flex items-center gap-1.5 px-3 h-full border-r border-gray-200 bg-gray-50/50 text-sm cursor-pointer select-none">
                <span className="text-base leading-none">🇳🇬</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A9BA8]" />
              </div>
              <span className="px-4 text-sm text-[#101828] font-normal">
                Nigeria
              </span>
            </div>
          </div>
        </div>

        {/* Map Preview Graphic */}
        <div className="rounded-xl border border-gray-100 overflow-hidden h-44 w-full relative bg-[#E8EEF5] flex items-center justify-center select-none shadow-xs mt-3">
          <svg
            className="absolute inset-0 w-full h-full opacity-70"
            viewBox="0 0 600 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Green / Park areas */}
            <path d="M480 0 H600 V100 H520 Z" fill="#D1E7DD" opacity="0.8" />
            {/* Roads */}
            <path
              d="M-40 60 Q 200 90 640 40"
              stroke="#FFFFFF"
              strokeWidth="12"
            />
            <path
              d="M-40 140 Q 300 120 640 160"
              stroke="#FFFFFF"
              strokeWidth="9"
            />
            <path
              d="M120 -20 Q 180 100 240 220"
              stroke="#FFFFFF"
              strokeWidth="10"
            />
            <path
              d="M380 -20 Q 400 100 460 220"
              stroke="#FFE28C"
              strokeWidth="7"
            />
            <path d="M40 220 L 560 -20" stroke="#FFE28C" strokeWidth="8" />
            <text
              x="60"
              y="65"
              fill="#101828"
              fontSize="32"
              fontWeight="bold"
              letterSpacing="0.5"
            >
              Agege
            </text>
            <text
              x="250"
              y="70"
              fill="#667085"
              fontSize="12"
              fontWeight="600"
              letterSpacing="1"
            >
              AGEGE
            </text>
            <text
              x="420"
              y="160"
              fill="#667085"
              fontSize="12"
              fontWeight="600"
              letterSpacing="1"
            >
              OJOTA
            </text>
            <text
              x="310"
              y="190"
              fill="#667085"
              fontSize="11"
              fontWeight="600"
              letterSpacing="1"
            >
              IKEJA GRA
            </text>
            <text
              x="60"
              y="180"
              fill="#667085"
              fontSize="12"
              fontWeight="600"
              letterSpacing="1"
            >
              DIMU
            </text>
          </svg>

          {/* Central Location Pin & Label */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="relative -mt-4">
              <MapPin className="w-8 h-8 text-red-600 fill-red-600 drop-shadow-md" />
            </div>
            <span className="text-2xl font-bold text-[#101828] drop-shadow-xs">
              Ikeja
            </span>
          </div>
        </div>
      </div>

      {/* 2. Opening Hours Card */}
      <div className="bg-white rounded-xl border border-gray-100/80 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-semibold text-[#101828]">
          Opening Hours
        </h2>

        <div className="space-y-3.5">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 py-1 flex-wrap sm:flex-nowrap"
            >
              {/* Day Label */}
              <span className="w-24 text-[14px] font-medium text-[#101828] shrink-0">
                {item.day}
              </span>

              {/* Time Pickers */}
              <div className="flex items-center gap-2.5 flex-1 max-w-sm">
                {/* Start Time */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={!item.enabled}
                    className="w-32 flex h-10 items-center justify-between rounded-xl border border-gray-200 px-3 text-xs bg-white outline-none focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="text-[#101828]">{item.start}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8A9BA8]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-56 overflow-y-auto"
                  >
                    {timeOptions.map((t) => (
                      <DropdownMenuItem
                        key={t}
                        onClick={() => updateTime(idx, "start", t)}
                      >
                        {t}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dash */}
                <span className="text-gray-400 font-medium">—</span>

                {/* End Time */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={!item.enabled}
                    className="w-32 flex h-10 items-center justify-between rounded-xl border border-gray-200 px-3 text-xs bg-white outline-none focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="text-[#101828]">{item.end}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8A9BA8]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-56 overflow-y-auto"
                  >
                    {timeOptions.map((t) => (
                      <DropdownMenuItem
                        key={t}
                        onClick={() => updateTime(idx, "end", t)}
                      >
                        {t}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Toggle Switch */}
              <div className="shrink-0">
                <Switch
                  checked={item.enabled}
                  onCheckedChange={() => toggleDay(idx)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons (Extreme Right Aligned) */}
      <div className="flex items-center justify-end gap-4 pt-4">
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

export default StepLocationAvailabilities;
