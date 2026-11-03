"use client";

import { useMemo, useState } from "react";

import { useGetMe } from "@/entities/auth";
import {
  THYN_CATEGORIES,
  getSavedEquipped,
  useBuyThynItems,
  useEquipThynItems,
  useGetThynItems,
  type ThynEquipped,
  type ThynItem,
  type ThynItemCardMode,
} from "@/entities/thyn";
import ThynClosetPanel from "@/widgets/thyn-closet/ui/ThynClosetPanel";
import ThynPreviewPanel from "@/widgets/thyn-preview/ui/ThynPreviewPanel";

type ThynTab = ThynItemCardMode;

const TABS: { key: ThynTab; label: string }[] = [
  { key: "closet", label: "옷장" },
  { key: "shop", label: "상점" },
];

const isSameEquipped = (a: ThynEquipped, b: ThynEquipped) =>
  THYN_CATEGORIES.every(({ key }) => a[key] === b[key]);

export default function ThynView() {
  const { data: items = [], isLoading, isError } = useGetThynItems();
  const { data: me } = useGetMe();
  const coin = me?.coinBalance ?? 0;

  const { mutate: buyItems, isPending: isBuying } = useBuyThynItems();
  const { mutate: saveEquipped, isPending: isSaving } = useEquipThynItems();

  const [tab, setTab] = useState<ThynTab>("closet");
  // 저장하기 전까지 바꾼 착용 상태. null이면 서버에 저장된 상태 그대로다.
  const [draft, setDraft] = useState<ThynEquipped | null>(null);

  const savedEquipped = useMemo(() => getSavedEquipped(items), [items]);
  const equipped = draft ?? savedEquipped;

  const equippedItems = useMemo(
    () => items.filter((item) => equipped[item.category] === item.id),
    [items, equipped],
  );
  // 상점에서 입혀 본, 아직 사지 않은 아이템
  const tryOnItems = equippedItems.filter((item) => !item.owned && !item.isDefault);

  const isDirty = !isSameEquipped(equipped, savedEquipped);

  // 같은 아이템을 다시 누르면 벗는다. 얼굴은 항상 있어야 하므로 표정은 벗지 않는다.
  const handleToggleItem = (item: ThynItem) => {
    setDraft((prev) => {
      const base = prev ?? savedEquipped;
      if (item.category === "face" && base.face === item.id) return prev;
      return {
        ...base,
        [item.category]: base[item.category] === item.id ? undefined : item.id,
      };
    });
  };

  const handleBuy = () => buyItems(tryOnItems.map((item) => item.id));
  const handleSave = () =>
    saveEquipped(equippedItems, { onSuccess: () => setDraft(null) });
  const handleReset = () => setDraft(null);

  return (
    // 다른 페이지들과 같이 화면 세로 가운데에 배치한다
    <div className="flex min-h-dvh w-full flex-col justify-center bg-background px-6 py-8 lg:px-[93px]">
      <div className="flex w-full flex-col gap-6">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-[26px] font-semibold leading-[1.2] tracking-[-0.6px] text-black">
            Thyn 꾸미기
          </h1>
          <p className="text-[13px] font-medium leading-none tracking-[-0.3px] text-gray-600">
            커밋 1회당 10코인씩 얻을 수 있어요!
          </p>
          {isError && (
            <p className="text-[13px] font-medium leading-none tracking-[-0.3px] text-red-600">
              아이템을 불러오지 못했어요.
            </p>
          )}
        </div>

        {/* 탭 + 코인 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-[18px]" role="tablist">
            {TABS.map(({ key, label }) => {
              const isActive = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(key)}
                  className={`h-[36px] w-[120px] rounded-[9px] text-[16px] font-semibold leading-[1.2] tracking-[-0.4px] ${
                    isActive
                      ? "bg-yellow-600 text-black"
                      : "border border-gray-300 bg-white text-gray-600"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex h-[36px] w-[120px] items-center justify-between rounded-full border border-gray-300 bg-white pr-[18px] pl-[9px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thyn/coin.svg" alt="코인" width={21} height={21} />
            <span className="text-[19px] font-bold leading-none tracking-[-0.5px] text-black">
              {coin.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex flex-col items-start gap-[30px] lg:flex-row">
          <ThynClosetPanel
            key={tab}
            mode={tab}
            items={items}
            equipped={equipped}
            onToggleItem={handleToggleItem}
            isLoading={isLoading}
          />

          <ThynPreviewPanel
            equippedItems={equippedItems}
            tryOnItems={tryOnItems}
            coin={coin}
            isDirty={isDirty}
            isSaving={isSaving}
            isBuying={isBuying}
            onSave={handleSave}
            onReset={handleReset}
            onBuy={handleBuy}
          />
        </div>
      </div>
    </div>
  );
}
