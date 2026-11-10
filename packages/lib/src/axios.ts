import axios from "axios";

import { buildSigninPath, clearAuthCookies, getCurrentPath } from "./auth";
import { getCookieValue } from "./cookie";
import { clearPushSyncFlag } from "./push/lib";

export * from "./cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getCookieValue("access_token"); // COOKIE_KEYS.ACCESS_TOKEN 값과 일치시킬 것
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    // 토큰 없이 보낸 요청(비로그인 사용자의 공개 페이지 조회)의 401은 만료가 아니므로
    // 강제로 이동시키지 않고 각 요청에서 처리하도록 그대로 전파한다.
    // 403(권한 없음/금지)은 인증은 유효한 상태이므로 로그아웃 대상이 아니며,
    // 각 요청의 onError(토스트 등)에서 처리하도록 그대로 전파한다.
    const status = error?.response?.status;
    const hadToken = Boolean(error?.config?.headers?.Authorization);
    if (status === 401 && hadToken) {
      redirectToSignIn();
    }
    return Promise.reject(error);
  },
);
