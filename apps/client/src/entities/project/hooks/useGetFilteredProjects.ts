"use client";

import { useQuery } from "@tanstack/react-query";

import { getFilteredProjects } from "../api";
import { projectQueryKeys } from "../model/queryKeys";
import type { Grade } from "../model/types";

export function useGetFilteredProjects(grade: Grade, enabled = true) {
  return useQuery({
    queryKey: projectQueryKeys.filter(grade),
    // 서버가 집계 필드를 빠뜨려도 카드·좋아요 캐시가 깨지지 않도록 기본값을 채운다.
    queryFn: async () =>
      (await getFilteredProjects(grade)).data.map((project) => ({
        ...project,
        likeCount: project.likeCount ?? 0,
        commentCount: project.commentCount ?? 0,
        isLiked: project.isLiked ?? false,
      })),
    enabled,
  });
}
