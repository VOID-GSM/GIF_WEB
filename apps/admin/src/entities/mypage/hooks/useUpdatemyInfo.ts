"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAdminInfo } from "../api";

export function useUpdateAdminInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("정보가 수정되었습니다.");
    },
    onError: () => {
      toast.error("정보 수정에 실패했습니다.");
    },
  });
}
