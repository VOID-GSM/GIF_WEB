"use client";

import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { logout } from "@repo/lib";

// 푸시 구독 해제 → 인증 쿠키 삭제 → 쿼리 캐시 비우기 → 로그인 페이지 이동
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await logout();
    // QueryClient가 앱 전체에서 하나(루트 Providers)라 페이지를 옮겨도 캐시가 유지된다.
    // 이전 사용자의 isLiked·isMine 등이 다음 사용자 화면에 남지 않도록 캐시를 비운다.
    queryClient.clear();
    router.replace("/signin");
    router.refresh();
  }, [queryClient, router]);
}
