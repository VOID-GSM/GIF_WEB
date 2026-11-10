"use client";

import { useMutation } from "@tanstack/react-query";

import {
  requestRetrospectiveAiAssist,
  type RetrospectiveAiAction,
  type RetrospectiveAiRequest,
} from "../api/retrospectiveAiApi";

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
