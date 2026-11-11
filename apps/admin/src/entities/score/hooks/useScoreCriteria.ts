"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getScoreCriteriaAreas,
  postScoreCriteriaArea,
  patchScoreCriteriaArea,
  deleteScoreCriteriaArea,
  postScoreCriteriaItem,
  patchScoreCriteriaItem,
  deleteScoreCriteriaItem,
} from "../api";
import type {
  CreateScoreCriteriaAreaRequest,
  PatchScoreCriteriaAreaRequest,
  CreateScoreCriteriaItemRequest,
  PatchScoreCriteriaItemRequest,
} from "../model/types";
import { getApiErrorMessage } from "../lib/getApiErrorMessage";

export const SCORE_CRITERIA_QUERY_KEY = ["score", "criteria"] as const;

export function useGetScoreCriteria() {
  return useQuery({
    queryKey: SCORE_CRITERIA_QUERY_KEY,
    queryFn: async () => (await getScoreCriteriaAreas()).data,
  });
}

// 기준이 바뀌면 프로젝트별 채점 현황(항목·선택지 구성)도 달라지므로 함께 무효화한다.
function useInvalidateCriteria() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: SCORE_CRITERIA_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["score", "projects"] });
  };
}

export function useCreateScoreCriteriaArea() {
  const invalidate = useInvalidateCriteria();
  return useMutation({
    mutationFn: (body: CreateScoreCriteriaAreaRequest) => postScoreCriteriaArea(body),
    onSuccess: () => {
      invalidate();
      toast.success("평가 영역이 추가되었습니다.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "평가 영역 추가에 실패했습니다."));
    },
  });
}

export function useUpdateScoreCriteriaArea() {
  const invalidate = useInvalidateCriteria();
  return useMutation({
    mutationFn: ({ areaId, ...body }: PatchScoreCriteriaAreaRequest & { areaId: number }) =>
      patchScoreCriteriaArea(areaId, body),
    onSuccess: () => {
      invalidate();
      toast.success("평가 영역이 수정되었습니다.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "평가 영역 수정에 실패했습니다."));
    },
  });
}

export function useDeleteScoreCriteriaArea() {
  const invalidate = useInvalidateCriteria();
  return useMutation({
    mutationFn: (areaId: number) => deleteScoreCriteriaArea(areaId),
    onSuccess: () => {
      invalidate();
      toast.success("평가 영역이 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "평가 영역 삭제에 실패했습니다."));
    },
  });
}

export function useCreateScoreCriteriaItem() {
  const invalidate = useInvalidateCriteria();
  return useMutation({
    mutationFn: ({ areaId, ...body }: CreateScoreCriteriaItemRequest & { areaId: number }) =>
      postScoreCriteriaItem(areaId, body),
    onSuccess: () => {
      invalidate();
      toast.success("평가 항목이 추가되었습니다.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "평가 항목 추가에 실패했습니다."));
    },
  });
}

export function useUpdateScoreCriteriaItem() {
  const invalidate = useInvalidateCriteria();
  return useMutation({
    mutationFn: ({
      areaId,
      itemId,
      ...body
    }: PatchScoreCriteriaItemRequest & { areaId: number; itemId: number }) =>
      patchScoreCriteriaItem(areaId, itemId, body),
    onSuccess: () => {
      invalidate();
      toast.success("평가 항목이 수정되었습니다.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "평가 항목 수정에 실패했습니다."));
    },
  });
}

export type ScoreCriteriaReorderTarget =
  | { kind: "area"; areaId: number; displayOrder: number }
  | { kind: "item"; areaId: number; itemId: number; displayOrder: number };

// 서버는 displayOrder를 받은 값 그대로 저장하고 다른 행을 밀어주지 않는다.
// 그래서 순서를 바꿀 때는 바뀐 행들의 displayOrder를 한 번에 다시 매겨 보낸다.
export function useReorderScoreCriteria() {
  const invalidate = useInvalidateCriteria();
  return useMutation({
    mutationFn: (targets: ScoreCriteriaReorderTarget[]) =>
      Promise.all(
        targets.map((t) =>
          t.kind === "area"
            ? patchScoreCriteriaArea(t.areaId, { displayOrder: t.displayOrder })
            : patchScoreCriteriaItem(t.areaId, t.itemId, { displayOrder: t.displayOrder }),
        ),
      ),
    // 일부만 성공했을 수 있으므로 성공·실패 모두 서버 상태로 다시 맞춘다.
    onSettled: invalidate,
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "순서 변경에 실패했습니다."));
    },
  });
}

export function useDeleteScoreCriteriaItem() {
  const invalidate = useInvalidateCriteria();
  return useMutation({
    mutationFn: ({ areaId, itemId }: { areaId: number; itemId: number }) =>
      deleteScoreCriteriaItem(areaId, itemId),
    onSuccess: () => {
      invalidate();
      toast.success("평가 항목이 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "평가 항목 삭제에 실패했습니다."));
    },
  });
}
