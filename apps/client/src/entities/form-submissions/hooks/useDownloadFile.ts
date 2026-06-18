import { useMutation } from "@tanstack/react-query";
import { downloadFile } from "../api/api";
import { toast } from "sonner";

// hooks/useDownloadFile.ts
export function useDownloadFile() {
  return useMutation({
    mutationFn: ({
      fileUrl,
      fileName,
    }: {
      fileUrl: string;
      fileName: string;
    }) => {
      // 상대경로면 BASE_URL 붙이기
      const fullUrl = fileUrl.startsWith("http")
        ? fileUrl
        : `${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`;
      return downloadFile(fullUrl);
    },
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
