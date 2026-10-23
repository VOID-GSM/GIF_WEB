// 알림 센터는 최근 것만 보여준다. 오래된 알림은 이미 처리된 경우가 대부분이라
// 목록에 남아 있으면 새 알림을 찾기 어려워진다.
// 서버가 days 파라미터로 잘라서 내려주므로 이 값을 그대로 질의에 실어 보낸다.
export const NOTIFICATION_RETENTION_DAYS = 7;

// targetUrl 은 앱 내 상대 경로가 기본이지만 절대 URL 이 올 수도 있다.
// 절대 URL 은 Next 라우터로 이동할 수 없어 구분해서 처리해야 한다.
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
    return {
      type: "internal",
      href: trimmed.startsWith("/") ? trimmed : `/${trimmed}`,
    };
  }

  // javascript: 같은 스킴으로는 이동하지 않는다.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  return { type: "external", href: parsed.href };
};
