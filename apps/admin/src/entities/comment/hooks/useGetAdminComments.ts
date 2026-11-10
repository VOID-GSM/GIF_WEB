"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminComments } from "../api/commentApi";
import type { GetAdminCommentsParams } from "../model/type";

export function useGetAdminComments(
  params: GetAdminCommentsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "admin-comments",
      params.projectId ?? "all",
      params.userId ?? "all",
      params.page,
      params.size,
    ],
    queryFn: () => getAdminComments(params),
    enabled,
    // 페이지를 넘길 때 이전 목록을 유지해 깜빡임을 줄인다.
    placeholderData: keepPreviousData,
  });
}
