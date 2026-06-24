"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchFormSubmit } from "../api/api";

export function usePatchFormSubmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchFormSubmit,
    onSuccess: () => {
      // 프로젝트 상세 일정(ScheduleSection)이 공유하는 my-submit 캐시를
      // 갱신해 가장 최근 제출한 캘린더가 즉시 반영되도록 한다.
      queryClient.invalidateQueries({ queryKey: ["form", "my-submit"] });
    },
  });
}
