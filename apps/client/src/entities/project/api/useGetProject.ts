"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { DEFAULT_LOCALE, isLocale } from "@repo/i18n";

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
// 현재 언어로 요청해 일본어 화면에서는 AI 번역된 소개를 받는다.
export function useGetPublicProject(projectId: number) {
  const locale = useLocale();
  const lang = isLocale(locale) ? locale : DEFAULT_LOCALE;

  return useQuery({
    queryKey: projectQueryKeys.publicDetail(projectId, lang),
    queryFn: async () =>
      withEngagementDefaults<ProjectDetailResponse>(
        await getPublicProject(projectId, lang),
        DETAIL_ENGAGEMENT_KEYS,
      ),
    enabled: Number.isFinite(projectId),
  });
}
