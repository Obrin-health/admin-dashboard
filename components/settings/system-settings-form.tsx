"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  useSystemSettings,
  useUpdateSystemSetting,
} from "@/hooks/use-settings";
import type { SystemSettingItem } from "@/types/settings";

export default function SystemSettingsForm() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateSettingMutation = useUpdateSystemSetting();

  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const map: Record<string, unknown> = {};
      settings.forEach((s) => {
        map[s.key] = s.value;
      });
      setFormValues(map);
    }
  }, [settings]);

  const handleUpdate = async (key: string, value: unknown) => {
    setSavingKey(key);
    setErrorMessage(null);
    setNotification(null);

    try {
      await updateSettingMutation.mutateAsync({
        key,
        payload: { value },
      });
      setFormValues((prev) => ({ ...prev, [key]: value }));
      setNotification(`Setting "${key}" updated successfully!`);
      setTimeout(() => setNotification(null), 3500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || `Failed to update setting "${key}".`;
      setErrorMessage(msg);
    } finally {
      setSavingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full font-sans select-none space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-[#EAECF0] rounded-2xl p-5 bg-white shadow-2xs animate-pulse space-y-2"
          >
            <div className="h-5 w-48 bg-gray-100 rounded" />
            <div className="h-4 w-72 bg-gray-100 rounded" />
            <div className="h-10 w-32 bg-gray-100 rounded-xl mt-3" />
          </div>
        ))}
      </div>
    );
  }

  const items: SystemSettingItem[] = Array.isArray(settings) ? settings : [];

  return (
    <div className="w-full font-sans select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-[18px] sm:text-[20px] font-bold text-[#101828] leading-tight">
          System Settings
        </h2>
        <p className="text-[14px] text-[#667085] mt-1">
          Configure operational thresholds, search radiuses, and system-wide automation rules.
        </p>
      </div>

      <div className="space-y-5">
        {items.length === 0 ? (
          <div className="border border-[#EAECF0] rounded-2xl p-8 bg-white text-center text-[#667085]">
            No system settings found.
          </div>
        ) : (
          items.map((item) => {
            const currentVal = formValues[item.key] ?? item.value;
            const isSaving = savingKey === item.key;
            const isBoolean = typeof item.default === "boolean";
            const isNumber = typeof item.default === "number";

            return (
              <div
                key={item.key}
                className="border border-[#EAECF0] rounded-2xl p-5 sm:p-6 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-[#101828]">
                      {item.key}
                    </span>
                    <span className="text-[11px] text-[#667085] bg-gray-100 px-2 py-0.5 rounded-md font-mono">
                      Default: {String(item.default)}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#667085] mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isBoolean ? (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleUpdate(item.key, !currentVal)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        currentVal ? "bg-[#BB1A8C]" : "bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          currentVal ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type={isNumber ? "number" : "text"}
                        value={String(currentVal ?? "")}
                        onChange={(e) => {
                          const val = isNumber
                            ? parseFloat(e.target.value) || 0
                            : e.target.value;
                          setFormValues((prev) => ({
                            ...prev,
                            [item.key]: val,
                          }));
                        }}
                        className="w-24 sm:w-28 h-10 rounded-xl border border-[#D0D5DD] bg-white px-3 text-[14px] text-[#101828] outline-none transition-colors focus:border-[#BB1A8C]"
                      />
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          handleUpdate(item.key, formValues[item.key])
                        }
                        className="h-10 px-4 rounded-xl bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
