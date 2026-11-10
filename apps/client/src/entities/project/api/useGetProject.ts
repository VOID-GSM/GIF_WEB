"use client";

import { useQuery } from "@tanstack/react-query";

import { projectQueryKeys } from "../model/queryKeys";
import { getProject, getPublicProject } from "./projectApi";

// 응답 형태가 다른 두 훅은 키를 나눈다 (detail / publicDetail).
// publicDetail 이 detail 의 하위 키라서 detail(id) prefix 로 무효화하면 둘 다 반영된다.

// 교내 사용자 전용 화면용 상세
export function useGetProject(projectId: number) {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: () => getProject(projectId),
    enabled: Number.isFinite(projectId),
  });
}

// 공개 상세 페이지용 — 비로그인·외부 사용자의 공개 응답까지 다룬다.
export function useGetPublicProject(projectId: number) {
  return useQuery({
    queryKey: projectQueryKeys.publicDetail(projectId),
    queryFn: () => getPublicProject(projectId),
    enabled: Number.isFinite(projectId),
  });
}
