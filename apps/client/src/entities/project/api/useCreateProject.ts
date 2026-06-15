"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProject } from "./projectApi";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", "me"] });
      toast.success("프로젝트가 생성되었습니다.");
    },
    onError: () => {
      toast.error("프로젝트 생성에 실패했습니다.");
    },
  });
}
