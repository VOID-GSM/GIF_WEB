"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteFormUpload } from "../api/api";

export function useDeleteFormUpload() {
  return useMutation({
    mutationFn: deleteFormUpload,
    onError: () => toast.error("파일 삭제에 실패했습니다."),
  });
}
