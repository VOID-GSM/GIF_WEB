import { useTranslations } from "next-intl";
import {
  THYN_ASSETS,
  THYN_DEFAULT_FACE_SRC,
  THYN_HAIR_CROWN,
  THYN_HEADROOM,
  THYN_LAYER_ORDER,
  THYN_STAGE,
} from "../model/constants";
import type { ThynItem, ThynPlacement } from "../model/type";

const pctX = (value: number) => `${(value / THYN_STAGE.width) * 100}%`;
const pctY = (value: number) => `${(value / THYN_STAGE.height) * 100}%`;

interface Layer {
  key: string;
  name: string;
  src: string;
  placement: ThynPlacement;
}

interface ThynAvatarProps {
  /** 착용 중인 아이템 목록 */
  items: ThynItem[];
  /** 렌더링 너비(px). 몸 이미지(144×182) 비율 그대로 줄이거나 늘린다. */
  width?: number;
  className?: string;
}

export default function ThynAvatar({
  items,
  width = THYN_STAGE.width,
  className,
}: ThynAvatarProps) {
  const t = useTranslations("thyn.avatar");
  const hairKey = items.find((item) => item.category === "hair")?.itemKey ?? "none";
  const hasFace = items.some((item) => item.category === "face");

  const layers: Layer[] = THYN_LAYER_ORDER.flatMap((category) => {
    // 얼굴은 항상 있어야 하므로 고른 표정이 없으면 기본 표정을 그린다
    if (category === "face" && !hasFace) {
      return [{ key: "default-face", name: t("defaultFace"), src: THYN_DEFAULT_FACE_SRC, placement: THYN_ASSETS.smile.placement! }];
    }
    return items
      .filter((item) => item.category === category && item.placement)
      .map(({ id, name, src, placement }) => {
        const { hairAnchor } = placement!;
        // 머리장식은 쓰고 있는 머리카락 높이에 맞춰 위아래로 옮긴다
        const dy = hairAnchor
          ? (THYN_HAIR_CROWN[hairKey] ?? THYN_HAIR_CROWN.none) - THYN_HAIR_CROWN[hairAnchor]
          : 0;
        return { key: String(id), name, src, placement: { ...placement!, top: placement!.top + dy } };
      });
  });

  const scale = width / THYN_STAGE.width;

  return (
    <div
      className={`relative aspect-[144/182] ${className ?? ""}`}
      // 모자·머리카락이 튀어나올 자리를 늘 같은 크기로 비워 둬서 착용에 따라 몸이 움직이지 않게 한다
      style={{ width, marginTop: THYN_HEADROOM * scale }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 크기가 제각각인 정적 SVG 레이어 */}
      <img src="/thyn/base.svg" alt={t("thyn")} className="absolute inset-x-0 top-0 h-auto w-full" />
      {layers.map(({ key, name, src, placement }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={src}
          alt={name}
          className="absolute h-auto max-w-none"
          style={{
            left: pctX(placement.left),
            top: pctY(placement.top),
            width: pctX(placement.width),
            rotate: placement.rotate ? `${placement.rotate}deg` : undefined,
          }}
        />
      ))}
    </div>
  );
}
