"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { NOTIFICATION_QUERY_KEY } from "./useGetNotifications";

// 서비스 워커(public/sw.js)가 푸시를 받으면 보내는 메시지 타입.
export const NOTIFICATION_RECEIVED_MESSAGE = "NOTIFICATION_RECEIVED";

// 앱을 보고 있을 때 푸시가 오면 배지·목록을 주기 갱신(60초)까지 기다리지 않고 바로 다시 불러온다.
// 메시지 리스너가 중복되지 않도록 레이아웃(Navbar)에서 한 번만 호출한다.
export function useNotificationPushListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== NOTIFICATION_RECEIVED_MESSAGE) return;
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [queryClient]);
}
