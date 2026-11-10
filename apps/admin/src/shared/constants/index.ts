import { AUTH_COOKIE_KEYS } from "@repo/lib/cookie-keys";

// 인증 쿠키 이름은 로그아웃 시 함께 지워지도록 @repo/lib 의 상수를 그대로 쓴다.
export const COOKIE_KEYS = {
  ACCESS_TOKEN: AUTH_COOKIE_KEYS.ACCESS_TOKEN,
} as const;

// 이 이메일 계정은 회원가입 절차 없이 바로 서비스를 이용할 수 있다.
export const PRIVILEGED_ADMIN_EMAIL = "teamvoid0107@gmail.com";
