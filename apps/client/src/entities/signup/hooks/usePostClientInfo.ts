"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postClientInfo } from "../api";

export function usePostClientInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postClientInfo,
    onSuccess: () => {
      // 가입 직후 내 정보(역할 등)를 최신화한다. 새로고침 없이 mypage 에 바로 반영된다.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
