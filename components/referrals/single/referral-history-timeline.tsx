"use client";

import React from "react";
import type { ReferralTimelineEvent } from "@/types/referrals";

export const ReferralHistoryTimeline: React.FC<{
  events?: ReferralTimelineEvent[];
}> = ({ events = [] }) => {
  return (
    <div className="w-full pt-8">
      {/* Uppercase Header */}
      <h4 className="text-[11px] font-bold tracking-wider text-[#0086C9] uppercase mb-6">
        HISTORY
      </h4>

      {/* Vertical Timeline */}
      {events.length === 0 ? (
        <p className="text-xs text-[#667085]">
          No referral history recorded yet.
        </p>
      ) : (
        <div className="relative pl-1">
          {events.map((item, index) => {
            const isLast = index === events.length - 1;
            return (
              <div
                key={item.id || String(index)}
                className="relative flex items-start gap-4 pb-8 group"
              >
                {/* Connecting vertical line */}
                {!isLast && (
                  <span
                    className="absolute left-[9px] top-[18px] bottom-0 w-[1.5px] bg-[#EAECF0]"
                    aria-hidden="true"
                  />
                )}

                {/* Node Marker */}
                <div className="relative z-10 flex items-center justify-center size-5 rounded-full border-2 border-[#BB1A8C] bg-white shrink-0 mt-0.5">
                  <div className="size-2 rounded-full bg-[#BB1A8C]" />
                </div>

                {/* Event Content */}
                <div className="flex flex-col">
                  <h5 className="text-[13px] md:text-[14px] font-normal text-[#344054] leading-tight">
                    {item.title}
                  </h5>
                  <span className="text-[12px] text-[#98A2B3] mt-1 leading-tight">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReferralHistoryTimeline;
