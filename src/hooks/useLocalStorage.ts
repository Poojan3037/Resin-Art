"use client";

import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch {
      // ignore parse errors
    }

    return initialValue;
  });

  const hydrated = typeof window !== "undefined";

  const set = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(prev)
          : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return [value, set, hydrated] as const;
}
