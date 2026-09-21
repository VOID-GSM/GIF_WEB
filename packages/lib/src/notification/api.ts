import { apiClient } from "../axios";

import { NOTIFICATION_RETENTION_DAYS } from "./lib";
import type {
  GetNotificationUnreadCountResponse,
  GetNotificationsParams,
  NotificationDaysParams,
  SliceGetNotificationResponse,
} from "./types";

export const getNotifications = async ({
  page,
  size,
  days = NOTIFICATION_RETENTION_DAYS,
}: GetNotificationsParams): Promise<SliceGetNotificationResponse> => {
  const { data } = await apiClient.get<SliceGetNotificationResponse>(
    "/api/notifications",
    { params: { page, size, days } },
  );
  return data;
};

export const getNotificationUnreadCount = async ({
  days = NOTIFICATION_RETENTION_DAYS,
}: NotificationDaysParams = {}): Promise<GetNotificationUnreadCountResponse> => {
  const { data } = await apiClient.get<GetNotificationUnreadCountResponse>(
    "/api/notifications/unread-count",
    { params: { days } },
  );
  return data;
};

export const patchNotificationRead = async (
  notificationId: number,
): Promise<void> => {
  await apiClient.patch(`/api/notifications/${notificationId}/read`);
};

export const patchAllNotificationsRead = async ({
  days = NOTIFICATION_RETENTION_DAYS,
}: NotificationDaysParams = {}): Promise<void> => {
  await apiClient.patch("/api/notifications/read-all", null, {
    params: { days },
  });
};
