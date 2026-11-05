import { THYN_ASSETS, THYN_CATEGORY_MAP } from "../model/constants";
import type { ItemResponse, ThynEquipped, ThynItem } from "../model/type";

/** 서버 아이템을 화면용 아이템으로 바꾼다. 로컬 SVG가 없으면 서버 이미지를 쓴다. */
export const toThynItem = (item: ItemResponse): ThynItem => {
  const asset = THYN_ASSETS[item.itemKey];
  return {
    id: item.id,
    itemKey: item.itemKey,
    category: THYN_CATEGORY_MAP[item.category],
    name: item.name,
    src: asset?.src ?? item.imageUrl,
    price: item.price,
    owned: item.isOwned,
    equipped: item.isEquipped,
    // 기본 지급 아이템(기본 표정·멜빵)은 사지 않아도 보유중으로 본다.
    isDefault: item.isDefault,
    placement: asset?.placement,
  };
};

/**
 * 서버에 저장된 착용 상태.
 * 얼굴은 항상 있어야 하므로 저장된 표정이 없으면 기본 표정을 쓴다.
 */
export const getSavedEquipped = (items: ThynItem[]): ThynEquipped => {
  const equipped = items
    .filter((item) => item.equipped)
    .reduce<ThynEquipped>((acc, item) => ({ ...acc, [item.category]: item.id }), {});

  if (equipped.face === undefined) {
    const defaultFace = items.find((item) => item.category === "face" && item.isDefault);
    if (defaultFace) equipped.face = defaultFace.id;
  }
  return equipped;
};
