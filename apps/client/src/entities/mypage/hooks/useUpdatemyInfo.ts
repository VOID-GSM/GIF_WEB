"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientInfo } from "../api";

export function useUpdateClientInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClientInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
