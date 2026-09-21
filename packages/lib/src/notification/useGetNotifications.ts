"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getNotifications } from "./api";
import { NOTIFICATION_RETENTION_DAYS } from "./lib";

export const NOTIFICATION_QUERY_KEY = ["notifications"];
export const NOTIFICATION_PAGE_SIZE = 15;

interface UseGetNotificationsOptions {
  days?: number;
  enabled?: boolean;
}

export function useGetNotifications({
  days = NOTIFICATION_RETENTION_DAYS,
  enabled = true,
}: UseGetNotificationsOptions = {}) {
  return useInfiniteQuery({
    // 기간이 바뀌면 다른 목록이므로 캐시를 분리한다.
    queryKey: [...NOTIFICATION_QUERY_KEY, "list", days],
    queryFn: ({ pageParam }) =>
      getNotifications({ page: pageParam, size: NOTIFICATION_PAGE_SIZE, days }),
    initialPageParam: 0,
    // Slice 응답은 전체 개수 없이 last 플래그만 주므로 그것으로 다음 페이지를 판단한다.
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    enabled,
  });
}
