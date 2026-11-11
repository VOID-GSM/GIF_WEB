import { clearAuthCookies } from "./auth";
import { releasePushSubscription } from "./push/releasePushSubscription";

// 토큰이 있어야 서버 구독을 해제할 수 있어 쿠키보다 먼저 정리한다.
// 화면 이동은 호출 측(라우터)에서 한다.
export const logout = async () => {
  await releasePushSubscription();
  clearAuthCookies();
};
