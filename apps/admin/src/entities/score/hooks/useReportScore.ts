"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getReportScore, postReportScore, patchReportScore } from "../api";
import type { CreateReportScoreRequest } from "../model/types";

export function useGetReportScore(projectId: number) {
  return useQuery({
    queryKey: ["score", "report", projectId],
    enabled: projectId > 0,
    queryFn: async () => {
      try {
        return (await getReportScore(projectId)).data;
      } catch (err: unknown) {
        if ((err as { response?: { status?: number } })?.response?.status === 404) return null;
        throw err;
      }
    },
  });
}

export function useCreateReportScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReportScoreRequest) => postReportScore(body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["score", "report", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "status", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "notice"] });
      queryClient.invalidateQueries({ queryKey: ["score", "field-averages"] });
      queryClient.invalidateQueries({ queryKey: ["score", "rank"] });
      toast.success("보고서 영역 점수가 저장되었습니다.");
    },
    onError: () => {
      toast.error("점수 저장에 실패했습니다.");
    },
  });
}

export function useUpdateReportScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ...body }: CreateReportScoreRequest) =>
      patchReportScore(projectId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["score", "report", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "status", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["score", "notice"] });
      queryClient.invalidateQueries({ queryKey: ["score", "field-averages"] });
      queryClient.invalidateQueries({ queryKey: ["score", "rank"] });
      toast.success("보고서 영역 점수가 수정되었습니다.");
    },
    onError: () => {
      toast.error("점수 수정에 실패했습니다.");
    },
  });
}
