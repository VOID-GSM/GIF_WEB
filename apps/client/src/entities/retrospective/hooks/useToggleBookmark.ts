"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { toggleRetrospectiveBookmark } from "../api/retrospectiveApi";

export function useToggleBookmark() {
  const t = useTranslations("retrospective.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleRetrospectiveBookmark,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["retrospective"] });
      queryClient.invalidateQueries({ queryKey: ["retrospective", id] });
    },
    onError: () => toast.error(t("bookmarkError")),
  });
}
