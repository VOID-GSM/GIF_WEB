"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProject } from "./projectApi";
import type { UpdateProjectRequest } from "../model/types";

export function useUpdateProject(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) => updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", "detail", projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", "me"] });
      // 메인 페이지 카드(학년별 목록)도 수정 내용 즉시 반영
      queryClient.invalidateQueries({ queryKey: ["project", "filter"] });
      // 멤버 추가/삭제로 소속 팀·역할이 바뀔 수 있어 마이페이지(auth/me)도 갱신한다.
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("프로젝트가 수정되었습니다.");
    },
    onError: () => {
      toast.error("프로젝트 수정에 실패했습니다.");
    },
  });
}
