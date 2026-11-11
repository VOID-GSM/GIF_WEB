"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteDraftRetrospective } from "../api/retrospectiveApi";

export function useDeleteDraftRetrospective() {
  const t = useTranslations("retrospective.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDraftRetrospective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospective", "draft"] });
      toast.success(t("draftDeleted"));
    },
    onError: () => toast.error(t("draftDeleteError")),
  });
}
