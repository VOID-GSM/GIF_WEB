"use client";

import { useCallback } from "react";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthSession } from "@/entities/auth";
import { buildSigninPath } from "@/shared/utils";

// 로그인이 필요한 버튼(수정, 양식 작성 등)을 감싼다.
// 비로그인 상태면 로그인 페이지로 보내고, 로그인 후 returnTo(기본: 현재 페이지)로 돌아온다.
export function useRequireLogin() {
  const { isGuest } = useAuthSession();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (action: () => void, returnTo: string = pathname) => {
      if (!isGuest) {
        action();
        return;
      }
      toast.info("로그인이 필요한 기능입니다.");
      router.push(buildSigninPath(returnTo));
    },
    [isGuest, pathname, router],
  );
}
