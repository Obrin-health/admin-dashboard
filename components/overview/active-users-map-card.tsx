"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Plus, Minus, RotateCcw, Navigation } from "lucide-react";
import { Map, Overlay } from "pigeon-maps";
import { useActiveUsers } from "@/hooks/use-overview";

const DEFAULT_CENTER: [number, number] = [8.5, 7.5];
const DEFAULT_ZOOM = 5.8;

const LOCATION_COORDINATES: Record<string, [number, number]> = {
  Lagos: [6.5244, 3.3792],
  Oyo: [7.3775, 3.947],
  FCT: [9.0765, 7.3986],
  Abuja: [9.0765, 7.3986],
  Rivers: [4.8156, 7.0498],
  Kano: [12.0022, 8.592],
};

const DEFAULT_LOCATIONS = [
  { location: "Lagos", users: 0, share: 0.6 },
  { location: "Oyo", users: 0, share: 0.2 },
  { location: "FCT", users: 0, share: 0.1 },
  { location: "Rivers", users: 0, share: 0.05 },
  { location: "Kano", users: 0, share: 0.05 },
];

/**
 * Map Tile Provider:
 * 1. If NEXT_PUBLIC_CARTO_API_KEY or NEXT_PUBLIC_MAP_API_KEY is provided in .env.local, uses Carto Voyager with key.
 * 2. Otherwise defaults to OpenStreetMap (free, zero API keys or watermarks required).
 */
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

  // Fallback: OpenStreetMap (completely free, no API key required)
  const s = ["a", "b", "c"][Math.abs(x + y) % 3];
  return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
};

export const ActiveUsersMapCard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const { data, isLoading } = useActiveUsers();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeUsersCount = data?.activeUsers ?? 0;
  const topLocations =
    data?.topLocations && data.topLocations.length > 0
      ? data.topLocations
      : DEFAULT_LOCATIONS;

  const points = useMemo(() => {
    if (!data?.points || data.points.length === 0) {
      return [{ latitude: 6.5244, longitude: 3.3792, users: activeUsersCount || 69 }];
    }
    return data.points;
  }, [data, activeUsersCount]);

  const topLocation = topLocations[0];

  const handleFlyTo = (locName: string) => {
    const coords = LOCATION_COORDINATES[locName];
    if (coords) {
      setCenter(coords);
      setZoom(10);
    }
  };

  const handleReset = () => {
    setCenter(DEFAULT_CENTER);
    setZoom(DEFAULT_ZOOM);
  };

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7 shadow-xs mb-6">
      {/* Title */}
      <div className="pb-3 border-b border-[#F2F4F7] flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-semibold text-[#101828]">Active Users</h3>
          <p className="text-[12px] text-[#667085] mt-0.5">
            Real geographic map: zoom in to explore cities, states, and active user clusters
          </p>
        </div>
      </div>

      {/* Grid: Real Map on Left, Stats on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
        {/* Real Geographic Map */}
        <div className="lg:col-span-8 relative w-full aspect-[2/1] min-h-[300px] sm:min-h-[380px] rounded-xl overflow-hidden border border-[#EAECF0] bg-[#FAFBFD]">
          {mounted ? (
            <Map
              center={center}
              zoom={zoom}
              onBoundsChanged={({ center: newCenter, zoom: newZoom }) => {
                setCenter(newCenter);
                setZoom(newZoom);
              }}
              provider={mapTileProvider}
              minZoom={3}
              maxZoom={18}
              metaWheelZoom={false}
              twoFingerDrag={false}
              mouseEvents={true}
              touchEvents={true}
              boxClassname="w-full h-full cursor-grab active:cursor-grabbing select-none"
            >
              {/* Map Hotspot Markers with Real GPS Coordinates */}
              {points.map((pt, idx) => {
                const pointId = `pt-${idx}`;
                const isHovered = hoveredPointId === pointId;
                const isMain = idx === 0 && pt.latitude === 6.5;

                return (
                  <Overlay
                    key={pointId}
                    anchor={[pt.latitude, pt.longitude]}
                    offset={[14, 14]}
                  >
                    <div
                      className="relative flex items-center justify-center cursor-pointer group"
                      onMouseEnter={() => setHoveredPointId(pointId)}
                      onMouseLeave={() => setHoveredPointId(null)}
                    >
                      {/* Pulse Wave on Hotspots */}
                      {pt.users >= 5 && (
                        <>
                          <span className="absolute size-8 rounded-full bg-[#BB1A8C]/20 border border-[#BB1A8C]/35 animate-ping opacity-70 pointer-events-none" />
                          <span className="absolute size-6 rounded-full bg-[#BB1A8C]/20 border border-[#BB1A8C]/35 pointer-events-none" />
                        </>
                      )}

                      {/* Center Beacon Pin */}
                      <span
                        className={`rounded-full bg-[#BB1A8C] border-2 border-white shadow-md z-10 transition-transform ${
                          isMain
                            ? "size-4"
                            : isHovered
                            ? "size-3.5 scale-125"
                            : pt.users >= 10
                            ? "size-3"
                            : "size-2.5 opacity-90"
                        }`}
                      />

                      {/* Tooltip & Info Card */}
                      {(isHovered || (isMain && zoom <= 7)) && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap">
                          <div className="bg-white/95 backdrop-blur-xs rounded-lg px-2.5 py-1 shadow-md border border-gray-100 flex items-center gap-1.5">
                            {isMain && (
                              <div className="w-3.5 h-2.5 rounded-2xs overflow-hidden flex shrink-0 border border-gray-200">
                                <div className="w-1/3 h-full bg-[#008751]" />
                                <div className="w-1/3 h-full bg-white" />
                                <div className="w-1/3 h-full bg-[#008751]" />
                              </div>
                            )}
                            <span className="text-[11px] font-semibold text-[#101828]">
                              {isMain
                                ? topLocation?.location || "Lagos"
                                : `Lat: ${pt.latitude}, Lon: ${pt.longitude}`}
                            </span>
                            <span className="text-[10px] text-[#BB1A8C] font-semibold bg-[#BB1A8C]/10 px-1.5 py-0.2 rounded-full">
                              {pt.users} {pt.users === 1 ? "user" : "users"}
                            </span>
                          </div>
                          <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white/95 -mt-px filter drop-shadow-xs" />
                        </div>
                      )}
                    </div>
                  </Overlay>
                );
              })}
            </Map>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-[#667085]">
              Loading map...
            </div>
          )}

          {/* Floating Map Zoom & Reset Controls */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-[#D0D5DD] rounded-lg p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(18, prev + 1))}
              className="p-1 hover:bg-gray-100 rounded text-[#344054] transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(3, prev - 1))}
              className="p-1 hover:bg-gray-100 rounded text-[#344054] transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-1.5 py-1 hover:bg-gray-100 rounded text-[#344054] text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
              title="Reset View to Nigeria"
              aria-label="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Top Locations Stats Column */}
        <div className="lg:col-span-4 lg:pl-6 lg:border-l border-[#F2F4F7] flex flex-col">
          <div>
            <span className="text-[12px] text-[#667085]">Active Users</span>
            <p className="font-general-sans text-[28px] sm:text-[32px] font-bold text-[#101828] tracking-tight mt-0.5">
              {isLoading ? "..." : activeUsersCount.toLocaleString()}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-semibold text-[#101828]">
                Top Locations
              </h4>
              <span className="text-[11px] text-[#8A9BA8]">Click to focus map</span>
            </div>

            <div className="space-y-4">
              {topLocations.map((loc) => {
                const percent = loc.share > 0 ? loc.share * 100 : 0;
                const displayPercent =
                  percent >= 1 ? `${Math.round(percent)}%` : `${percent.toFixed(1)}%`;

                return (
                  <div
                    key={loc.location}
                    onClick={() => handleFlyTo(loc.location)}
                    className="space-y-1.5 group cursor-pointer p-1.5 -mx-1.5 rounded-lg hover:bg-gray-50/80 transition-colors"
                    title={`Zoom to ${loc.location}`}
                  >
                    <div className="flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3 h-3 text-[#BB1A8C] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium text-[#101828] group-hover:text-[#BB1A8C] transition-colors">
                          {loc.location}
                        </span>
                      </div>
                      <span className="text-[#667085] font-normal group-hover:text-[#101828] transition-colors">
                        {isLoading ? "..." : `${displayPercent} (${loc.users})`}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                      <div
                        style={{ width: `${isLoading ? 0 : Math.max(percent, 2)}%` }}
                        className="h-full bg-[#BB1A8C] rounded-full transition-all duration-500 group-hover:brightness-110"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersMapCard;


