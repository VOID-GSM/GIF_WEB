import { AUTH_COOKIE_KEYS } from "@repo/lib/cookie-keys";

// 인증 쿠키 이름은 로그아웃 시 함께 지워지도록 @repo/lib 의 상수를 그대로 쓴다.
export const COOKIE_KEYS = {
  ACCESS_TOKEN: AUTH_COOKIE_KEYS.ACCESS_TOKEN,
} as const;

// 문의 답변·점수 배정 등 일부 권한 판단에 쓰는 운영 계정 (adminRole 기반 권한으로 전환 예정)
export const PRIVILEGED_ADMIN_EMAIL = "teamvoid0107@gmail.com";
