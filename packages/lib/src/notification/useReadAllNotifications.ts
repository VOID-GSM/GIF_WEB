"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { patchAllNotificationsRead } from "./api";
import { NOTIFICATION_RETENTION_DAYS } from "./lib";
import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";

export function useReadAllNotifications(days = NOTIFICATION_RETENTION_DAYS) {
  const queryClient = useQueryClient();
  const t = useTranslations("notification");

  return useMutation({
    // 목록과 같은 기간을 읽음 처리해야 배지에 안 읽은 알림이 남지 않는다.
    mutationFn: () => patchAllNotificationsRead({ days }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      toast.success(t("readAllSuccess"));
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      toast.error(t("readAllError"));
    },
  });
}
