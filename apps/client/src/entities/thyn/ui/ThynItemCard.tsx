import { useTranslations } from "next-intl";
import type { ThynItem } from "../model/type";

export type ThynItemCardMode = "closet" | "shop";

interface ThynItemCardProps {
  item: ThynItem;
  mode: ThynItemCardMode;
  /** 미리보기에 입혀져 있는지 */
  selected?: boolean;
  /** 없으면 누를 수 없는 카드로 그린다 */
  onClick?: () => void;
}

export default function ThynItemCard({
  item,
  mode,
  selected = false,
  onClick,
}: ThynItemCardProps) {
  const t = useTranslations("thyn.item");
  const isFace = item.category === "face";
  // 기본 아이템은 저장할 때 자동으로 받으므로 보유 아이템처럼 보여준다
  const owned = item.owned || item.isDefault;
  // 옷장에서는 보유하지 않은 아이템을 모두 무채색으로 보여준다
  const muted = mode === "closet" && !owned;

  const statusLabel = owned
    ? t("owned")
    : mode === "closet"
      ? t("notOwned")
      : t("price", { price: item.price });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-pressed={onClick ? selected : undefined}
      aria-label={`${item.name} ${statusLabel}`}
      title={item.name}
      // 너비는 목록 칸에 맞춰 늘어나고, 이미지 영역은 정사각형을 유지한다
      className="flex w-full flex-col overflow-hidden rounded-[9px] border border-gray-300 bg-white enabled:cursor-pointer disabled:cursor-default"
    >
      <span
        className={`-mx-px -mt-px flex aspect-square items-center justify-center overflow-hidden rounded-[9px] bg-white ${
          selected ? "border-2 border-yellow-600" : "border border-gray-300"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 크기가 제각각인 정적 SVG 썸네일 */}
        <img
          src={item.src}
          alt=""
          className={`${isFace ? "size-full max-w-none" : "h-[72%] w-[88%] object-contain"} ${muted ? "grayscale" : ""}`}
        />
      </span>

      <span className="flex h-[28px] items-center text-[14px] font-semibold leading-[1.2] tracking-[-0.3px] text-black">
        {mode === "shop" && !owned ? (
          <span className="flex w-full items-center gap-2 pl-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thyn/coin.svg" alt="" width={16} height={16} />
            <span className="font-bold">{item.price}</span>
          </span>
        ) : (
          <span className="w-full text-center">{statusLabel}</span>
        )}
      </span>
    </button>
  );
}
