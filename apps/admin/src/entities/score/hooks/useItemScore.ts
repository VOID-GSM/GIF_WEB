"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProjectItemScores, putProjectItemScores } from "../api";
import type { SaveItemScoresRequest } from "../model/types";
import { getApiErrorMessage, getApiErrorStatus } from "../lib/getApiErrorMessage";

export const projectItemScoresQueryKey = (projectId: number) =>
  ["score", "projects", projectId, "items"] as const;

export function useGetProjectItemScores(projectId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: projectItemScoresQueryKey(projectId),
    enabled: projectId > 0 && (options?.enabled ?? true),
    queryFn: async () => (await getProjectItemScores(projectId)).data,
  });
}

export function useSaveProjectItemScores() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, ...body }: SaveItemScoresRequest & { projectId: number }) =>
      putProjectItemScores(projectId, body),
    onSuccess: ({ data }, { projectId }) => {
      // 저장 응답이 전체 채점 현황이므로 다시 조회하지 않고 캐시를 바로 교체한다.
      queryClient.setQueryData(projectItemScoresQueryKey(projectId), data);
      toast.success("항목별 점수가 저장되었습니다.");
    },
    onError: (error) => {
      if (getApiErrorStatus(error) === 409) {
        toast.error("다른 저장 요청과 충돌했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      toast.error(getApiErrorMessage(error, "점수 저장에 실패했습니다."));
    },
  });
}
