"use client";

import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getCatChaseRound,
  getCatChaseRounds,
  startCatChaseRound,
  submitCatChaseJudgments,
} from "../api/catChaseApi";
import type { SubmitCatChaseJudgmentsRequest } from "../model/types";

export const CAT_CHASE_QUERY_KEY = ["assessment", "cat-chase"] as const;

export function useStartCatChaseRound() {
  return useMutation({
    mutationFn: startCatChaseRound,
    onError: () => toast.error("라운드를 시작하지 못했어요. 다시 시도해주세요."),
  });
}

export function useSubmitCatChaseJudgments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roundId,
      body,
    }: {
      roundId: number;
      body: SubmitCatChaseJudgmentsRequest;
    }) => submitCatChaseJudgments(roundId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAT_CHASE_QUERY_KEY });
    },
    onError: () => toast.error("판단을 제출하지 못했어요. 다시 시도해주세요."),
  });
}

export function useGetCatChaseRounds() {
  return useQuery({
    queryKey: [...CAT_CHASE_QUERY_KEY, "rounds"],
    queryFn: getCatChaseRounds,
  });
}

export function useGetCatChaseRound(roundId: number | undefined) {
  return useQuery({
    queryKey: [...CAT_CHASE_QUERY_KEY, "rounds", roundId],
    queryFn: () => getCatChaseRound(roundId as number),
    enabled: Number.isFinite(roundId),
  });
}

// 검사를 끝낸 뒤 여러 라운드의 정답을 한 번에 불러온다.
export function useGetCatChaseRoundResults(roundIds: number[]) {
  return useQueries({
    queries: roundIds.map((roundId) => ({
      queryKey: [...CAT_CHASE_QUERY_KEY, "rounds", roundId],
      queryFn: () => getCatChaseRound(roundId),
    })),
    combine: (results) => ({
      data: results.flatMap((r) => (r.data ? [r.data] : [])),
      isPending: results.some((r) => r.isPending),
      isError: results.some((r) => r.isError),
    }),
  });
}
