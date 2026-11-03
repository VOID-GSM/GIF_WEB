"use client";

import { useQuery } from "@tanstack/react-query";

import { getItems } from "./thynApi";
import { toThynItem } from "../lib/toThynItem";

export const THYN_ITEMS_QUERY_KEY = ["thyn", "items"] as const;

export function useGetThynItems() {
  return useQuery({
    queryKey: THYN_ITEMS_QUERY_KEY,
    queryFn: getItems,
    // 위치 정보(THYN_ASSETS)가 없는 아이템은 띤에 그릴 수 없어 사지 못하게 목록에서 뺀다
    select: (items) => items.map(toThynItem).filter((item) => item.placement),
  });
}
