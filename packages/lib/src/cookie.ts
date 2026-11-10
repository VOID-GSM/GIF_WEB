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
  if (options.maxAge !== undefined) parts.push(`max-age=${options.maxAge}`);
  if (options.domain) parts.push(`domain=${options.domain}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  document.cookie = parts.join("; ");
};

export const removeCookieValue = (key: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${key}=; path=/; max-age=0`;
};
