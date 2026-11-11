"use client";

import { useMutation } from "@tanstack/react-query";

import { requestRetrospectiveAiAssist } from "../api/retrospectiveAiApi";
import type {
  RetrospectiveAiAction,
  RetrospectiveAiRequest,
} from "../model/type";

export interface RetrospectiveAiAssistVariables {
  action: RetrospectiveAiAction;
  payload: RetrospectiveAiRequest;
}

export function useRetrospectiveAiAssist() {
  return useMutation({
    mutationFn: ({ action, payload }: RetrospectiveAiAssistVariables) =>
      requestRetrospectiveAiAssist(action, payload),
  });
}
