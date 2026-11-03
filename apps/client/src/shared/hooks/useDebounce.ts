"use client";

import { useEffect, useState } from "react";

/** 값이 delay(ms) 동안 더 바뀌지 않을 때만 갱신되는 디바운스 값을 돌려준다. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
