"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createDraftRetrospective,
  updateDraftRetrospective,
} from "../api/retrospectiveApi";
import type { UpsertRetrospectiveRequest } from "../model/type";

export function useSaveDraftRetrospective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertRetrospectiveRequest) => {
      if (payload.id === undefined) return createDraftRetrospective(payload);
      await updateDraftRetrospective(payload.id, payload);
      return payload.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospective", "draft"] });
      toast.success("임시 저장했습니다.");
    },
    onError: () => toast.error("임시 저장에 실패했습니다."),
  });
}
