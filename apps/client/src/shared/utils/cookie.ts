import { COOKIE_KEYS } from "../constants";

export function setCookie(name: string, value: string, maxAge = 3600): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`),
  );
  return match ? match[2] : undefined;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

// 로그아웃 시 인증 관련 쿠키를 한 번에 지운다.
export function clearAuthCookies(): void {
  deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
  deleteCookie(COOKIE_KEYS.CLIENT_ROLE);
  deleteCookie(COOKIE_KEYS.ACCOUNT_TYPE);
}
