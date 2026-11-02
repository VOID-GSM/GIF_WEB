import { getVapidPublicKey } from "./api";
import {
  hasSameApplicationServerKey,
  registerPushServiceWorker,
  urlBase64ToUint8Array,
} from "./lib";

// 기존 구독이 있으면 재사용하고, 서버 VAPID 키가 바뀌었으면 끊고 새로 구독한다.
export const subscribeOnDevice = async (): Promise<PushSubscription> => {
  const registration = await registerPushServiceWorker();
  const applicationServerKey = urlBase64ToUint8Array(await getVapidPublicKey());

  let subscription = await registration.pushManager.getSubscription();

  if (subscription && !hasSameApplicationServerKey(subscription, applicationServerKey)) {
    await subscription.unsubscribe();
    subscription = null;
  }

  return (
    subscription ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    }))
  );
};
