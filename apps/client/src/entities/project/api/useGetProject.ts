"use client";

import { useQuery } from "@tanstack/react-query";

import { getProject, getPublicProject } from "./projectApi";

// 수정 후 무효화가 두 훅에 함께 반영되도록 같은 키를 쓴다.
// (응답 형태는 로그인 상태로 정해지고, 로그인 상태가 바뀌면 페이지를 새로 불러온다.)
const projectDetailQueryKey = (projectId: number) =>
  ["project", "detail", projectId] as const;

// 교내 사용자 전용 화면용 상세
export function useGetProject(projectId: number) {
  return useQuery({
    queryKey: projectDetailQueryKey(projectId),
    queryFn: () => getProject(projectId),
    enabled: Number.isFinite(projectId),
  });
}

// 공개 상세 페이지용 — 비로그인·외부 사용자의 공개 응답까지 다룬다.
export function useGetPublicProject(projectId: number) {
  return useQuery({
    queryKey: projectDetailQueryKey(projectId),
    queryFn: () => getPublicProject(projectId),
    enabled: Number.isFinite(projectId),
  });
}
