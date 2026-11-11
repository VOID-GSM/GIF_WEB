"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import Chevron from "../../svg/Chevron";
import type { Grade } from "../GradeSelector/GradeSelector";

const GRADE_OPTIONS: Grade[] = [1, 2];

interface GradeDropdownProps {
  grade: Grade;
  onGradeChange: (grade: Grade) => void;
}

export default function GradeDropdown({
  grade,
  onGradeChange,
}: GradeDropdownProps) {
  const t = useTranslations("grade");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const selectedLabel = t("label", { grade });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex w-fit cursor-pointer items-center gap-1 rounded-[8px] border border-gray-500 bg-white px-[10px] py-[6.5px] text-[12px] text-gray-500"
      >
        {selectedLabel}
        <Chevron
          className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>
      {dropdownOpen && (
        <ul className="absolute top-full left-0 z-20 mt-1 min-w-[100px] overflow-hidden rounded-lg bg-white shadow-[var(--shadow-new)]">
          {GRADE_OPTIONS.map((value) => (
            <li key={value}>
              <button
                onClick={() => {
                  onGradeChange(value);
                  setDropdownOpen(false);
                }}
                className={`w-full cursor-pointer px-4 py-2 text-left text-xs font-medium hover:bg-[var(--color-gray-100)] dark:hover:bg-gray-800 ${
                  grade === value
                    ? "text-[var(--color-gray-900)] dark:text-white"
                    : "text-[var(--color-gray-600)] dark:text-gray-400"
                }`}
              >
                {t("label", { grade: value })}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
