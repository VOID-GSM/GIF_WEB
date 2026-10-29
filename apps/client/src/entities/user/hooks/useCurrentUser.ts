"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/userApi";

export const CURRENT_USER_QUERY_KEY = ["users", "me"] as const;

export function useGetCurrentUser() {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });
}
