"use client";

import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { buyItem } from "./thynApi";
import { THYN_ITEMS_QUERY_KEY } from "./useGetThynItems";

const getErrorMessage = (error: unknown, fallback: string) =>
  (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) ||
  fallback;

/** 입혀 본 아이템 여러 개를 차례로 구매한다 */
export function useBuyThynItems() {
  const t = useTranslations("thyn.toast");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemIds: number[]) => {
      for (const itemId of itemIds) {
        await buyItem({ itemId });
      }
    },
    onSuccess: () => {
      toast.success(t("bought"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("buyError")));
    },
    // 일부만 성공했을 수도 있어 성공·실패와 관계없이 보유 상태와 코인을 다시 받는다
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: THYN_ITEMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
