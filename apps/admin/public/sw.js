/*
 * Web Push 서비스 워커.
 * Next.js 는 public 디렉터리만 정적 서빙하므로 admin/client 각각에 같은 파일을 둔다.
 * 한쪽을 고치면 apps/admin/public/sw.js 와 apps/client/public/sw.js 를 함께 맞춰야 한다.
 */

// 새로 배포된 워커가 다음 방문까지 기다리지 않고 바로 푸시를 받도록 한다.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const parsePayload = (event) => {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch {
    return { body: event.data.text() };
  }
};

self.addEventListener("push", (event) => {
  const payload = parsePayload(event);
  const title = payload.title || "GIF 알림";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || "",
      icon: "/logo.png",
      badge: "/logo.png",
      // 서버가 tag 를 주면 같은 알림이 중복 수신돼도 한 개만 보인다.
      // 지금은 서버 payload 에 tag·id 가 없어서 매번 다른 태그가 되고,
      // 중복 알림이 각각 표시된다. (서버에 tag 추가 요청: VOID-GSM/GIF_SERVER#213)
      tag: payload.tag || `gif-notification-${Date.now()}`,
      // 서버는 targetUrl 과 url 을 함께 보낸다. 조회 API 와 같은 targetUrl 을 우선한다.
      data: { url: payload.targetUrl || payload.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // "//evil.com", "/\evil.com" 은 base 를 줘도 외부 도메인으로 해석된다.
  // 스킴(https: 등)이 없는 값은 앞쪽 / \ 를 지우고 / 하나만 붙여 같은 사이트 경로로 만든다.
  const rawUrl = String(event.notification.data?.url || "/").trim();
  const safeUrl = /^[a-z][a-z\d+.-]*:/i.test(rawUrl)
    ? rawUrl
    : `/${rawUrl.replace(/^[/\\]+/, "")}`;
  // javascript: 같은 스킴이나 파싱되지 않는 값이면 이동하지 않고 메인(/)으로 보낸다.
  // (packages/lib 의 resolveNotificationTarget 과 같은 규칙)
  let targetUrl = new URL("/", self.location.origin).href;
  try {
    const parsedUrl = new URL(safeUrl, self.location.origin);
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      targetUrl = parsedUrl.href;
    }
  } catch {
    // 잘못된 URL 은 기본값(/) 그대로 둔다.
  }

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // 같은 페이지가 이미 열려 있으면 그 탭만 앞으로 가져온다.
      const sameUrlClient = clientList.find((client) => client.url === targetUrl);
      if (sameUrlClient) return sameUrlClient.focus();

      // 다른 탭을 navigate() 로 옮기면 작성 중이던 입력이 사라질 수 있어 항상 새 탭으로 연다.
      return self.clients.openWindow(targetUrl);
    })(),
  );
});
