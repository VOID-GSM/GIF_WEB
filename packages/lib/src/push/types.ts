// POST /api/push/subscribe — 브라우저 PushSubscription 등록
export interface CreatePushSubscriptionRequest {
  endpoint: string;
  p256dh: string;
  auth: string;
}

// DELETE /api/push/unsubscribe — 구독 해제
export interface DeletePushSubscriptionRequest {
  endpoint: string;
}

// GET /api/push/vapid-key — 서버가 Map.of("publicKey", ...) 로 내려준다.
export interface VapidKeyResponse {
  publicKey: string;
}
