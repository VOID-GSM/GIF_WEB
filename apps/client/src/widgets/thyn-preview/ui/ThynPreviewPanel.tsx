"use client";

import { ThynAvatar, type ThynItem } from "@/entities/thyn";

interface ThynPreviewPanelProps {
  equippedItems: ThynItem[];
  /** 상점에서 입혀 본 미보유 아이템 */
  tryOnItems: ThynItem[];
  coin: number;
  isDirty: boolean;
  isSaving: boolean;
  isBuying: boolean;
  onSave: () => void;
  onReset: () => void;
  onBuy: () => void;
}

const buttonBase =
  "h-[36px] w-full rounded-[9px] text-[16px] font-semibold leading-[1.2] tracking-[-0.4px] disabled:cursor-default";

export default function ThynPreviewPanel({
  equippedItems,
  tryOnItems,
  coin,
  isDirty,
  isSaving,
  isBuying,
  onSave,
  onReset,
  onBuy,
}: ThynPreviewPanelProps) {
  const hasTryOn = tryOnItems.length > 0;
  const total = tryOnItems.reduce((sum, item) => sum + item.price, 0);
  const shortage = total - coin;

  return (
    // 기본 높이는 내용만큼, 입혀 본 아이템이 늘어나면 옆 아이템 박스 높이(540px)까지만 커진다
    <aside className="flex max-h-[540px] min-h-[330px] w-[240px] shrink-0 flex-col rounded-[15px] bg-white px-[15px] py-[18px] shadow">
      <h2 className="shrink-0 px-[9px] text-[16px] font-semibold leading-[1.2] tracking-[-0.4px] text-gray-700">
        미리보기
      </h2>

      {/* 아바타는 스크롤되지 않고 고정 */}
      <div className="mt-[15px] mb-9 flex shrink-0 justify-center">
        <ThynAvatar items={equippedItems} width={111} />
      </div>

      {/* 최대 높이에 닿으면 주문서만 스크롤된다 */}
      <div className="min-h-0 flex-auto overflow-y-auto">
        {hasTryOn && (
          <div className="mb-[15px] flex flex-col gap-2 rounded-[9px] border border-gray-300 px-3 py-2.5 text-[13px] font-semibold leading-[1.2] tracking-[-0.3px]">
            <p className="text-gray-600">입혀 본 아이템</p>
            <ul className="flex flex-col gap-1.5">
              {tryOnItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-gray-700"
                >
                  <span className="truncate">{item.name}</span>
                  <span className="flex shrink-0 items-center gap-1 font-bold text-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/thyn/coin.svg" alt="" width={13} height={13} />
                    {item.price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-300 pt-2 text-black">
              <span>합계</span>
              <span className="font-bold">{total.toLocaleString()}코인</span>
            </div>
            {shortage > 0 && (
              <p className="text-red-600">
                코인이 {shortage.toLocaleString()}개 부족해요.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-[15px]">
        {hasTryOn ? (
          <button
            type="button"
            onClick={onBuy}
            disabled={shortage > 0 || isBuying}
            className={`${buttonBase} bg-yellow-600 text-black disabled:opacity-50`}
          >
            {isBuying ? "구매 중..." : "구매하기"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className={`${buttonBase} bg-yellow-600 text-black`}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          disabled={!isDirty || isSaving || isBuying}
          className={`${buttonBase} border border-gray-300 bg-white text-gray-600`}
        >
          원래대로 되돌리기
        </button>
      </div>
    </aside>
  );
}
