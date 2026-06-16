"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProject } from "./projectApi";

export function useGetMyProject() {
  return useQuery({
    queryKey: ["project", "me"],
    queryFn: getMyProject,
  });
}
