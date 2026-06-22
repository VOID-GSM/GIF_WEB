import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateForm } from "./index";
import type { UpdateFormRequest } from "../model/type";

export const useUpdateForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formId,
      body,
    }: {
      formId: number;
      body: UpdateFormRequest;
    }) => updateForm(formId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form", "list"] });
    },
  });
};
