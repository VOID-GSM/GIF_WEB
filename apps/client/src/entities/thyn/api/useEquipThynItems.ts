"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { buyItem, equipItems } from "./thynApi";
import { THYN_ITEMS_QUERY_KEY } from "./useGetThynItems";
import type { ThynItem } from "../model/type";

const getErrorMessage = (error: unknown) =>
  (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) ||
  "저장에 실패했습니다.";

/** 착용 상태를 저장한다 */
export function useEquipThynItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: ThynItem[]) => {
      // 기본 아이템은 서버가 자동 지급하지 않아 0코인으로 먼저 받아 둔다
      for (const item of items) {
        if (!item.owned && item.isDefault) await buyItem({ itemId: item.id });
      }
      return equipItems({ itemIds: items.map((item) => item.id) });
    },
    onSuccess: (items) => {
      queryClient.setQueryData(THYN_ITEMS_QUERY_KEY, items);
      toast.success("띤의 모습을 저장했어요.");
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: THYN_ITEMS_QUERY_KEY });
      toast.error(getErrorMessage(error));
    },
  });
}
