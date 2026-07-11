import axios from "axios";

export const getCookieValue = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`),
  );
  return match ? match[2] : null;
};

export const setCookieValue = (
  key: string,
  value: string,
  options: { path?: string; maxAge?: number; domain?: string; sameSite?: "Lax" | "Strict" | "None" } = {},
) => {
  if (typeof window === "undefined") return;
  const parts = [`${key}=${value}`];

  if (options.path) parts.push(`path=${options.path}`);
  if (options.maxAge) parts.push(`max-age=${options.maxAge}`);
  if (options.domain) parts.push(`domain=${options.domain}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  document.cookie = parts.join("; ");
};

export const removeCookieValue = (key: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${key}=; path=/; max-age=0`;
};

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
  removeCookieValue("access_token");
  removeCookieValue("client_role");

  const { pathname } = window.location;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) return;

  window.location.href = "/signin";
};

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    // 세션 만료(401)일 때만 로그인 페이지로 이동한다.
    // 403(권한 없음/금지)은 인증은 유효한 상태이므로 로그아웃 대상이 아니며,
    // 각 요청의 onError(토스트 등)에서 처리하도록 그대로 전파한다.
    const status = error?.response?.status;
    if (status === 401) {
      redirectToSignIn();
    }
    return Promise.reject(error);
  },
);
