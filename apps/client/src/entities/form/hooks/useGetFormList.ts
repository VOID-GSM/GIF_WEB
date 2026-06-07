"use client";

import { useQuery } from "@tanstack/react-query";

import { getFormList } from "../api";
// 🔻 목데이터 — 실 연동 시 이 import 삭제 + model/mock.ts 파일 삭제
import { MOCK_FORM_LIST } from "../model/mock";

export const FORM_QUERY_KEY = ["form", "list"] as const;

// 🔻 목데이터 토글 — projectId 연동 및 실 API 준비되면 false로 두거나 이 줄 삭제
const USE_MOCK_FORM_LIST = true;

export function useGetFormList(projectId: number) {
  return useQuery({
    queryKey: [...FORM_QUERY_KEY, projectId],
    queryFn: async () => {
      // 🔻 목데이터 — 실 연동 시 이 한 줄 삭제
      if (USE_MOCK_FORM_LIST) return MOCK_FORM_LIST;

      const { data } = await getFormList(projectId);
      return data;
    },
  });
}
