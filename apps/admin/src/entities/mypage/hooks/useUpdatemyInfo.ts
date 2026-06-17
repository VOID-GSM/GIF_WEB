"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminInfo } from "../api";

export function useUpdateAdminInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
