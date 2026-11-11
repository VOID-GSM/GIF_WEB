"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import {
  THYN_CATEGORIES,
  ThynItemCard,
  type ThynCategory,
  type ThynEquipped,
  type ThynItem,
  type ThynItemCardMode,
} from "@/entities/thyn";

interface ThynClosetPanelProps {
  /** closet: 옷장(보유 아이템 착용), shop: 상점(모든 아이템 입혀보기) */
  mode: ThynItemCardMode;
  items: ThynItem[];
  equipped: ThynEquipped;
  onToggleItem: (item: ThynItem) => void;
  isLoading?: boolean;
}

const isOwned = (item: ThynItem) => item.owned || item.isDefault;

/**
 * 한 줄에 최대 6개(카테고리별 최대 아이템 수)까지 카드를 늘려 빈 공간을 채운다.
 * 좁은 화면에서는 카드가 110px보다 작아지지 않게 한 줄의 개수를 줄인다.
 */
const ITEM_GRID =
  "grid grid-cols-[repeat(auto-fill,minmax(max(110px,calc((100%-5*21px)/6)),1fr))] gap-[21px]";

export default function ThynClosetPanel({
  mode,
  items,
  equipped,
  onToggleItem,
  isLoading = false,
}: ThynClosetPanelProps) {
  const t = useTranslations("thyn.closet");
  const tc = useTranslations("thyn.category");
  const [activeCategory, setActiveCategory] = useState<ThynCategory>("hair");
  const sectionRefs = useRef<Partial<Record<ThynCategory, HTMLElement | null>>>({});

  const handleCategoryClick = (category: ThynCategory) => {
    setActiveCategory(category);
    sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="flex h-[540px] w-full min-w-0 flex-1 overflow-hidden rounded-[15px] bg-white shadow">
      {/* 카테고리 탭 */}
      <nav className="w-[120px] shrink-0 border-r border-gray-300 pt-1.5 pl-1.5">
        <ul>
          {THYN_CATEGORIES.map(({ key }, index) => {
            const isActive = activeCategory === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(key)}
                  aria-current={isActive}
                  className={`flex h-[42px] w-full items-center justify-center rounded-l-[9px] border-b text-[13px] font-semibold leading-[1.2] tracking-[-0.3px] text-gray-700 ${
                    index === 0 ? "border-t" : ""
                  } ${
                    isActive
                      ? "border-l-2 border-y-gray-300 border-l-yellow-600 bg-yellow-50"
                      : "border-l border-gray-300 bg-white"
                  }`}
                >
                  {tc(key)}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 아이템 목록 */}
      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto px-7 py-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {THYN_CATEGORIES.map(({ key }) => {
          const categoryItems = items.filter((item) => item.category === key);
          const ownedCount = categoryItems.filter(isOwned).length;
          // 상점에서는 이미 보유한 아이템을 뒤로 보낸다
          const visibleItems =
            mode === "shop"
              ? [...categoryItems].sort((a, b) => Number(isOwned(a)) - Number(isOwned(b)))
              : categoryItems;

          return (
            <div
              key={key}
              ref={(el) => {
                sectionRefs.current[key] = el;
              }}
              className="flex scroll-mt-[18px] flex-col gap-6"
            >
              <h2 className="flex gap-1 text-[13px] font-semibold leading-[1.2] tracking-[-0.3px]">
                <span className="text-gray-700">{tc(key)}</span>
                <span className="text-gray-500">
                  ({ownedCount}/{categoryItems.length})
                </span>
              </h2>

              {isLoading ? (
                <p className="text-[13px] text-gray-500">{t("loading")}</p>
              ) : categoryItems.length === 0 ? (
                <p className="text-[13px] text-gray-500">{t("empty")}</p>
              ) : (
                <ul className={ITEM_GRID}>
                  {visibleItems.map((item) => (
                    <li key={item.id}>
                      <ThynItemCard
                        item={item}
                        mode={mode}
                        selected={equipped[item.category] === item.id}
                        // 옷장은 보유 아이템만 입을 수 있고, 상점은 모두 입혀 볼 수 있다.
                        // 상점에서 입혀 본 미보유 아이템은 옷장에서도 눌러서 벗을 수 있다.
                        onClick={
                          mode === "shop" || isOwned(item) || equipped[item.category] === item.id
                            ? () => onToggleItem(item)
                            : undefined
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
