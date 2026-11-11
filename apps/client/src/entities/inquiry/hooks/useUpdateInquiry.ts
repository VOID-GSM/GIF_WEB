"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateInquiry } from "../api/inquiryApi";

export function useUpdateInquiry() {
  const t = useTranslations("inquiry.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInquiry,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["inquiry", "my", variables.inquiryId],
      });
      queryClient.invalidateQueries({ queryKey: ["inquiry", "my"] });
      toast.success(t("updated"));
    },
    onError: () => {
      toast.error(t("updateError"));
    },
  });
}
