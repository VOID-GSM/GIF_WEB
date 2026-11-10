"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getCurrentPath } from "@repo/lib";

import { useAuthSession } from "@/entities/auth";
import { buildSigninPath } from "@/shared/utils";

// 로그인이 필요한 버튼(수정, 양식 작성 등)을 감싼다.
// 비로그인 상태면 로그인 페이지로 보내고, 로그인 후 returnTo(기본: 현재 페이지)로 돌아온다.
// 기본값은 클릭 시점의 경로 + 쿼리스트링이라 필터·정렬 상태도 함께 복귀한다.
export function useRequireLogin() {
  const { isGuest } = useAuthSession();
  const router = useRouter();

  return useCallback(
    (action: () => void, returnTo?: string | null) => {
      if (!isGuest) {
        action();
        return;
      }
      toast.info("로그인이 필요한 기능입니다.");
      router.push(buildSigninPath(returnTo ?? getCurrentPath()));
    },
    [isGuest, router],
  );
}
