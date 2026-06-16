"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteForm } from "../api";
import { FORM_QUERY_KEY } from "./useGetFormList";

export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formId: number) => deleteForm(formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORM_QUERY_KEY });
      toast.success("양식이 삭제되었습니다.");
    },
    onError: () => toast.error("양식 삭제에 실패했습니다."),
  });
}
