"use client";

import { useQuery } from "@tanstack/react-query";

import { getForms } from "../api";
// TODO: 실데이터 연동 후 아래 import 및 폴백 로직 삭제
import { MOCK_FORMS } from "../model/mockForms";

export function useGetForms(projectId: number) {
  return useQuery({
    queryKey: ["form", "list", projectId],
    queryFn: async () => {
      // TODO: 백엔드 목록에 deadlineComplied 추가되면 폴백 제거하고 `return (await getForms(projectId)).data;`
      try {
        const data = (await getForms(projectId)).data;
        return data.length > 0 ? data : MOCK_FORMS;
      } catch {
        return MOCK_FORMS;
      }
    },
    enabled: Number.isFinite(projectId),
  });
}
