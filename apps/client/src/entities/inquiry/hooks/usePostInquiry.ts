"use client";

import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { postInquiry } from "../api/inquiryApi";

export function usePostInquiry() {
  const t = useTranslations("inquiry.toast");
  return useMutation({
    mutationFn: postInquiry,
    onSuccess: () => {
      toast.success(t("created"));
    },
    onError: () => {
      toast.error(t("createError"));
    },
  });
}
