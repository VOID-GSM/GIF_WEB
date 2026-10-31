"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createRetrospective,
  deleteDraftRetrospective,
  updateRetrospective,
} from "../api/retrospectiveApi";
import type { UpsertRetrospectiveRequest } from "../model/type";

export function useUpsertRetrospective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertRetrospectiveRequest) => {
      if (payload.id !== undefined) {
        await updateRetrospective(payload.id, payload);
        return payload.id;
      }

      const createdId = await createRetrospective(payload);

      // 임시 저장 글을 작성 완료로 바꾸는 API가 없어서, 새 글로 작성한 뒤 임시 저장 글을 지운다.
      // 삭제에 실패해도 작성은 끝났으므로 오류로 처리하지 않는다.
      if (payload.draftId !== undefined) {
        await deleteDraftRetrospective(payload.draftId).catch(() => undefined);
      }

      return createdId;
    },
    onSuccess: (_id, payload) => {
      queryClient.invalidateQueries({ queryKey: ["retrospective"] });
      toast.success(
        payload.id === undefined
          ? "회고록이 작성되었습니다."
          : "회고록이 수정되었습니다.",
      );
    },
    onError: () => toast.error("회고록 저장에 실패했습니다."),
  });
}
