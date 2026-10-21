"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Building2, MapPin, Plus, Minus, ExternalLink } from "lucide-react";
import { Map, Overlay } from "pigeon-maps";
import type { UserDetail } from "@/types/users";

interface UserQuickStatsMapProps {
  user?: UserDetail;
  isLoading?: boolean;
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  ikeja: [6.6018, 3.3515],
  lagos: [6.5244, 3.3792],
  ibadan: [7.3775, 3.947],
  oyo: [7.843, 3.9368],
  abuja: [9.0765, 7.3986],
  fct: [9.0765, 7.3986],
  kano: [12.0022, 8.592],
  rivers: [4.8156, 7.0498],
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

export const UserQuickStatsMap: React.FC<UserQuickStatsMapProps> = ({
  user,
  isLoading,
}) => {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lat = user?.location?.latitude;
  const lng = user?.location?.longitude;
  const city = user?.location?.city?.toLowerCase() || "";

  let center: [number, number] = [6.5244, 3.3792]; // Lagos default
  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    center = [lat, lng];
  } else if (city && CITY_COORDINATES[city]) {
    center = CITY_COORDINATES[city];
  }

  const locationDisplay = user?.location?.city
    ? `${user.location.city}${user.location.state ? `, ${user.location.state}` : ""}`
    : user?.location?.state || "Lagos, Nigeria";

  const googleMapsUrl = `https://www.google.com/maps?q=${center[0]},${center[1]}`;

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Quick Statistics Header */}
      <div className="flex items-center gap-2.5">
        <div className="size-7 flex items-center justify-center shrink-0">
          <Image
            src="/provider/quick-stat.png"
            alt="Quick Statistics"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[12px] font-bold text-[#0780E2] tracking-wider uppercase font-general-sans">
          QUICK STATISTICS
        </span>
      </div>

      {/* 2x2 Quick Statistics Grid */}
      <div className="rounded-xl bg-[#FAFAFC] border border-[#EAECF0] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stat 1: Clinic Searches */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 border border-teal-100">
            <Building2 className="size-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Clinic Searches
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
                {(user?.stats?.clinicSearches ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stat 2: Total Referrals Generated */}
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center shrink-0">
            <Image
              src="/provider/referrals.png"
              alt="Total Referrals Generated"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Total Referrals Generated
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
                {(user?.stats?.generatedCodes ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stat 3: Total Redeemed */}
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center shrink-0">
            <Image
              src="/provider/redeemed.png"
              alt="Total Redeemed"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Total Redeemed
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
                {(user?.stats?.redeemedCodes ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stat 4: Conversion Rate */}
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center shrink-0">
            <Image
              src="/provider/rate.png"
              alt="Conversion Rate"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] text-[#667085] block leading-tight">
              Conversion Rate
            </span>
            {isLoading ? (
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="font-general-sans text-[17px] font-bold text-[#101828] block mt-0.5">
                {Math.round((user?.stats?.conversionRate ?? 0) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Real Interactive Map Card with Pigeon Maps */}
      <div className="rounded-xl border border-[#EAECF0] overflow-hidden bg-white shadow-2xs">
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
                    {user?.location?.city || "User Location"}
                  </div>
                  <MapPin className="w-7 h-7 text-[#BB1A8C] fill-[#BB1A8C] drop-shadow-md" />
                </div>
              </Overlay>
            </Map>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[12px] text-[#667085]">
              Loading map...
            </div>
          )}

          {/* Zoom controls overlay */}
          <div className="absolute bottom-2.5 right-2.5 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-xs rounded-lg border border-[#EAECF0] p-0.5 shadow-xs">
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
        <div className="p-3 px-4 flex items-center justify-between bg-white text-xs border-t border-[#EAECF0]">
          <span className="text-[#344054] font-medium flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[#BB1A8C]" />
            {locationDisplay}
          </span>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#BB1A8C] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View on Map</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserQuickStatsMap;
