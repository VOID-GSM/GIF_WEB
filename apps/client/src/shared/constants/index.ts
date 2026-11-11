import { AUTH_COOKIE_KEYS } from "@repo/lib/cookie-keys";

export const OAUTH_SESSION_KEYS = {
  STATE: "oauth_state",
  CODE_VERIFIER: "oauth_code_verifier",
  // 로그인을 시작한 OAuth 제공자 — 같은 /callback 으로 돌아오므로 어느 콜백 API를 부를지 구분한다.
  PROVIDER: "oauth_provider",
} as const;

// 인증 쿠키 이름은 로그아웃 시 함께 지워지도록 @repo/lib 의 상수를 그대로 쓴다.
export const COOKIE_KEYS = {
  ACCESS_TOKEN: AUTH_COOKIE_KEYS.ACCESS_TOKEN,
  CLIENT_ROLE: AUTH_COOKIE_KEYS.CLIENT_ROLE,
  // 계정 유형(STUDENT / TEACHER / EXTERNAL) — proxy·레이아웃에서 기능 노출을 나누는 데 쓴다.
  ACCOUNT_TYPE: AUTH_COOKIE_KEYS.ACCOUNT_TYPE,
} as const;

export const SEARCH_PARAM_KEYS = {
  // 로그인 후 돌아갈 경로 (/signin?redirect=/projects/12)
  REDIRECT: "redirect",
  // 공개 페이지로 돌려보낸 이유 (안내 토스트용)
  REASON: "reason",
} as const;

export const REDIRECT_REASONS = {
  // 외부 사용자가 재학생 전용 페이지에 접근함
  EXTERNAL_ONLY: "external-only",
} as const;

export * from "./routes";
