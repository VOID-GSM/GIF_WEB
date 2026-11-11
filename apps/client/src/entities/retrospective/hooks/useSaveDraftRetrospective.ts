"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createDraftRetrospective,
  updateDraftRetrospective,
} from "../api/retrospectiveApi";
import type { UpsertRetrospectiveRequest } from "../model/type";

export function useSaveDraftRetrospective() {
  const t = useTranslations("retrospective.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertRetrospectiveRequest) => {
      if (payload.id === undefined) return createDraftRetrospective(payload);
      await updateDraftRetrospective(payload.id, payload);
      return payload.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospective", "draft"] });
      toast.success(t("draftSaved"));
    },
    onError: () => toast.error(t("draftSaveError")),
  });
}
