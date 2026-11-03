"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { deletePushSubscription, postPushSubscription } from "./api";
import {
  clearPushSyncFlag,
  isPushSupported,
  PUSH_SYNC_FLAG_KEY,
  registerPushServiceWorker,
  toCreatePushSubscriptionRequest,
} from "./lib";
import { subscribeOnDevice } from "./subscribeOnDevice";

// 알림 패널의 '기기 알림 받기/끄기' 버튼 상태와 동작.
// 서버와의 재동기화는 패널과 무관하게 useSyncPushSubscription 이 맡는다.
export function usePushSubscription() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const checkSubscription = async () => {
      if (!isPushSupported()) {
        setIsChecking(false);
        return;
      }

      setIsSupported(true);
      setPermission(Notification.permission);

      if (Notification.permission !== "granted") {
        setIsChecking(false);
        return;
      }

      try {
        const registration = await registerPushServiceWorker();
        const subscription = await registration.pushManager.getSubscription();
        if (!isActive) return;

        setIsSubscribed(Boolean(subscription));
      } catch {
        // 상태 확인 실패는 조용히 넘기고 사용자가 직접 다시 켤 수 있게 둔다.
      } finally {
        if (isActive) setIsChecking(false);
      }
    };

    checkSubscription();

    return () => {
      isActive = false;
    };
  }, []);

  const { mutateAsync: enableMutate, isPending: isEnabling } = useMutation({
    mutationFn: async () => {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        throw new Error("permission-not-granted");
      }

      const subscription = await subscribeOnDevice();
      await postPushSubscription(toCreatePushSubscriptionRequest(subscription));
      sessionStorage.setItem(PUSH_SYNC_FLAG_KEY, "true");
    },
    onSuccess: () => {
      setIsSubscribed(true);
      toast.success("이 기기에서 알림을 받습니다.");
    },
    onError: (error: Error) => {
      if (error.message === "permission-not-granted") {
        toast.error("브라우저에서 알림 권한을 허용해주세요.");
        return;
      }
      toast.error("기기 알림을 켜지 못했습니다. 다시 시도해주세요.");
    },
  });

  const { mutateAsync: disableMutate, isPending: isDisabling } = useMutation({
    mutationFn: async () => {
      const registration = await registerPushServiceWorker();
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) return;

      // 서버에 구독 정보가 이미 없거나(404) 오류가 나도 기기 구독은 반드시 끊어야
      // 버튼이 '기기 알림 끄기'에 갇히지 않는다.
      // 기기 구독이 끊기면 그 endpoint 로는 더 이상 푸시가 전달되지 않으므로 서버 오류는 넘긴다.
      try {
        await deletePushSubscription({ endpoint: subscription.endpoint });
      } catch {
        // 서버 정리 실패는 무시하고 기기 해제를 이어간다.
      }
      await subscription.unsubscribe();
      clearPushSyncFlag();
    },
    onSuccess: () => {
      setIsSubscribed(false);
      toast.success("이 기기에서 알림을 끕니다.");
    },
    onError: () => {
      toast.error("기기 알림을 끄지 못했습니다. 다시 시도해주세요.");
    },
  });

  const isPending = isEnabling || isDisabling;

  const togglePush = useCallback(async () => {
    if (isPending) return;

    if (isSubscribed) {
      await disableMutate().catch(() => undefined);
      return;
    }

    if (permission === "denied") {
      toast.error("브라우저 설정에서 이 사이트의 알림 차단을 해제해주세요.");
      return;
    }

    await enableMutate().catch(() => undefined);
  }, [disableMutate, enableMutate, isPending, isSubscribed, permission]);

  return {
    isSupported,
    isSubscribed,
    isChecking,
    isPending,
    permission,
    togglePush,
  };
}
