"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ProjectLinkRequest } from "../model/types";
import { updateProjectLink } from "./projectLinkApi";

interface UpdateProjectLinkVariables extends ProjectLinkRequest {
  linkId: number;
}

export function useUpdateProjectLink(projectId: number) {
  const t = useTranslations("project.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, ...data }: UpdateProjectLinkVariables) =>
      updateProjectLink(projectId, linkId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", "links", projectId],
      });
      toast.success(t("linkUpdated"));
    },
    onError: () => {
      toast.error(t("linkUpdateError"));
    },
  });
}
