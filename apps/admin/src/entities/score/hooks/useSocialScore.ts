"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocialScore, postSocialScore, patchSocialScore } from "../api";
import type { CreateSocialScoreRequest } from "../model/types";

export function useGetSocialScore(projectId: number) {
  return useQuery({
    queryKey: ["score", "social", projectId],
    enabled: projectId > 0,
    queryFn: async () => {
      try {
        return (await getSocialScore(projectId)).data;
      } catch (err: unknown) {
        if ((err as { response?: { status?: number } })?.response?.status === 404) return null;
        throw err;
      }
    },
  });
}

export function useCreateSocialScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSocialScoreRequest) => postSocialScore(body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["score", "social", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "status", variables.projectId] });
      toast.success("사회 중심 영역 점수가 저장되었습니다.");
    },
    onError: () => {
      toast.error("점수 저장에 실패했습니다.");
    },
  });
}

export function useUpdateSocialScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ...body }: CreateSocialScoreRequest) =>
      patchSocialScore(projectId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["score", "social", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "status", variables.projectId] });
      toast.success("사회 중심 영역 점수가 수정되었습니다.");
    },
    onError: () => {
      toast.error("점수 수정에 실패했습니다.");
    },
  });
}
