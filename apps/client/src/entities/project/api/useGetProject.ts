"use client";

import { useQuery } from "@tanstack/react-query";

import {
  DETAIL_ENGAGEMENT_KEYS,
  withEngagementDefaults,
} from "../model/engagement";
import { projectQueryKeys } from "../model/queryKeys";
import type { ProjectDetail, ProjectDetailResponse } from "../model/types";
import { getProject, getPublicProject } from "./projectApi";

// 응답 형태가 다른 두 훅은 키를 나눈다 (detail / publicDetail).
// publicDetail 이 detail 의 하위 키라서 detail(id) prefix 로 무효화하면 둘 다 반영된다.
// 서버가 참여 지표를 빠뜨려도 화면·캐시가 깨지지 않도록 queryFn 에서 정규화한다.

// 교내 사용자 전용 화면용 상세
export function useGetProject(projectId: number) {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId),
    queryFn: async () =>
      withEngagementDefaults<ProjectDetail>(
        await getProject(projectId),
        DETAIL_ENGAGEMENT_KEYS,
      ),
    enabled: Number.isFinite(projectId),
  });
}

// 공개 상세 페이지용 — 비로그인·외부 사용자의 공개 응답까지 다룬다.
export function useGetPublicProject(projectId: number) {
  return useQuery({
    queryKey: projectQueryKeys.publicDetail(projectId),
    queryFn: async () =>
      withEngagementDefaults<ProjectDetailResponse>(
        await getPublicProject(projectId),
        DETAIL_ENGAGEMENT_KEYS,
      ),
    enabled: Number.isFinite(projectId),
  });
}
