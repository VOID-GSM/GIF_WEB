// GET /api/notifications — 알림 단건
export interface GetNotificationResponse {
  id: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  // 이동할 경로. 앱 내 상대 경로(/projects/10)가 기본이고,
  // 다른 앱이나 외부 링크로 보내는 알림은 절대 URL 로 내려온다.
  // 이동할 페이지가 없는 안내성 알림도 있어서 선택 필드다.
  targetUrl?: string;
}

// Spring Slice 응답 (알림 목록은 total count 없이 다음 페이지 유무만 내려온다)
export interface SliceGetNotificationResponse {
  content: GetNotificationResponse[];
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// GET /api/notifications/unread-count — 안 읽은 알림 개수
export interface GetNotificationUnreadCountResponse {
  unreadCount: number;
}

// 조회 기간. 목록·안 읽은 개수·일괄 읽기가 모두 같은 값을 써야
// 배지 숫자와 목록이 어긋나지 않는다.
export interface NotificationDaysParams {
  days?: number;
}

export interface GetNotificationsParams extends NotificationDaysParams {
  page: number;
  size: number;
}
