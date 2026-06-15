"use client";

import { useQuery } from "@tanstack/react-query";

import { getFormMySubmit } from "../api";
import type { GetFormMySubmitParams } from "../model/types";

export function useGetFormMySubmit(params: GetFormMySubmitParams) {
  return useQuery({
    queryKey: ["form", "my-submit", params.formId, params.projectId],
    queryFn: () => getFormMySubmit(params),
  });
}
