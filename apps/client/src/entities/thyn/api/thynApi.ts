import { apiClient } from "@repo/lib";

import type {
  BuyItemRequest,
  EquipItemsRequest,
  ItemResponse,
} from "../model/type";

export const getItems = async (): Promise<ItemResponse[]> => {
  const { data } = await apiClient.get<ItemResponse[]>("/api/items");
  return data;
};

export const buyItem = async (body: BuyItemRequest): Promise<ItemResponse> => {
  const { data } = await apiClient.post<ItemResponse>("/api/items/buy", body);
  return data;
};

/** 보낸 itemIds만 착용하고 나머지는 벗긴 뒤 전체 아이템을 돌려준다 */
export const equipItems = async (
  body: EquipItemsRequest,
): Promise<ItemResponse[]> => {
  const { data } = await apiClient.post<ItemResponse[]>(
    "/api/items/equip",
    body,
  );
  return data;
};
