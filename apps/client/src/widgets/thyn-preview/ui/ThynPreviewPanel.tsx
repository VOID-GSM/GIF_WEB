"use client";

import { useTranslations } from "next-intl";
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
  "h-[36px] w-full rounded-[9px] text-[16px] font-semibold leading-[1.2] tracking-[-0.4px] enabled:cursor-pointer disabled:cursor-default disabled:opacity-50";

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
  const t = useTranslations("thyn.preview");
  const hasTryOn = tryOnItems.length > 0;
  const total = tryOnItems.reduce((sum, item) => sum + item.price, 0);
  const shortage = total - coin;

  return (
    // 기본 높이는 내용만큼, 입혀 본 아이템이 늘어나면 옆 아이템 박스 높이(540px)까지만 커진다
    <aside className="flex max-h-[540px] min-h-[330px] w-[240px] shrink-0 flex-col rounded-[15px] bg-white px-[15px] py-[18px] shadow">
      <h2 className="shrink-0 px-[9px] text-[16px] font-semibold leading-[1.2] tracking-[-0.4px] text-gray-700">
        {t("title")}
      </h2>

      {/* 아바타는 스크롤되지 않고 고정 */}
      <div className="mt-[15px] mb-9 flex shrink-0 justify-center">
        <ThynAvatar items={equippedItems} width={111} />
      </div>

      {/* 최대 높이에 닿으면 주문서만 스크롤된다 */}
      <div className="min-h-0 flex-auto overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hasTryOn && (
          <div className="mb-[15px] flex flex-col gap-2 rounded-[9px] border border-gray-300 px-3 py-2.5 text-[13px] font-semibold leading-[1.2] tracking-[-0.3px]">
            <p className="text-gray-600">{t("triedItems")}</p>
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
              <span>{t("total")}</span>
              <span className="font-bold">{t("coin", { coin: total.toLocaleString() })}</span>
            </div>
            {shortage > 0 && (
              <p className="text-red-600">
                {t("shortage", { count: shortage.toLocaleString() })}
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
            className={`${buttonBase} bg-yellow-600 text-black`}
          >
            {isBuying ? t("buying") : t("buy")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className={`${buttonBase} bg-yellow-600 text-black`}
          >
            {isSaving ? t("saving") : t("save")}
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          disabled={!isDirty || isSaving || isBuying}
          className={`${buttonBase} border border-gray-300 bg-white text-gray-600`}
        >
          {t("reset")}
        </button>
      </div>
    </aside>
  );
}
