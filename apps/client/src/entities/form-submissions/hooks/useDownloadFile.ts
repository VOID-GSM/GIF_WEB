import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { downloadFile } from "../api/api";
import { toast } from "sonner";

export function useDownloadFile() {
  const t = useTranslations("formSubmission.toast");
  return useMutation({
    mutationFn: ({ fileUrl }: { fileUrl: string; fileName: string }) => {
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
    onError: () => toast.error(t("downloadError")),
  });
}
