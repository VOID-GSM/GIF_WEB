"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { postFormUpload } from "../api/api";

export function usePostFormUpload() {
  return useMutation({
    mutationFn: postFormUpload,
    onError: () => toast.error("파일 업로드에 실패했습니다."),
  });
}
