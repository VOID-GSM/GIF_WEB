"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("github.toast");
  return useMutation({
    mutationFn: connectGithub,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      toast.success(
        user.githubUsername
          ? t("connectedAs", { username: user.githubUsername })
          : t("connected"),
      );
    },
    // 실패 안내는 콜백 화면의 인라인 에러 카드가 맡는다 (토스트와 중복 표시 방지).
  });
}

export function useDisconnectGithub() {
  const queryClient = useQueryClient();
  const t = useTranslations("github.toast");
  return useMutation({
    mutationFn: disconnectGithub,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      toast.success(t("disconnected"));
    },
    onError: () => {
      toast.error(t("disconnectError"));
    },
  });
}

export function useSyncGithub() {
  const queryClient = useQueryClient();
  const t = useTranslations("github.toast");
  return useMutation({
    // sync 응답에는 이번 획득량이 없어(서버가 사용자 정보만 반환) 잔액 차이로 계산한다.
    // 오래된 캐시 대신 sync 직전 잔액을 서버에서 받아 비교해야 다른 경로로 얻은 코인이 섞이지 않는다.
    // TODO: 서버 sync 응답에 earnedCoin 이 추가되면(VOID-GSM/GIF_SERVER#230) 사전 조회를 제거하고 응답 값을 쓴다.
    mutationFn: async () => {
      const before = await getCurrentUser();
      const user = await syncGithub();
      return { user, earned: user.coinBalance - before.coinBalance };
    },
    onSuccess: ({ user, earned }) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      toast.success(
        earned > 0
          ? t("synced", { earned })
          : t("noNewCommits"),
      );
    },
    onError: () => {
      toast.error(t("syncError"));
    },
  });
}
