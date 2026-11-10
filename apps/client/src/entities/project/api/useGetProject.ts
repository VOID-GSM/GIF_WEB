"use client";

import { useQuery } from "@tanstack/react-query";

import { projectQueryKeys } from "../model/queryKeys";
import { getProject, getPublicProject } from "./projectApi";

// 서버가 집계 필드를 빠뜨려도 화면·캐시가 깨지지 않도록 기본값을 채운다.
function withEngagementDefaults<
  T extends {
    viewCount: number;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
  },
>(project: T): T {
  return {
    ...project,
    viewCount: project.viewCount ?? 0,
    likeCount: project.likeCount ?? 0,
    commentCount: project.commentCount ?? 0,
    isLiked: project.isLiked ?? false,
  };
}

// 응답 형태가 다른 두 훅은 키를 나눈다 (detail / publicDetail).
// publicDetail 이 detail 의 하위 키라서 detail(id) prefix 로 무효화하면 둘 다 반영된다.

// 교내 사용자 전용 화면용 상세
export function useGetProject(projectId: number) {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: async () => withEngagementDefaults(await getProject(projectId)),
    enabled: Number.isFinite(projectId),
  });
}

// 공개 상세 페이지용 — 비로그인·외부 사용자의 공개 응답까지 다룬다.
export function useGetPublicProject(projectId: number) {
  return useQuery({
    queryKey: projectQueryKeys.publicDetail(projectId),
    queryFn: async () =>
      withEngagementDefaults(await getPublicProject(projectId)),
    enabled: Number.isFinite(projectId),
  });
}
