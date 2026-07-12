"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postAdminInfo } from "../api";

export function usePostAdminInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAdminInfo,
    onSuccess: () => {
      // 가입 직후 내 정보(역할 등)를 최신화한다. 새로고침 없이 mypage 에 바로 반영된다.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
