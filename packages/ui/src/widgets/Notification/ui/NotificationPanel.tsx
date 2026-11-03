"use client";

import { useRouter } from "next/navigation";

import type { GetNotificationResponse } from "@repo/lib";
import {
  NOTIFICATION_RETENTION_DAYS,
  resolveNotificationTarget,
  useGetNotificationUnreadCount,
  useGetNotifications,
  usePushSubscription,
  useReadAllNotifications,
  useReadNotification,
} from "@repo/lib";

import type { NotificationPanelProps } from "../model/type";
import NotificationItem from "./NotificationItem";

export default function NotificationPanel({
  align,
  onClose,
}: NotificationPanelProps) {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useGetNotifications();
  const { data: unreadCountData } = useGetNotificationUnreadCount();
  const { mutate: readNotification, mutateAsync: readNotificationAsync } =
    useReadNotification();
  const { mutate: readAllNotifications, isPending: isReadingAll } =
    useReadAllNotifications();
  const { isSupported, isSubscribed, isChecking, isPending, togglePush } =
    usePushSubscription();

  // 보관 기간은 서버가 days 로 잘라서 내려주므로 여기서 다시 거르지 않는다.
  const notifications = data?.pages.flatMap((page) => page.content) ?? [];

  const unreadCount = unreadCountData?.unreadCount ?? 0;
  const hasUnread = unreadCount > 0;

  const handleSelect = async ({
    id,
    isRead,
    targetUrl,
  }: GetNotificationResponse) => {
    const target = resolveNotificationTarget(targetUrl);

    // 외부 이동은 문서가 바뀌면서 진행 중인 요청이 끊길 수 있어 읽음 처리를 기다린 뒤 이동한다.
    // 실패해도 이동은 해야 하므로 오류는 넘긴다(토스트는 훅에서 띄운다).
    if (target?.type === "external") {
      if (!isRead) await readNotificationAsync(id).catch(() => undefined);
      onClose();
      // 절대 URL 은 다른 앱이나 외부 링크라 라우터로 이동할 수 없다.
      window.location.href = target.href;
      return;
    }

    // 앱 안 이동은 요청이 끊기지 않으므로 서버 응답을 기다리지 않고 바로 넘어간다.
    if (!isRead) readNotification(id);
    if (!target) return;

    onClose();
    router.push(target.href);
  };

  return (
    <div
      role="dialog"
      aria-label="알림"
      className={`absolute top-[calc(100%+8px)] z-[110] flex max-h-[440px] w-[calc(100vw-32px)] max-w-[340px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-new ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      <div className="shrink-0 border-b border-gray-100 px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">
            알림
            <span className="ml-1.5 text-[11px] font-medium text-gray-500">
              최근 {NOTIFICATION_RETENTION_DAYS}일
            </span>
          </h2>

          <button
            type="button"
            onClick={() => readAllNotifications()}
            disabled={!hasUnread || isReadingAll}
            className="cursor-pointer rounded-md px-1.5 py-1 text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
          >
            {isReadingAll ? "처리 중..." : "모두 읽기"}
          </button>
        </div>

        {isSupported && (
          <button
            type="button"
            onClick={togglePush}
            disabled={isChecking || isPending}
            aria-pressed={isSubscribed}
            className="mt-2 cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubscribed ? "기기 알림 끄기" : "기기 알림 받기"}
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <p className="px-4 py-10 text-center text-[13px] text-gray-500">
            알림을 불러오는 중이에요.
          </p>
        )}

        {/* '더 보기' 실패에도 isError 가 true 가 되므로, 전체 오류는 받은 알림이 없을 때만 보여준다. */}
        {isError && notifications.length === 0 && (
          <p className="px-4 py-10 text-center text-[13px] text-gray-500">
            알림을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <p className="px-4 py-10 text-center text-[13px] text-gray-500">
            최근 {NOTIFICATION_RETENTION_DAYS}일 동안 도착한 알림이 없어요.
          </p>
        )}

        {notifications.length > 0 && (
          <ul>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onSelect={handleSelect}
              />
            ))}
          </ul>
        )}

        {hasNextPage && (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full cursor-pointer border-t border-gray-100 px-4 py-3 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetchingNextPage
              ? "불러오는 중..."
              : isFetchNextPageError
                ? "불러오지 못했어요. 다시 시도"
                : "이전 알림 더 보기"}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 cursor-pointer border-t border-gray-100 px-4 py-2 text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
      >
        닫기
      </button>
    </div>
  );
}
