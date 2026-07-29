"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotices } from "../api";

export const NOTICE_QUERY_KEY = ["notice"];

export function useGetNotices() {
  return useQuery({
    queryKey: NOTICE_QUERY_KEY,
    queryFn: getNotices,
  });
}
