"use client";
import { useState, useEffect } from "react";
import Logout from "./svg/Logout";
import Chevron from "./svg/Chevron";

export interface MypageInfoItem {
  key: string;
  label: string;
  value: string;
  editValue?: string;
  type?: "readonly" | "input" | "dropdown";
  dropdownOptions?: string[];
  placeholder?: string;
}

export interface MypageCardProps {
  items: MypageInfoItem[];
  onLogout?: () => void;
  onEdit?: (updatedValues: Record<string, string>) => void;
  /** 이름 옆에 작게 붙는 텍스트 (예: "선생님") */
  nameSuffix?: string;
}

export default function MypageCard({
  items,
  onLogout,
  onEdit,
  nameSuffix,
}: MypageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isEditing) {
      const init: Record<string, string> = {};
      items.forEach((item) => {
        init[item.key] = item.editValue ?? item.value;
      });
      setEditValues(init);
    }
  }, [items, isEditing]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if ((e.target as Element).closest(".dropdown-container")) return;
      setOpenDropdown(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSave = () => {
    onEdit?.(editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setOpenDropdown(null);
    setIsEditing(false); // editValues는 effect가 초기값으로 되돌린다
  };

  // 이름은 상단 타이틀로 보여주고, 목록에서는 제외한다.
  const nameItem = items.find((i) => i.key === "name");
  const listItems = items.filter((i) => i.key !== "name");
  const editable = items.some(
    (i) => i.type === "input" || i.type === "dropdown",
  );

  const name = (nameItem?.value ?? "").trim();

  const renderValue = (item: MypageInfoItem) => {
    if (!isEditing || item.type === "readonly") {
      const display = editValues[item.key] || item.value;
      return (
        <span
          className={`text-[16px] ${display && display !== "-" ? "text-gray-700" : "text-gray-400"}`}
        >
          {display && display !== "-" ? display : (item.placeholder ?? "-")}
        </span>
      );
    }

    if (item.type === "input") {
      return (
        <input
          autoFocus
          className="w-full rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-[16px] text-gray-700 transition-colors focus:border-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600/40 placeholder:text-gray-400"
          value={editValues[item.key] ?? ""}
          placeholder={item.placeholder}
          onChange={(e) =>
            setEditValues((prev) => ({ ...prev, [item.key]: e.target.value }))
          }
        />
      );
    }

    if (item.type === "dropdown") {
      const isOpen = openDropdown === item.key;
      const options = item.dropdownOptions ?? [];

      return (
        <div className="dropdown-container relative w-full">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(isOpen ? null : item.key);
            }}
            className={`flex w-full items-center justify-between rounded-[10px] border bg-white px-3 py-2 text-left text-[16px] text-gray-700 transition-colors ${
              isOpen
                ? "border-yellow-700 ring-2 ring-yellow-600/40"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {editValues[item.key] || "선택"}
            <Chevron
              direction={isOpen ? "up" : "down"}
              className="h-4 w-4 text-gray-500 transition-transform duration-300"
            />
          </button>

          {isOpen && (
            <ul className="absolute left-0 top-[calc(100%+6px)] z-10 w-full overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-new">
              {options.map((option) => {
                const selected = editValues[item.key] === option;
                return (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditValues((prev) => ({
                          ...prev,
                          [item.key]: option,
                        }));
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-yellow-50 ${
                        selected
                          ? "font-semibold text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {option}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    }
  };

  return (
    <section className="w-full max-w-[440px] rounded-[28px] bg-white px-8 py-9 shadow-new">
      {/* 헤더 — 이름 */}
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-medium text-gray-400">내 프로필</span>
        <h2 className="flex items-baseline gap-1.5 text-[24px] font-semibold tracking-[-0.5px] text-gray-900">
          {name && name !== "-" ? name : "프로필"}
          {nameSuffix && (
            <span className="text-[14px] font-medium text-gray-400">
              {nameSuffix}
            </span>
          )}
        </h2>
      </div>

      {/* 정보 목록 */}
      <dl className="mt-8 flex flex-col">
        {listItems.map((item, idx) => (
          <div
            key={item.key}
            className={`relative flex min-h-[64px] w-full items-center justify-between gap-4 py-3 ${
              idx !== listItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <dt className="shrink-0 text-[15px] font-medium text-gray-400">
              {item.label}
            </dt>
            <dd className="flex min-w-0 flex-1 justify-end text-right font-medium">
              {renderValue(item)}
            </dd>
          </div>
        ))}
      </dl>

      {/* 액션 버튼 */}
      <div className="mt-8 flex flex-col gap-2.5">
        {isEditing ? (
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleCancel}
              className="h-[48px] flex-1 cursor-pointer rounded-[14px] border border-gray-300 text-[15px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-[48px] flex-1 cursor-pointer rounded-[14px] bg-yellow-600 text-[15px] font-semibold text-gray-900 shadow-sm transition-all hover:bg-yellow-400 active:scale-[0.98]"
            >
              저장하기
            </button>
          </div>
        ) : (
          <>
            {editable && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="h-[48px] w-full cursor-pointer rounded-[14px] bg-yellow-600 text-[15px] font-semibold text-gray-900 shadow-sm transition-all hover:bg-yellow-400 active:scale-[0.98]"
              >
                수정하기
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-gray-100 text-[15px] font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700"
            >
              <Logout className="h-[15px] w-[18px]" aria-hidden="true" />
              로그아웃
            </button>
          </>
        )}
      </div>
    </section>
  );
}
