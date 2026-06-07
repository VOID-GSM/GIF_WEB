"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { announceForm } from "../api";
import { FORM_QUERY_KEY } from "./useGetFormList";

export function useAnnounceForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formId: number) => announceForm(formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORM_QUERY_KEY });
      toast.success("양식을 공지했습니다.");
    },
    onError: () => toast.error("양식 공지에 실패했습니다."),
  });
}
