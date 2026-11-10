"use client";
import { useState } from "react";

import { Sidebar } from "@repo/ui";
import { NavbarProps } from "@repo/ui";
import { Menu } from "@repo/ui";
import NotificationBell from "../../Notification/ui/NotificationBell";
import {
  useGetScoreNotice,
  useNotificationPushListener,
  useSyncPushSubscription,
} from "@repo/lib";

export default function Navbar({
  navItems,
  isGuest = false,
  homePath = "/",
}: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 알림 벨은 모바일·데스크톱에 두 번 렌더링되므로
  // 구독 동기화와 푸시 수신 처리는 Navbar 에서 한 번만 실행한다.
  // 비로그인 상태에서는 인증이 필요한 알림·푸시 요청을 보내지 않는다.
  useSyncPushSubscription({ enabled: !isGuest });
  useNotificationPushListener();
  // 등수 메뉴가 있을 때만 공개 여부를 조회한다.
  const hasRankItem = navItems.some((item) => item.path === "/rank");
  const { data: notice } = useGetScoreNotice({
    enabled: !isGuest && hasRankItem,
  });
  const isRankPublished = notice?.isPublished ?? false;

  const filteredNavItems = navItems.filter((item) => {
    if (item.path !== "/rank") return true;
    return isRankPublished;
  });

  return (
    <>
      <div className="fixed top-0 left-0 z-40 flex h-14 w-full items-center bg-background px-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="flex cursor-pointer items-center justify-center"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        {!isGuest && <NotificationBell align="right" className="ml-auto" />}
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/5 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        navItems={filteredNavItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isGuest={isGuest}
        homePath={homePath}
      />
    </>
  );
}
