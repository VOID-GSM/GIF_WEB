"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMajorScore, postMajorScore, patchMajorScore } from "../api";
import type { CreateMajorScoreRequest } from "../model/types";

export function useGetMajorScore(projectId: number) {
  return useQuery({
    queryKey: ["score", "major", projectId],
    enabled: projectId > 0,
    queryFn: async () => {
      try {
        return (await getMajorScore(projectId)).data;
      } catch (err: unknown) {
        if ((err as { response?: { status?: number } })?.response?.status === 404) return null;
        throw err;
      }
    },
  });
}

export function useCreateMajorScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateMajorScoreRequest) => postMajorScore(body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["score", "major", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "status", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "notice"] });
      queryClient.invalidateQueries({ queryKey: ["score", "field-averages"] });
      queryClient.invalidateQueries({ queryKey: ["score", "rank"] });
      toast.success("전공 중심 영역 점수가 저장되었습니다.");
    },
    onError: () => {
      toast.error("점수 저장에 실패했습니다.");
    },
  });
}

export function useUpdateMajorScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ...body }: CreateMajorScoreRequest) =>
      patchMajorScore(projectId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["score", "major", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "status", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "notice"] });
      queryClient.invalidateQueries({ queryKey: ["score", "field-averages"] });
      queryClient.invalidateQueries({ queryKey: ["score", "rank"] });
      toast.success("전공 중심 영역 점수가 수정되었습니다.");
    },
    onError: () => {
      toast.error("점수 수정에 실패했습니다.");
    },
  });
}
