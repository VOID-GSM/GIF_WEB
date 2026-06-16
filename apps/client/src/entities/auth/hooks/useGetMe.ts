"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api";

export function useGetMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getMe().then((res) => res.data),
  });
}