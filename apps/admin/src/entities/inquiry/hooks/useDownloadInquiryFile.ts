"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { downloadInquiryFile } from "../api/inquiryApi";

export function useDownloadInquiryFile() {
  return useMutation({
    mutationFn: ({ fileUrl }: { fileUrl: string; fileName: string }) =>
      downloadInquiryFile(fileUrl),
    onSuccess: (blob, { fileName }) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: () => toast.error("파일 다운로드에 실패했습니다."),
  });
}
