"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateForm } from "../api";
import type { UpdateFormRequest } from "../model/types";
import { FORM_QUERY_KEY } from "./useGetFormList";

interface UpdateFormVariables {
  formId: number;
  body: UpdateFormRequest;
}

export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formId, body }: UpdateFormVariables) =>
      updateForm(formId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORM_QUERY_KEY });
      toast.success("양식이 수정되었습니다.");
    },
    onError: () => toast.error("양식 수정에 실패했습니다."),
  });
}
