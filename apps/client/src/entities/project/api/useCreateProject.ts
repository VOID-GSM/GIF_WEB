"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProject } from "./projectApi";

export function useCreateProject() {
  const t = useTranslations("project.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", "me"] });
      toast.success(t("created"));
    },
    onError: () => {
      toast.error(t("createError"));
    },
  });
}
