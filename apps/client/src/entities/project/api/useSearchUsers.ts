"use client";

import { useQuery } from "@tanstack/react-query";

import { searchUsers } from "./projectApi";

export function useSearchUsers(keyword: string) {
  return useQuery({
    queryKey: ["users", "search", keyword],
    queryFn: () => searchUsers(keyword),
    enabled: keyword.trim().length > 0,
  });
}