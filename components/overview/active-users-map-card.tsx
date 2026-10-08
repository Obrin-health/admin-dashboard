"use client";

import React, { useState } from "react";
import Image from "next/image";

interface LocationStat {
  city: string;
  percentage: number;
}

const topLocations: LocationStat[] = [
  { city: "Lagos", percentage: 50 },
  { city: "Oyo", percentage: 30 },
  { city: "Kwara", percentage: 20 },
  { city: "Abuja", percentage: 10 },
  { city: "Kano", percentage: 10 },
];

interface MapHotspot {
  id: string;
  name: string;
  left: string; // percentage
  top: string; // percentage
  isMain?: boolean;
}

const mapHotspots: MapHotspot[] = [
  { id: "lagos", name: "Lagos Nigeria", left: "51.3%", top: "56.3%", isMain: true },
  { id: "accra", name: "Accra, Ghana", left: "49.6%", top: "56.3%" },
  { id: "nairobi", name: "Nairobi, Kenya", left: "60.9%", top: "60.6%" },
  { id: "sa", name: "Johannesburg, SA", left: "58.0%", top: "76.5%" },
  { id: "london", name: "London, UK", left: "49.6%", top: "24.5%" },
  { id: "dubai", name: "Dubai, UAE", left: "66.4%", top: "44.7%" },
  { id: "jakarta", name: "Jakarta, Indonesia", left: "81.9%", top: "63.5%" },
  { id: "sydney", name: "Sydney, Australia", left: "93.4%", top: "81.8%" },
  { id: "melbourne", name: "Melbourne, Australia", left: "91.8%", top: "84.7%" },
  { id: "brazil", name: "Sao Paulo, Brazil", left: "35.7%", top: "75.0%" },
];

export const ActiveUsersMapCard: React.FC = () => {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7 shadow-xs mb-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#F2F4F7]">
        <h3 className="text-[17px] font-semibold text-[#101828]">Active Users</h3>
      </div>

      {/* Grid: Map on Left, Stats on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
        {/* Map Visualization */}
        <div className="lg:col-span-8 relative w-full aspect-[2/1] min-h-[260px] sm:min-h-[320px] flex items-center justify-center p-2">
          {/* Base Dotted Map SVG */}
          <div className="relative w-full h-full">
            <Image
              src="/world-map-dots.svg"
              alt="Active Users World Map"
              fill
              className="object-contain opacity-90 select-none pointer-events-none"
              priority
              unoptimized
            />

            {/* Hotspots */}
            {mapHotspots.map((spot) => {
              const isMain = spot.isMain;
              const isHovered = hoveredHotspot === spot.id;

              return (
                <div
                  key={spot.id}
                  style={{ left: spot.left, top: spot.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  onMouseEnter={() => setHoveredHotspot(spot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  {/* Concentric Pulsing Ripples */}
                  <div className="relative flex items-center justify-center">
                    <span className="absolute size-9 rounded-full bg-[#BB1A8C]/15 border border-[#BB1A8C]/25 animate-ping opacity-60" />
                    <span className="absolute size-6 rounded-full bg-[#BB1A8C]/20 border border-[#BB1A8C]/35" />
                    <span className="size-2 rounded-full bg-[#BB1A8C] shadow-sm z-10" />
                  </div>

                  {/* Lagos Nigeria Main Tooltip Callout */}
                  {isMain && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center pointer-events-none z-20">
                      <div className="bg-white rounded-lg px-2.5 py-1 shadow-md border border-gray-100 flex items-center gap-1.5 whitespace-nowrap">
                        {/* Nigeria Flag */}
                        <div className="w-3.5 h-2.5 rounded-2xs overflow-hidden flex shrink-0 border border-gray-200">
                          <div className="w-1/3 h-full bg-[#008751]" />
                          <div className="w-1/3 h-full bg-white" />
                          <div className="w-1/3 h-full bg-[#008751]" />
                        </div>
                        <span className="text-[11px] font-semibold text-[#101828]">
                          Lagos Nigeria
                        </span>
                      </div>
                      <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white -mt-px filter drop-shadow-xs" />
                    </div>
                  )}

                  {/* Tooltip for other hotspots on hover */}
                  {!isMain && isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#101828] text-white text-[10px] font-medium rounded shadow-md whitespace-nowrap pointer-events-none z-20">
                      {spot.name}
                      <div className="w-0 h-0 border-x-3 border-x-transparent border-t-3 border-t-[#101828] absolute top-full left-1/2 -translate-x-1/2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Locations Stats Column */}
        <div className="lg:col-span-4 lg:pl-6 lg:border-l border-[#F2F4F7] flex flex-col">
          <div>
            <span className="text-[12px] text-[#667085]">Active Users</span>
            <p className="font-general-sans text-[28px] sm:text-[32px] font-bold text-[#101828] tracking-tight mt-0.5">
              15.3k
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-[13px] font-semibold text-[#101828] mb-3">
              Top Locations
            </h4>

            <div className="space-y-4">
              {topLocations.map((loc) => (
                <div key={loc.city} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-[#101828] group-hover:text-[#BB1A8C] transition-colors">
                      {loc.city}
                    </span>
                    <span className="text-[#667085] font-normal">
                      {loc.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${loc.percentage}%` }}
                      className="h-full bg-[#BB1A8C] rounded-full transition-all duration-500 group-hover:brightness-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersMapCard;
