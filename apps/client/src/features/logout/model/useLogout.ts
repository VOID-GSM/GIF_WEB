"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { logout } from "@repo/lib";

// 푸시 구독 해제 → 인증 쿠키 삭제 → 로그인 페이지 이동
export function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    await logout();
    router.replace("/signin");
    router.refresh();
  }, [router]);
}
