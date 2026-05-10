"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type QueryValue = string | number | null | undefined;

export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get single param
  const get = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  // Get all params as object
  const getAll = useCallback(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  // Update params (set / delete)
  const setParams = useCallback(
    (newParams: Record<string, QueryValue>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Remove specific param
  const remove = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Reset all params
  const reset = useCallback(() => {
    router.push("?", { scroll: false });
  }, [router]);

  return {
    get,
    getAll,
    setParams,
    remove,
    reset,
  };
}
