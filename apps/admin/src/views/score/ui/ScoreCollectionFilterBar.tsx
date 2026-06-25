"use client";

import { useState, useRef, useEffect } from "react";
import { Chevron } from "@repo/ui";
import type { Grade } from "@/entities/project";

const GRADE_OPTIONS: { value: Grade; label: string }[] = [
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
];

interface Props {
  grade: Grade;
  onGradeChange: (grade: Grade) => void;
  canNotice: boolean;
  isNoticing: boolean;
  onNotice: () => void;
}

export default function ScoreCollectionFilterBar({
  grade,
  onGradeChange,
  canNotice,
  isNoticing,
  onNotice,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = GRADE_OPTIONS.find((o) => o.value === grade)?.label ?? "1학년";

  return (
    <div className="flex items-center justify-between mb-4 sm:mb-5">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1 w-fit py-[6.5px] px-[10px] rounded-[8px] text-[12px] border border-gray-500 text-gray-500 bg-white cursor-pointer"
        >
          {selectedLabel}
          <Chevron className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {dropdownOpen && (
          <ul className="absolute top-full mt-1 left-0 z-20 bg-white rounded-lg shadow-[var(--shadow-new)] overflow-hidden min-w-[100px]">
            {GRADE_OPTIONS.map(({ value, label }) => (
              <li key={value}>
                <button
                  onClick={() => { onGradeChange(value); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-[var(--color-gray-100)] cursor-pointer ${
                    grade === value ? "text-[var(--color-gray-900)]" : "text-[var(--color-gray-600)]"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {canNotice && (
        <button
          type="button"
          disabled={isNoticing}
          onClick={onNotice}
          className="py-[6.5px] px-[20px] rounded-[8px] text-[12px] bg-yellow-600 hover:bg-yellow-700 text-black font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isNoticing ? "공지 중..." : "공지하기"}
        </button>
      )}
    </div>
  );
}
