"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createRetrospective,
  updateRetrospective,
} from "../api/retrospectiveApi";
import type { UpsertRetrospectiveRequest } from "../model/type";

export function useUpsertRetrospective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertRetrospectiveRequest) => {
      if (payload.id === undefined) return createRetrospective(payload);
      await updateRetrospective(payload.id, payload);
      return payload.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospective"] });
      toast.success("회고록을 저장했습니다.");
    },
    onError: () => toast.error("회고록 저장에 실패했습니다."),
  });
}
