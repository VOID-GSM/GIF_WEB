"use client";

import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteFormUpload } from "../api/api";

export function useDeleteFormUpload() {
  const t = useTranslations("formSubmission.toast");
  return useMutation({
    mutationFn: deleteFormUpload,
    onError: () => toast.error(t("deleteFileError")),
  });
}
