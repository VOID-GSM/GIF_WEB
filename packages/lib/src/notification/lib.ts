// 알림 센터는 최근 것만 보여준다. 오래된 알림은 이미 처리된 경우가 대부분이라
// 목록에 남아 있으면 새 알림을 찾기 어려워진다.
// 서버가 days 파라미터로 잘라서 내려주므로 이 값을 그대로 질의에 실어 보낸다.
export const NOTIFICATION_RETENTION_DAYS = 7;

// targetUrl 은 앱 내 상대 경로가 기본이지만 절대 URL 이 올 수도 있다.
// 다른 사이트의 절대 URL 은 Next 라우터로 이동할 수 없어 구분해서 처리해야 한다.
export type NotificationTarget =
  | { type: "internal"; href: string }
  | { type: "external"; href: string };

export const resolveNotificationTarget = (
  targetUrl?: string | null,
): NotificationTarget | null => {
  const trimmed = targetUrl?.trim();
  if (!trimmed) return null;

  let parsed: URL | null = null;
  try {
    parsed = new URL(trimmed);
  } catch {
    // base 없이 파싱되지 않으면 절대 URL 이 아니므로 앱 내 경로로 본다.
    parsed = null;
  }

  if (!parsed) {
    // "//evil.com", "/\evil.com" 처럼 앞에 / 나 \ 가 여러 개면 브라우저가 외부 도메인으로 해석한다.
    // 앞쪽 / \ 를 모두 지우고 / 하나만 붙여 항상 같은 사이트 안의 경로가 되게 한다.
    return {
      type: "internal",
      href: `/${trimmed.replace(/^[/\\]+/, "")}`,
    };
  }

  // javascript: 같은 스킴으로는 이동하지 않는다.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  // 같은 사이트의 절대 URL 은 라우터로 이동해야 새로고침 없이 캐시·앱 상태가 유지된다.
  if (typeof window !== "undefined" && parsed.origin === window.location.origin) {
    return {
      type: "internal",
      href: `${parsed.pathname}${parsed.search}${parsed.hash}`,
    };
  }

  return { type: "external", href: parsed.href };
};
