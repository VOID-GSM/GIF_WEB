"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { COOKIE_KEYS } from "@/shared/constants";
import { setCookie } from "@/shared/utils";

import { postAdminInfo } from "../api";

export function usePostAdminInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAdminInfo,
    onSuccess: (res) => {
      // 역할 부여 시 백엔드가 역할이 반영된 새 accessToken 을 재발급한다.
      // 기존 토큰(역할 없음)을 갱신하지 않으면 이후 권한이 필요한 요청이 거부되어 로그아웃된다.
      const accessToken = res.data?.accessToken;
      if (accessToken) setCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken);

      // 가입 직후 내 정보(역할 등)를 최신화한다. 새로고침 없이 mypage 에 바로 반영된다.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
