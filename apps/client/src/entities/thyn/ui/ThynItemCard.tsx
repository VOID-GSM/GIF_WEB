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
  const isFace = item.category === "face";
  // 기본 아이템은 저장할 때 자동으로 받으므로 보유 아이템처럼 보여준다
  const owned = item.owned || item.isDefault;
  // 옷장에서는 보유하지 않은 아이템을 모두 무채색으로 보여준다
  const muted = mode === "closet" && !owned;

  const statusLabel = owned ? "보유중" : mode === "closet" ? "미보유" : `${item.price}코인`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-pressed={onClick ? selected : undefined}
      aria-label={`${item.name} ${statusLabel}`}
      title={item.name}
      className="relative h-[99px] w-[75px] shrink-0 overflow-hidden rounded-[9px] border border-gray-300 bg-white enabled:cursor-pointer disabled:cursor-default"
    >
      <span
        className={`absolute -left-px -top-px flex size-[75px] items-center justify-center overflow-hidden rounded-[9px] bg-white ${
          selected ? "border-2 border-yellow-600" : "border border-gray-300"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 크기가 제각각인 정적 SVG 썸네일 */}
        <img
          src={item.src}
          alt=""
          className={`${isFace ? "size-[75px] max-w-none" : "max-h-[57px] max-w-[69px]"} ${muted ? "grayscale" : ""}`}
        />
      </span>

      <span className="absolute inset-x-0 top-[74px] flex h-[23px] items-center text-[13px] font-semibold leading-[1.2] tracking-[-0.3px] text-black">
        {mode === "shop" && !owned ? (
          <span className="flex w-full items-center gap-2 pl-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thyn/coin.svg" alt="" width={15} height={15} />
            <span className="font-bold">{item.price}</span>
          </span>
        ) : (
          <span className="w-full text-center">{statusLabel}</span>
        )}
      </span>
    </button>
  );
}
