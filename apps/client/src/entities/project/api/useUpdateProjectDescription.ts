"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { projectQueryKeys } from "../model/queryKeys";
import { updateProjectDescription } from "./projectApi";

export function useUpdateProjectDescription(projectId: number) {
  const t = useTranslations("project.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (description: string) =>
      updateProjectDescription(projectId, description),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(projectId),
      });
      queryClient.invalidateQueries({ queryKey: ["project", "me"] });
      // 메인 페이지 카드(학년별 목록)도 수정 내용 즉시 반영
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.filters() });
      toast.success(t("descriptionUpdated"));
    },
    onError: () => {
      toast.error(t("descriptionUpdateError"));
    },
  });
}
