"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ProjectLinkRequest } from "../model/types";
import { createProjectLink } from "./projectLinkApi";

export function useCreateProjectLink(projectId: number) {
  const t = useTranslations("project.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectLinkRequest) =>
      createProjectLink(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", "links", projectId],
      });
      toast.success(t("linkCreated"));
    },
    onError: () => {
      toast.error(t("linkCreateError"));
    },
  });
}
