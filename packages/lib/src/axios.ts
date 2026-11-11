import axios from "axios";

import { buildSigninPath, clearAuthCookies, getCurrentPath } from "./auth";
import { getCookieValue } from "./cookie";
import { AUTH_COOKIE_KEYS } from "./cookie-keys";
import { clearPushSyncFlag } from "./push/lib";

export * from "./cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getCookieValue(AUTH_COOKIE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 화면이 로그인 상태로 그려졌는지.
// 토큰 쿠키가 만료돼 사라진 뒤의 401 도 세션 만료로 보고 로그인 페이지로 보내기 위해 쓴다.
// 비로그인 화면을 그리는 앱(client 공개 페이지)은 false 로 알려 준다.
let isSessionExpected = true;

export const setSessionExpected = (expected: boolean) => {
  isSessionExpected = expected;
};

// 로그인 없이 접근 가능한 경로 (리다이렉트 루프 방지)
const PUBLIC_PATHS = ["/signin", "/callback"];

const redirectToSignIn = () => {
  if (typeof window === "undefined") return;

  // 만료된 인증 정보 제거
  clearAuthCookies();
  clearPushSyncFlag();

  const isPublic = PUBLIC_PATHS.some((path) =>
    window.location.pathname.startsWith(path),
  );
  if (isPublic) return;

  // 다시 로그인하면 보던 페이지로 돌아올 수 있도록 현재 경로를 넘긴다.
  window.location.href = buildSigninPath(getCurrentPath());
};

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    // 세션 만료(401)일 때만 로그인 페이지로 이동한다.
    // 토큰을 보냈거나, 화면이 로그인 상태인데 토큰 쿠키가 만료돼 빠진 요청이 대상이다.
    // 비로그인 화면에서 토큰 없이 보낸 요청의 401 은 만료가 아니므로 각 요청에서 처리하도록 전파한다.
    // 403(권한 없음/금지)은 인증은 유효한 상태이므로 로그아웃 대상이 아니며,
    // 각 요청의 onError(토스트 등)에서 처리하도록 그대로 전파한다.
    const status = error?.response?.status;
    const hadToken = Boolean(error?.config?.headers?.Authorization);
    if (status === 401 && (hadToken || isSessionExpected)) {
      redirectToSignIn();
    }
    return Promise.reject(error);
  },
);
