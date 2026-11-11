"use client";

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { patchNotificationRead } from "./api";
import type { SliceGetNotificationResponse } from "./types";
import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";

type NotificationPages = InfiniteData<SliceGetNotificationResponse, number>;

const NOTIFICATION_LIST_KEY = [...NOTIFICATION_QUERY_KEY, "list"];
const NOTIFICATION_UNREAD_COUNT_KEY = [...NOTIFICATION_QUERY_KEY, "unread-count"];

export function useReadNotification() {
  const queryClient = useQueryClient();
  const t = useTranslations("notification");

  return useMutation({
    mutationFn: patchNotificationRead,
    // 목록 전체를 다시 받으면 불러온 페이지 수만큼 요청이 생기므로
    // 캐시에서 해당 알림만 읽음으로 바꾼다.
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_LIST_KEY });

      const previous = queryClient.getQueriesData<NotificationPages>({
        queryKey: NOTIFICATION_LIST_KEY,
      });

      queryClient.setQueriesData<NotificationPages>(
        { queryKey: NOTIFICATION_LIST_KEY },
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              content: page.content.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, isRead: true }
                  : notification,
              ),
            })),
          },
      );

      return { previous };
    },
    onError: (_error, _notificationId, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(t("readError"));
    },
    // 배지 숫자는 서버 기준이어야 해서 안 읽은 개수만 다시 불러온다.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_UNREAD_COUNT_KEY });
    },
  });
}
