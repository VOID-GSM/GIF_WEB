"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  connectGithub,
  disconnectGithub,
  getCurrentUser,
  syncGithub,
} from "../api/userApi";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

export function useConnectGithub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectGithub,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      toast.success(`@${user.githubUsername} 계정이 연동되었어요.`);
    },
    // 실패 안내는 콜백 화면의 인라인 에러 카드가 맡는다 (토스트와 중복 표시 방지).
  });
}

export function useDisconnectGithub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectGithub,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      toast.success("GitHub 연동이 해제되었어요.");
    },
    onError: () => {
      toast.error("연동 해제에 실패했습니다. 다시 시도해주세요.");
    },
  });
}

export function useSyncGithub() {
  const queryClient = useQueryClient();
  return useMutation({
    // sync 응답에는 이번 획득량이 없어(서버가 사용자 정보만 반환) 잔액 차이로 계산한다.
    // 오래된 캐시 대신 sync 직전 잔액을 서버에서 받아 비교해야 다른 경로로 얻은 코인이 섞이지 않는다.
    mutationFn: async () => {
      const before = await getCurrentUser();
      const user = await syncGithub();
      return { user, earned: user.coinBalance - before.coinBalance };
    },
    onSuccess: ({ user, earned }) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      toast.success(
        earned > 0
          ? `커밋 보상으로 ${earned}코인을 받았어요!`
          : "새로 반영된 커밋이 없어요.",
      );
    },
    onError: () => {
      toast.error("커밋 동기화에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });
}
