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

export const deleteCookieValue = (key: string) => {
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

apiClient.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error),
);
