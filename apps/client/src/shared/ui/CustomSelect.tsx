"use client";

import { useEffect, useRef, useState } from "react";

export interface CustomSelectOption<T extends string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string> {
  id?: string;
  value: T;
  options: CustomSelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * 네이티브 <select>는 옵션 목록의 스타일을 커스텀할 수 없어(브라우저 기본 렌더링)
 * 라이트/다크 테마와 어울리지 않는 문제가 있어 만든 대체 컴포넌트.
 */
export default function CustomSelect<T extends string>({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  className = "",
  triggerClassName = "",
  panelClassName = "",
  size = "md",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const paddingClass =
    size === "sm" ? "py-1.5" : size === "lg" ? "py-2.5" : "py-2";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-[10px] border border-gray-200 bg-white pl-3 pr-2.5 text-[13px] font-medium text-gray-700 outline-none transition-colors focus-visible:border-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 ${paddingClass} ${
          isOpen ? "border-yellow-600" : "hover:border-gray-300"
        } ${triggerClassName}`}
      >
        <span className="truncate">{selected?.label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className={`animate-fade-in-up thin-scrollbar absolute left-0 top-[calc(100%+4px)] z-20 max-h-60 w-full min-w-max origin-top overflow-auto rounded-[10px] border border-gray-200 bg-white p-1 shadow-lg ${panelClassName}`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`block w-full cursor-pointer whitespace-nowrap rounded-[8px] px-3 py-2 text-left text-[13px] font-medium transition-colors active:brightness-95 ${
                    isSelected
                      ? "bg-yellow-50 text-yellow-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
