/** 서버 아이템 카테고리 (GET /api/items) */
export type ItemCategory =
  | "EXPRESSION"
  | "HAIR"
  | "CLOTH"
  | "OBJECT"
  | "DECORATION"
  | "GLASSES";

export interface ItemResponse {
  id: number;
  name: string;
  itemKey: string;
  category: ItemCategory;
  price: number;
  isDefault: boolean;
  imageUrl: string;
  isOwned: boolean;
  isEquipped: boolean;
}

export interface BuyItemRequest {
  itemId: number;
}

export interface EquipItemsRequest {
  itemIds: number[];
}

/** 화면에서 쓰는 카테고리 (탭 순서·레이어 순서 기준) */
export type ThynCategory =
  | "hair"
  | "clothes"
  | "face"
  | "headwear"
  | "glasses"
  | "prop";

/** 무대(몸 이미지 144×182) 기준 px 위치 */
export interface ThynPlacement {
  left: number;
  top: number;
  width: number;
  rotate?: number;
  /** 머리장식: 이 위치를 맞춘 기준 머리카락 itemKey */
  hairAnchor?: string;
}

export interface ThynAsset {
  src: string;
  placement?: ThynPlacement;
}

export interface ThynItem {
  id: number;
  itemKey: string;
  category: ThynCategory;
  name: string;
  src: string;
  price: number;
  /** 실제로 산 아이템 */
  owned: boolean;
  /** 서버에 저장된 착용 상태 */
  equipped: boolean;
  /** 기본 아이템(0코인). 서버가 자동 지급하지 않아 저장할 때 대신 구매한다. */
  isDefault: boolean;
  placement?: ThynPlacement;
}

/** 카테고리별 착용 아이템 id */
export type ThynEquipped = Partial<Record<ThynCategory, number>>;
