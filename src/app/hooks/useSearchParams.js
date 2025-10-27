"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useSearchParamsManager() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback(
    (updates) => {
      const currentParams = new URLSearchParams(searchParams);

      // Atualiza os parâmetros fornecidos
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });

      // Atualiza a URL e recarrega a página
      window.history.pushState({}, "", `?${currentParams.toString()}`);
      window.location.reload();
    },
    [searchParams]
  );

  const getSearchParam = useCallback(
    (key) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getAllSearchParams = useCallback(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    updateSearchParams,
    getSearchParam,
    getAllSearchParams,
  };
}
