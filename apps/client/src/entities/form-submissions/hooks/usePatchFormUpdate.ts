"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { patchFormUpdate } from "../api/api";

export function usePatchFormUpdate() {
  return useMutation({
    mutationFn: patchFormUpdate,
    onSuccess: () => toast.success("양식이 수정되었습니다."),
    onError: () => toast.error("양식 수정에 실패했습니다."),
  });
}
