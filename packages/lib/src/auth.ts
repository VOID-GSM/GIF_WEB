import { removeCookieValue } from "./cookie";
import { AUTH_COOKIE_KEYS } from "./cookie-keys";

// 로그아웃·세션 만료 시 지울 인증 쿠키 이름 — AUTH_COOKIE_KEYS 에서 만들어 누락을 막는다.
export const AUTH_COOKIE_NAMES = Object.values(AUTH_COOKIE_KEYS);

// 로그아웃·세션 만료 시 인증 쿠키를 한 번에 지운다.
export const clearAuthCookies = () => {
  AUTH_COOKIE_NAMES.forEach((name) => removeCookieValue(name));
};

export const SIGNIN_PATH = "/signin";
// 로그인 후 돌아갈 경로를 담는 쿼리 키 (/signin?redirect=/projects/12)
export const REDIRECT_PARAM_KEY = "redirect";

// 로그인 흐름에 쓰이는 페이지 — 로그인 후 복귀 경로로 쓰면 루프가 생긴다.
const AUTH_FLOW_PATHS = ["/signin", "/callback", "/signup"];

const URL_BASE = "http://localhost";

const isAuthFlowPath = (pathname: string) =>
  AUTH_FLOW_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

// Open Redirect 방지 — 같은 사이트의 상대 경로(`/`로 시작, `//`·`/\` 제외)만 허용한다.
// 허용되지 않는 값은 null 을 돌려주고, 호출 측은 기본 페이지로 이동한다.
export function sanitizeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/")) return null;
  // 공백·제어 문자·역슬래시는 브라우저마다 해석이 달라 외부 주소로 바뀔 수 있다.
  if (/[\s\\\u0000-\u001f\u007f]/.test(value)) return null;

  let url: URL;
  try {
    url = new URL(value, URL_BASE);
  } catch {
    return null;
  }
  // `//evil.com` 처럼 호스트가 바뀌는 값은 막는다.
  // `/..//evil.com` 처럼 정규화 결과가 `//` 로 시작하면 프로토콜 상대 URL 이 되므로 함께 막는다.
  if (url.origin !== URL_BASE || url.pathname.startsWith("//")) return null;
  if (isAuthFlowPath(url.pathname)) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

// 지금 보고 있는 페이지 경로 (쿼리 포함)
export const getCurrentPath = () => {
  if (typeof window === "undefined") return null;
  const { pathname, search } = window.location;
  return `${pathname}${search}`;
};

// 로그인 후 returnTo 로 돌아오도록 로그인 페이지 경로를 만든다.
export function buildSigninPath(returnTo?: string | null) {
  const safePath = sanitizeReturnPath(returnTo);
  if (!safePath) return SIGNIN_PATH;

  const params = new URLSearchParams({ [REDIRECT_PARAM_KEY]: safePath });
  return `${SIGNIN_PATH}?${params}`;
}
