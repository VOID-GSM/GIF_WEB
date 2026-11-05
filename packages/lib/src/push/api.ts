import { apiClient } from "../axios";

import type {
  CreatePushSubscriptionRequest,
  DeletePushSubscriptionRequest,
  VapidKeyResponse,
} from "./types";

export const getVapidPublicKey = async (): Promise<string> => {
  const { data } = await apiClient.get<VapidKeyResponse>("/api/push/vapid-key");

  // 다른 값을 공개키로 잘못 쓰면 subscribe 오류의 원인을 찾기 어려워 publicKey 하나만 읽는다.
  const publicKey = data?.publicKey;
  if (!publicKey) {
    throw new Error("VAPID 공개키를 받아오지 못했습니다.");
  }

  return publicKey;
};

export const postPushSubscription = async (
  body: CreatePushSubscriptionRequest,
): Promise<void> => {
  await apiClient.post("/api/push/subscribe", body);
};

export const deletePushSubscription = async (
  body: DeletePushSubscriptionRequest,
): Promise<void> => {
  await apiClient.delete("/api/push/unsubscribe", { data: body });
};
