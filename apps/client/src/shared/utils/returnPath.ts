import { AUTH_FLOW_PATHS, matchesPathPrefix, SEARCH_PARAM_KEYS } from "../constants";

const URL_BASE = "http://localhost";

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
  if (url.origin !== URL_BASE) return null;
  if (matchesPathPrefix(url.pathname, AUTH_FLOW_PATHS)) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

// 로그인 후 returnTo 로 돌아오도록 로그인 페이지 경로를 만든다.
export function buildSigninPath(returnTo?: string | null) {
  const safePath = sanitizeReturnPath(returnTo);
  if (!safePath) return "/signin";

  const params = new URLSearchParams({ [SEARCH_PARAM_KEYS.REDIRECT]: safePath });
  return `/signin?${params}`;
}
