"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchAllNotificationsRead } from "./api";
import { NOTIFICATION_RETENTION_DAYS } from "./lib";
import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";

export function useReadAllNotifications(days = NOTIFICATION_RETENTION_DAYS) {
  const queryClient = useQueryClient();

  return useMutation({
    // 목록과 같은 기간을 읽음 처리해야 배지에 안 읽은 알림이 남지 않는다.
    mutationFn: () => patchAllNotificationsRead({ days }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      toast.success("모든 알림을 읽음 처리했어요.");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      toast.error("알림을 읽음 처리하지 못했어요. 다시 시도해주세요.");
    },
  });
}
