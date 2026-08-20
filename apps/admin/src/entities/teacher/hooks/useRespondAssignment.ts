"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { respondAssignment } from "../api/teacherApi";
import type { RespondAssignmentRequest } from "../model/type";

interface RespondAssignmentVariables {
  assignmentId: number;
  body: RespondAssignmentRequest;
}

// NOTE: PATCH /api/teachers/assignments/{assignmentId} API 자체는 구현돼 있지만,
// 이 훅을 호출할 어떤 화면에서도 로그인한 admin 본인의 assignmentId를 얻어올 방법이
// 아직 없다 (GET /api/auth/me, GET /api/admin/teachers 어디에도 assignmentId가 없음).
// 백엔드에 "내 배정 목록 조회" API가 추가되면 그때 수락/거절 UI와 함께 연결한다.
export function useRespondAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, body }: RespondAssignmentVariables) =>
      respondAssignment(assignmentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("배정 응답이 처리되었습니다.");
    },
    onError: () => {
      toast.error("배정 응답 처리에 실패했습니다. 다시 시도해주세요.");
    },
  });
}
