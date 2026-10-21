"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Plus, Minus, ExternalLink } from "lucide-react";
import { Map, Overlay } from "pigeon-maps";
import type { ProviderDetail } from "@/types/providers";

interface ProviderQuickStatsMapProps {
  provider?: ProviderDetail;
  isLoading?: boolean;
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  ikeja: [6.6018, 3.3515],
  lagos: [6.5244, 3.3792],
  yaba: [6.5095, 3.3711],
  surulere: [6.4969, 3.3582],
  lekki: [6.4698, 3.5852],
  ibadan: [7.3775, 3.947],
  abuja: [9.0765, 7.3986],
  kano: [12.0022, 8.592],
  "port harcourt": [4.8156, 7.0498],
};

const mapTileProvider = (x: number, y: number, z: number, dpr?: number) => {
  const apiKey =
    process.env.NEXT_PUBLIC_CARTO_API_KEY ||
    process.env.NEXT_PUBLIC_MAP_API_KEY;

  if (apiKey) {
    const s = ["a", "b", "c", "d"][Math.abs(x + y) % 4];
    return `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${
      dpr && dpr >= 2 ? "@2x" : ""
    }.png?api_key=${apiKey}`;
  }

  const s = ["a", "b", "c"][Math.abs(x + y) % 3];
  return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
};

function formatAsOfDate(dateStr?: string): string {
  if (!dateStr) return "Just now";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export const ProviderQuickStatsMap: React.FC<ProviderQuickStatsMapProps> = ({
  provider,
  isLoading,
}) => {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lat = provider?.latitude;
  const lng = provider?.longitude;
  const cityKey = (provider?.city || provider?.area || "").toLowerCase().trim();

  let center: [number, number] = [6.5244, 3.3792]; // Lagos default
  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    center = [lat, lng];
  } else if (cityKey && CITY_COORDINATES[cityKey]) {
    center = CITY_COORDINATES[cityKey];
  }

  const locationDisplay =
    provider?.location ||
    [provider?.area || provider?.city, provider?.state]
      .filter(Boolean)
      .join(", ") ||
    "Lagos, Nigeria";

  const googleMapsUrl = `https://www.google.com/maps?q=${center[0]},${center[1]}`;

  const stats = provider?.quickStats;
  const conversionRateDisplay = stats?.conversionRate != null
    ? `${(stats.conversionRate * 100).toFixed(1)}%`
    : "0%";

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white shadow-xs flex flex-col gap-4 pb-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 bg-[#EBF5FF80] p-5 rounded-t-2xl">
        <div className="size-8 flex items-center justify-center text-sky-500 shrink-0">
          <Image
            src="/provider/quick-stat.png"
            alt="Quick Stat"
            width={40}
            height={40}
          />
        </div>
        <div>
          <span className="text-[12px] font-bold text-[#0780E2] tracking-wider uppercase block leading-none font-general-sans">
            QUICK STAT
          </span>
          <span className="text-[10px] text-[#8A9BA8] block mt-1">
            {formatAsOfDate(stats?.asOf || provider?.updatedAt)}
          </span>
        </div>
      </div>

      {/* Quick Stat 2x2 Grid */}
      <div className="rounded-xl bg-white border border-gray-100 grid grid-cols-2 gap-5 shadow-xs mx-5 p-5">
        {/* Stat 1: Total Referrals */}
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center text-blue-500 shrink-0">
            <Image
              src="/provider/referrals.png"
              alt="Total Referrals"
              width={36}
              height={36}
            />
          </div>
          <div>
            <span className="text-[12px] text-[#5D6B90] block leading-tight">
              Total Referrals
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-[16px] font-semibold text-[#253B4B] font-general-sans">
                {(stats?.totalReferrals ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stat 2: Redeemed */}
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center text-sky-500 shrink-0">
            <Image
              src="/provider/calculator.png"
              alt="Redeemed"
              width={36}
              height={36}
            />
          </div>
          <div>
            <span className="text-[12px] text-[#5D6B90] block leading-tight">
              Redeemed
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-[16px] font-semibold text-[#253B4B] font-general-sans">
                {(stats?.redeemed ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stat 3: Converted */}
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Image
              src="/provider/redeemed.png"
              alt="Converted"
              width={36}
              height={36}
            />
          </div>
          <div>
            <span className="text-[12px] text-[#5D6B90] block leading-tight">
              Converted
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-[16px] font-semibold text-[#253B4B] font-general-sans">
                {(stats?.converted ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stat 4: Conversion Rate */}
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <Image
              src="/provider/rate.png"
              alt="Conversion Rate"
              width={36}
              height={36}
            />
          </div>
          <div>
            <span className="text-[12px] text-[#5D6B90] block leading-tight">
              Conversion Rate
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-[16px] font-semibold text-[#253B4B] font-general-sans">
                {conversionRateDisplay}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Real Interactive Map Card with Pigeon Maps */}
      <div className="rounded-xl border border-gray-100 overflow-hidden shadow-xs flex flex-col mx-5">
        <div className="h-44 w-full bg-[#E8EEF5] relative overflow-hidden">
          {mounted ? (
            <Map
              center={center}
              zoom={zoom}
              provider={mapTileProvider}
              animate={true}
              height={176}
            >
              <Overlay anchor={center} offset={[16, 32]}>
                <div className="relative group flex flex-col items-center cursor-pointer">
                  <div className="px-2 py-0.5 rounded-md bg-[#101828] text-white text-[10px] font-semibold whitespace-nowrap shadow-md mb-1">
                    {provider?.name || "Provider"}
                  </div>
                  <MapPin className="w-7 h-7 text-red-600 fill-red-600 drop-shadow-md" />
                </div>
              </Overlay>
            </Map>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[12px] text-[#667085]">
              Loading map...
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-2.5 right-2.5 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-xs rounded-lg border border-gray-200 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(18, z + 1))}
              className="p-1 hover:bg-gray-100 rounded text-[#344054] transition-colors cursor-pointer"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(3, z - 1))}
              className="p-1 hover:bg-gray-100 rounded text-[#344054] transition-colors cursor-pointer"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Map Card Footer */}
        <div className="p-3 px-4 flex items-center justify-between bg-white text-xs border-t border-gray-100">
          <span className="text-[#253B4B] font-medium flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary" />
            {locationDisplay}
          </span>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View on Map</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProviderQuickStatsMap;
