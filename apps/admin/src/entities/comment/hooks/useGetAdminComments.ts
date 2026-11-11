"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminComments } from "../api/commentApi";
import { commentQueryKeys } from "../model/queryKeys";
import type { GetAdminCommentsParams } from "../model/type";

export function useGetAdminComments(
  params: GetAdminCommentsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: commentQueryKeys.list(params),
    queryFn: () => getAdminComments(params),
    enabled,
    // 페이지를 넘길 때 이전 목록을 유지해 깜빡임을 줄인다.
    placeholderData: keepPreviousData,
  });
}
