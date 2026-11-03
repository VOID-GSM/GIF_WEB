"use client";

import { useQuery } from "@tanstack/react-query";

import { getItems } from "./thynApi";
import { toThynItem } from "../lib/toThynItem";

export const THYN_ITEMS_QUERY_KEY = ["thyn", "items"] as const;

export function useGetThynItems() {
  return useQuery({
    queryKey: THYN_ITEMS_QUERY_KEY,
    queryFn: getItems,
    select: (items) => items.map(toThynItem),
  });
}
