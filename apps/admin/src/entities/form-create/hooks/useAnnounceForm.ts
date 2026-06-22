"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { announceForm } from "../api";

export function useAnnounceForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: announceForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form", "list"] });
      toast.success("양식을 공지했습니다.");
    },
    onError: () => toast.error("양식 공지에 실패했습니다."),
  });
}
