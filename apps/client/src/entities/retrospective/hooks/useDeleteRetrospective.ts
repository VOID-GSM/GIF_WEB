"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteRetrospective } from "../api/retrospectiveApi";

export function useDeleteRetrospective() {
  const t = useTranslations("retrospective.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRetrospective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospective"] });
      toast.success(t("deleted"));
    },
    onError: () => toast.error(t("deleteError")),
  });
}
