"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseTablePaginationOptions {
  storageKey?: string;
  defaultPage?: number;
  paramName?: string;
}

/**
 * Hook to synchronize table pagination with the browser URL and persistent sessionStorage.
 * Reads searchParams on both server and client to guarantee zero hydration mismatches.
 */
export function useTablePagination(options?: UseTablePaginationOptions) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramName = options?.paramName || "page";
  const defaultPage = options?.defaultPage || 1;
  const storageKey =
    options?.storageKey || (pathname ? `table_page_${pathname}_${paramName}` : undefined);

  // Read page from searchParams (available on both SSR server and client during hydration)
  const urlPageStr = searchParams?.get(paramName);
  const parsedUrlPage = urlPageStr ? parseInt(urlPageStr, 10) : null;
  const initialPage =
    parsedUrlPage && !isNaN(parsedUrlPage) && parsedUrlPage > 0
      ? parsedUrlPage
      : defaultPage;

  // Initialize state with initialPage (identical on both server and client initial render)
  const [currentPage, setCurrentPageInternal] = useState<number>(initialPage);

  // Sync state if searchParams changes from router navigation
  useEffect(() => {
    const raw = searchParams?.get(paramName);
    const parsed = raw ? parseInt(raw, 10) : null;
    const targetPage = parsed && !isNaN(parsed) && parsed > 0 ? parsed : defaultPage;
    setCurrentPageInternal((curr) => (curr !== targetPage ? targetPage : curr));
  }, [searchParams, paramName, defaultPage]);

  // On client mount: if URL doesn't have page param, check sessionStorage
  useEffect(() => {
    if (typeof window === "undefined" || !storageKey) return;

    try {
      const currentParams = new URLSearchParams(window.location.search);
      const pageInUrl = currentParams.get(paramName);

      if (pageInUrl) {
        // Store current page in sessionStorage
        sessionStorage.setItem(storageKey, pageInUrl);
      } else {
        // No page in URL: restore from sessionStorage if available
        const saved = sessionStorage.getItem(storageKey);
        const parsed = saved ? parseInt(saved, 10) : null;
        if (parsed && !isNaN(parsed) && parsed > 1) {
          setCurrentPageInternal(parsed);
          currentParams.set(paramName, String(parsed));
          const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
          window.history.replaceState(null, "", newUrl);
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey, paramName]);

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get(paramName);
        const parsed = raw ? parseInt(raw, 10) : null;
        const pageFromUrl =
          parsed && !isNaN(parsed) && parsed > 0 ? parsed : defaultPage;
        setCurrentPageInternal(pageFromUrl);
        if (storageKey) {
          sessionStorage.setItem(storageKey, String(pageFromUrl));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [defaultPage, paramName, storageKey]);

  // Stable setCurrentPage handler that updates state, sessionStorage, and browser URL
  const setCurrentPage = useCallback(
    (pageOrUpdater: number | ((prev: number) => number)) => {
      setCurrentPageInternal((prev) => {
        const next =
          typeof pageOrUpdater === "function" ? pageOrUpdater(prev) : pageOrUpdater;
        const validPage = Math.max(1, next);

        if (typeof window !== "undefined") {
          // 1. Update sessionStorage
          if (storageKey) {
            try {
              sessionStorage.setItem(storageKey, String(validPage));
            } catch {
              // ignore
            }
          }

          // 2. Update browser address bar using pushState
          const params = new URLSearchParams(window.location.search);
          if (validPage === defaultPage && !params.has(paramName)) {
            // Default clean URL
          } else {
            params.set(paramName, String(validPage));
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState(null, "", newUrl);
          }
        }

        return validPage;
      });
    },
    [defaultPage, paramName, storageKey]
  );

  return {
    currentPage,
    setCurrentPage,
  };
}
