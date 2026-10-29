"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { connectGithub, disconnectGithub, syncGithub } from "../api/userApi";
import type { CurrentUserResponse } from "../model/types";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

export function useConnectGithub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectGithub,
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      toast.success(`@${user.githubUsername} 계정이 연동되었어요.`);
    },
    onError: () => {
      toast.error("GitHub 연동에 실패했습니다. 다시 시도해주세요.");
    },
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
    mutationFn: syncGithub,
    onSuccess: (user) => {
      const prev = queryClient.getQueryData<CurrentUserResponse>(
        CURRENT_USER_QUERY_KEY,
      );
      const earned = user.coinBalance - (prev?.coinBalance ?? user.coinBalance);
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
