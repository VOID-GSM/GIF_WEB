import type { ItemCategory, ThynAsset, ThynCategory } from "./type";

export const THYN_CATEGORIES: { key: ThynCategory; label: string }[] = [
  { key: "hair", label: "머리카락" },
  { key: "clothes", label: "옷" },
  { key: "face", label: "표정" },
  { key: "headwear", label: "머리장식" },
  { key: "glasses", label: "안경" },
  { key: "prop", label: "소품" },
];

export const THYN_CATEGORY_MAP: Record<ItemCategory, ThynCategory> = {
  HAIR: "hair",
  CLOTH: "clothes",
  EXPRESSION: "face",
  DECORATION: "headwear",
  GLASSES: "glasses",
  OBJECT: "prop",
};

/** 아래 → 위 순서로 겹쳐 그린다 */
export const THYN_LAYER_ORDER: ThynCategory[] = [
  "clothes",
  "face",
  "hair",
  "glasses",
  "headwear",
  "prop",
];

/**
 * 미리보기 무대 = 몸 이미지(base.svg, 144×182) 좌표계.
 * Figma 옷장 프레임(1625:2)의 몸 그룹 원점은 base.svg 안에서 (1.5, 1.5)이다.
 */
export const THYN_STAGE = { width: 144, height: 182 } as const;

/**
 * 머리카락별 정수리 높이(무대 기준 y). 머리장식은 Figma에서 맞춰 둔 머리카락(hairAnchor)과의
 * 차이만큼 위아래로 옮겨서, 어떤 머리를 써도 머리 위에 얹히게 한다.
 * none은 머리카락이 없을 때 모자가 맨머리 위에 살짝 얹히도록 잡은 값이다.
 */
export const THYN_HAIR_CROWN: Record<string, number> = {
  none: -15.5,
  perm: -42.8,
  shot: -26.5,
  buzz_cut: -30,
  tamed_cut: -24.5,
  shaggy_cut: -19.5,
};

/** 머리카락·모자가 무대 위로 튀어나오는 최대 높이. 착용에 따라 몸이 위아래로 움직이지 않게 고정한다. */
export const THYN_HEADROOM = 84;

const BASE = "/thyn";

/** 모든 표정은 같은 100×100 카드 안에 그려져 있어 위치가 같다 (Figma Group 15 얼굴 기준) */
const FACE_PLACEMENT = { left: 21.5, top: -0.2, width: 100 };

export const THYN_DEFAULT_FACE_SRC = `${BASE}/face/smile.svg`;

/**
 * 서버 itemKey → 로컬 SVG와 착용 위치
 * placement는 Figma 옷장 프레임 캐릭터 6명의 좌표를 몸 기준으로 옮겨 계산한 값 (SVG 크기는 1:1)
 */
export const THYN_ASSETS: Record<string, ThynAsset> = {
  // 머리카락
  // Figma 원본(190.79)은 띤 머리보다 너무 커서 다른 머리카락 크기에 맞춰 줄였다
  perm: { src: `${BASE}/hair/hair-1.svg`, placement: { left: -12.5, top: -44, width: 165, rotate: -3.22 } },
  shot: { src: `${BASE}/hair/hair-2.svg`, placement: { left: -8, top: -28, width: 151 } },
  buzz_cut: { src: `${BASE}/hair/hair-3.svg`, placement: { left: -14, top: -40, width: 163 } },
  tamed_cut: { src: `${BASE}/hair/hair-4.svg`, placement: { left: -3, top: -26, width: 141 } },
  shaggy_cut: { src: `${BASE}/hair/hair-5.svg`, placement: { left: -12, top: -21, width: 163 } },

  // 옷
  shoulder_strap: { src: `${BASE}/clothes/uniform.svg`, placement: { left: 28, top: 88, width: 86 } },
  dress: { src: `${BASE}/clothes/pink-dress.svg`, placement: { left: 26, top: 88, width: 90 } },
  sailor: { src: `${BASE}/clothes/sailor-uniform.svg`, placement: { left: 23, top: 88, width: 101 } },
  coat: { src: `${BASE}/clothes/trench-coat.svg`, placement: { left: 15, top: 89, width: 117 } },
  knit_skirt: { src: `${BASE}/clothes/knit-skirt.svg`, placement: { left: 14, top: 87, width: 116 } },
  suit: { src: `${BASE}/clothes/suit.svg`, placement: { left: 13, top: 89, width: 112 } },

  // 표정
  smile: { src: THYN_DEFAULT_FACE_SRC, placement: FACE_PLACEMENT },
  nyah: { src: `${BASE}/face/wink-tongue.svg`, placement: FACE_PLACEMENT },
  surprise: { src: `${BASE}/face/surprised.svg`, placement: FACE_PLACEMENT },
  sad: { src: `${BASE}/face/crying.svg`, placement: FACE_PLACEMENT },
  angry: { src: `${BASE}/face/angry.svg`, placement: FACE_PLACEMENT },
  tired: { src: `${BASE}/face/gloomy.svg`, placement: FACE_PLACEMENT },

  // 머리장식
  cone: { src: `${BASE}/top/party-hat.svg`, placement: { left: 42.6, top: -83.4, width: 50, hairAnchor: "perm" } },
  sailor_hat: { src: `${BASE}/top/sailor-hat.svg`, placement: { left: 24, top: -53, width: 98, hairAnchor: "buzz_cut" } },
  pin: { src: `${BASE}/top/flower.svg`, placement: { left: 90, top: -22, width: 42, hairAnchor: "shot" } },

  // 안경: 렌즈 가운데를 표정의 두 눈 가운데(71.3, 46.8)에 맞춘다
  sun_glasses: { src: `${BASE}/top/sunglasses.svg`, placement: { left: 26.3, top: 23.8, width: 92 } },
  round_glasses: { src: `${BASE}/top/round-glasses.svg`, placement: { left: 34.7, top: 24.8, width: 76 } },

  // 소품
  ribbon: { src: `${BASE}/top/ribbon.svg`, placement: { left: 45, top: 95, width: 48 } },
  muffler: { src: `${BASE}/top/bandana.svg`, placement: { left: 36, top: 87, width: 68 } },
  flower: { src: `${BASE}/top/flower-stalk.svg`, placement: { left: -8, top: 64, width: 33 } },
  book: { src: `${BASE}/top/book.svg`, placement: { left: -12, top: 94, width: 38 } },
};
