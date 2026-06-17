"use client";
import { useState, useEffect } from "react";
import Logout from "./svg/Logout";
import Chevron from "./svg/Chevron";

export interface MypageInfoItem {
  key: string;
  label: string;
  value: string;
  type?: "readonly" | "input" | "dropdown";
  dropdownOptions?: string[];
  placeholder?: string;
}

export interface MypageCardProps {
  items: MypageInfoItem[];
  onLogout?: () => void;
  onEdit?: (updatedValues: Record<string, string>) => void;
}

export default function MypageCard({
  items,
  onLogout,
  onEdit,
}: MypageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isEditing) {
      const init: Record<string, string> = {};
      items.forEach((item) => {
        init[item.key] = item.value;
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

  const handleEditSave = () => {
    if (isEditing) onEdit?.(editValues);
    setIsEditing((prev) => !prev);
  };

  const renderValue = (item: MypageInfoItem) => {
    if (!isEditing || item.type === "readonly") {
      const display = editValues[item.key] || item.value;
      return (
        <span className={display ? undefined : "text-gray-400"}>
          {display || item.placeholder}
        </span>
      );
    }

    if (item.type === "input") {
      return (
        <input
          className="w-full focus:outline-none placeholder:text-gray-400"
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
        <div className="relative w-full cursor-pointer dropdown-container">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdown(isOpen ? null : item.key);
            }}
            className="flex items-center justify-between w-full text-left text-[20px] font-medium leading-[1.2] tracking-[-0.5px] text-gray-700"
          >
            {editValues[item.key] ?? ""}
            <Chevron
              direction={isOpen ? "up" : "down"}
              className="transition-transform duration-300"
            />
          </button>

          {isOpen && (
            <ul className="absolute left-0 top-9 z-10 w-[calc(100%+17px)] bg-background shadow-new rounded-[4px]">
              {options.map((option) => (
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
                    className="w-full text-left text-[12px] px-[10px] py-3 leading-[1.2] tracking-[-0.5px] text-black hover:bg-gray-100"
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  };

  return (
    <section className="w-full max-w-[720px] rounded-[20px] bg-white px-6 py-10 shadow-new md:px-[108px]">
      <div className="flex w-full flex-col items-center justify-center gap-[55px]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-center text-[24px] font-medium leading-[1.2] tracking-[-0.6px] text-black">
            프로필 정보
          </h2>
          <button
            type="button"
            onClick={onLogout}
            className="flex cursor-pointer items-center gap-[18px] text-gray-600"
          >
            <span className="text-center text-[16px] font-medium leading-[1.2] tracking-[-0.4px]">
              로그아웃
            </span>
            <Logout className="h-[15px] w-[18px]" aria-hidden="true" />
          </button>
        </div>

        <dl className="flex w-full flex-col text-[20px] font-medium leading-[1.2] tracking-[-0.5px] text-gray-700">
          {items.map((item) => (
            <div
              key={item.label}
              className="relative flex w-full items-center justify-between border-b border-gray-200 py-3 px-[17px]"
            >
              <dt className="w-[56px] shrink-0 text-right">{item.label}</dt>
              <dd className="min-w-0 flex-1 pl-8 sm:w-[254px] sm:flex-none sm:pl-0">
                {renderValue(item)}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={handleEditSave}
          className="h-10 w-[120px] cursor-pointer rounded-[32px] bg-yellow-600 text-center text-[16px] font-semibold leading-[1.2] tracking-[-0.32px] text-black"
        >
          {isEditing ? "저장하기" : "수정하기"}
        </button>
      </div>
    </section>
  );
}
