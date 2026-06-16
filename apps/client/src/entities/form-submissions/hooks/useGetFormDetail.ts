"use client";

import { useQuery } from "@tanstack/react-query";
import { getFormDetail } from "../api/api";

export function useGetFormDetail(formId: number) {
  return useQuery({
    queryKey: ["form", "detail", formId],
    queryFn: () => getFormDetail(formId),
  });
}
