"use client";

import { useQuery } from "@tanstack/react-query";

import { getNotificationUnreadCount } from "./api";
import { NOTIFICATION_RETENTION_DAYS } from "./lib";
import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";

// 헤더 배지는 패널을 열지 않아도 최신값이어야 해서 주기적으로 갱신한다.
const UNREAD_COUNT_REFETCH_INTERVAL = 1000 * 60;

interface UseGetNotificationUnreadCountOptions {
  days?: number;
  enabled?: boolean;
}

export function useGetNotificationUnreadCount({
  days = NOTIFICATION_RETENTION_DAYS,
  enabled = true,
}: UseGetNotificationUnreadCountOptions = {}) {
  return useQuery({
    // 목록과 같은 days 를 써야 배지 숫자와 목록의 안 읽은 알림 수가 일치한다.
    queryKey: [...NOTIFICATION_QUERY_KEY, "unread-count", days],
    queryFn: () => getNotificationUnreadCount({ days }),
    refetchInterval: UNREAD_COUNT_REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    enabled,
  });
}
