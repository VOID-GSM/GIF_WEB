"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchFormSubmit } from "../api/api";

export function usePatchFormSubmit() {
  return useMutation({
    mutationFn: patchFormSubmit,
    onSuccess: () => toast.success("답변이 수정되었습니다."),
    onError: () => toast.error("답변 수정에 실패했습니다."),
  });
}
