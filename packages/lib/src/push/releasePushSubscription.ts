import { deletePushSubscription } from "./api";
import { clearPushSyncFlag, isPushSupported } from "./lib";

// 서버 응답이 늦어도 로그아웃이 오래 막히지 않도록 기다리는 시간을 제한한다.
const RELEASE_TIMEOUT_MS = 3000;

const release = async (): Promise<void> => {
  clearPushSyncFlag();
  if (!isPushSupported()) return;

  // 로그아웃만 하려는 것이라 새로 등록하지 않고 이미 있는 워커만 확인한다.
  const registration = await navigator.serviceWorker.getRegistration("/");
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;

  try {
    await deletePushSubscription({ endpoint: subscription.endpoint });
  } finally {
    // 서버 해제가 실패해도 기기 구독은 반드시 끊어 다음 사용자가 알림을 받지 않게 한다.
    await subscription.unsubscribe();
  }
};

// 공용 PC 에서 다음 사용자가 이전 사용자의 알림을 받지 않도록
// 토큰을 지우기 전에(서버 요청이 인증될 때) 서버·기기 구독을 모두 해제한다.
export const releasePushSubscription = async (): Promise<void> => {
  await Promise.race([
    release().catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, RELEASE_TIMEOUT_MS)),
  ]);
};
