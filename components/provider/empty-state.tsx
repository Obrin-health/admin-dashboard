import Link from "next/link";
import React from "react";

interface ProviderEmptyStateProps {
  dashboardHref?: string;
  onActionClick?: () => void;
}

export const ProviderEmptyState: React.FC<ProviderEmptyStateProps> = ({
  dashboardHref = "/",
  onActionClick,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#FAFAFC] min-h-115 flex flex-col items-center justify-center text-center p-8">
      {/* Info Icon */}
      <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-gray-200/70 flex items-center justify-center mb-3.5">
        <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-serif font-bold">
          i
        </div>
      </div>

      {/* Text */}
      <h3 className="text-[15px] font-semibold text-[#101828] mb-1">
        No onboarded provider yet
      </h3>
      <p className="text-[13px] text-[#667085] leading-relaxed max-w-sm mb-6">
        Once a provider have been onboarded,
        <br />
        it will be displayed here.
      </p>

      {/* Go to Dashboard CTA */}
      {onActionClick ? (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center justify-center px-5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-primary font-medium text-[13px] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
        >
          Go to dashboard
        </button>
      ) : (
        <Link
          href={dashboardHref}
          className="inline-flex items-center justify-center px-5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-primary font-medium text-[13px] shadow-xs active:scale-[0.98] transition-all"
        >
          Go to dashboard
        </Link>
      )}
    </div>
  );
};

export default ProviderEmptyState;
