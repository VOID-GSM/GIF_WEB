"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

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
  // 좁은 화면(lg 미만)에서 펼쳐 둔 카테고리. 넓은 화면에서는 항상 모두 펼친다.
  const [openCategories, setOpenCategories] = useState<Set<ThynCategory>>(
    () => new Set<ThynCategory>(["hair"]),
  );
  const sectionRefs = useRef<Partial<Record<ThynCategory, HTMLElement | null>>>({});
  // 탭을 누른 뒤 스크롤할 카테고리. 펼침 상태가 DOM에 반영된 뒤에 스크롤해야 위치가 어긋나지 않는다.
  const pendingScrollRef = useRef<ThynCategory | null>(null);

  useEffect(() => {
    const category = pendingScrollRef.current;
    if (!category) return;
    pendingScrollRef.current = null;
    sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [openCategories]);

  // 왼쪽 탭으로 고르면 그 카테고리만 펼쳐서 아래로 길게 내리지 않아도 되게 한다
  const handleCategoryClick = (category: ThynCategory) => {
    pendingScrollRef.current = category;
    setActiveCategory(category);
    setOpenCategories(new Set([category]));
  };

  const toggleCategory = (category: ThynCategory) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
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
          const isOpen = openCategories.has(key);
          const contentId = `thyn-closet-${mode}-${key}`;

          return (
            <div
              key={key}
              ref={(el) => {
                sectionRefs.current[key] = el;
              }}
              className={`flex scroll-mt-[18px] flex-col lg:gap-6 ${isOpen ? "gap-6" : ""}`}
            >
              <h2 className="text-[13px] font-semibold leading-[1.2] tracking-[-0.3px]">
                {/* 접기·펴기는 좁은 화면에서만 동작한다 */}
                <button
                  type="button"
                  onClick={() => toggleCategory(key)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="flex w-full cursor-pointer items-center gap-1 text-left lg:pointer-events-none lg:cursor-default"
                >
                  <span className="text-gray-700">{tc(key)}</span>
                  <span className="text-gray-500">
                    ({ownedCount}/{categoryItems.length})
                  </span>
                  <ChevronIcon
                    className={`ml-auto h-4 w-4 text-gray-500 transition-transform lg:hidden ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h2>

              <div id={contentId} className={isOpen ? "" : "max-lg:hidden"}>
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
