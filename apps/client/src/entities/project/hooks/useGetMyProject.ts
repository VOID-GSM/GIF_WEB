"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProject } from "../api";

export function useGetMyProject() {
  return useQuery({
    queryKey: ["project", "me"],
    queryFn: async () => (await getMyProject()).data,
  });
}
