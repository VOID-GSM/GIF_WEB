import axios from "axios";

const getCookieValue = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`),
  );
  return match ? match[2] : null;
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
