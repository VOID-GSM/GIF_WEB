"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteProjectLink } from "./projectLinkApi";

export function useDeleteProjectLink(projectId: number) {
  const t = useTranslations("project.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: number) => deleteProjectLink(projectId, linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", "links", projectId],
      });
      toast.success(t("linkDeleted"));
    },
    onError: () => {
      toast.error(t("linkDeleteError"));
    },
  });
}
