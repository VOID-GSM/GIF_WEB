"use client";

import { useQueries } from "@tanstack/react-query";

import { getFormMySubmit } from "../api/api";

// 양식 목록에서 각 양식의 제출자를 표시하기 위해, 제출된 양식들의 my-submit 을
// 병렬 조회한다. useGetFormMySubmit 와 동일한 queryKey 를 써서 캐시를 공유한다.
// 반환값: Map<formId, submittedByName>
export function useGetFormSubmitters(formIds: number[], projectId?: number) {
  const results = useQueries({
    queries: formIds.map((formId) => ({
      queryKey: ["form", "my-submit", formId, projectId],
      queryFn: () => getFormMySubmit({ formId, projectId: projectId ?? 0 }),
      enabled: !!formId && !!projectId,
    })),
  });

  const submitterNameMap = new Map<number, string>();
  results.forEach((res, i) => {
    if (res.data) submitterNameMap.set(formIds[i], res.data.submittedByName);
  });

  return submitterNameMap;
}
