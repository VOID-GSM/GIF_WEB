// 인증 쿠키 이름 — 앱(COOKIE_KEYS)과 lib(토큰 첨부·로그아웃)이 모두 이 상수를 쓴다.
// 다른 모듈을 import 하지 않아 proxy·서버 컴포넌트에서도 `@repo/lib/cookie-keys` 로 가볍게 가져다 쓸 수 있다.
export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: "access_token",
  CLIENT_ROLE: "client_role",
  ACCOUNT_TYPE: "account_type",
} as const;
