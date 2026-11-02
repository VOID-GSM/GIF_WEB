"use client";

import { useEffect } from "react";

import { postPushSubscription } from "./api";
import {
  isPushSupported,
  PUSH_SYNC_FLAG_KEY,
  registerPushServiceWorker,
  toCreatePushSubscriptionRequest,
} from "./lib";
import { subscribeOnDevice } from "./subscribeOnDevice";

// 이미 알림을 허용한 기기는 서버 구독 정보가 유실됐을 수 있어 탭마다 한 번 다시 등록한다.
// 알림 패널을 열지 않아도 푸시를 받아야 하므로 레이아웃(Navbar)에서 한 번만 호출한다.
export function useSyncPushSubscription() {
  useEffect(() => {
    if (!isPushSupported() || Notification.permission !== "granted") return;
    if (sessionStorage.getItem(PUSH_SYNC_FLAG_KEY)) return;

    const syncSubscription = async () => {
      try {
        const registration = await registerPushServiceWorker();
        // 사용자가 직접 끈 기기는 다시 켜지 않는다.
        if (!(await registration.pushManager.getSubscription())) return;

        // 서버 VAPID 키가 바뀌었으면 subscribeOnDevice 가 새로 구독한 값을 돌려준다.
        const subscription = await subscribeOnDevice();
        await postPushSubscription(toCreatePushSubscriptionRequest(subscription));
        sessionStorage.setItem(PUSH_SYNC_FLAG_KEY, "true");
      } catch {
        // 동기화 실패는 조용히 넘기고 다음 탭에서 다시 시도한다.
      }
    };

    syncSubscription();
  }, []);
}
