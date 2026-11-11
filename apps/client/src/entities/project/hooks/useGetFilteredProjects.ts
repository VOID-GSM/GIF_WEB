"use client";

import { useQuery } from "@tanstack/react-query";

import { getFilteredProjects } from "../api";
import {
  LIST_ENGAGEMENT_KEYS,
  withEngagementDefaults,
} from "../model/engagement";
import { projectQueryKeys } from "../model/queryKeys";
import type { FilteredProject, GradeFilterValue } from "../model/types";

export function useGetFilteredProjects(
  grade: GradeFilterValue,
  enabled = true,
) {
  return useQuery({
    queryKey: projectQueryKeys.filter(grade),
    // 서버가 참여 지표를 빠뜨려도 카드·좋아요 캐시가 깨지지 않도록 정규화한다.
    queryFn: async () =>
      (await getFilteredProjects(grade)).data.map((project) =>
        withEngagementDefaults<FilteredProject>(project, LIST_ENGAGEMENT_KEYS),
      ),
    enabled,
  });
}