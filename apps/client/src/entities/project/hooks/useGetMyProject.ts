"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProject } from "../api";

// 내 프로젝트는 재학생 전용 API — 비로그인·외부 사용자 화면에서는 enabled=false 로 끈다.
export function useGetMyProject({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["project", "me"],
    queryFn: async () => (await getMyProject()).data,
    enabled,
  });
}
