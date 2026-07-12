"use client";

import { useEffect, useRef, useState } from "react";

import Chevron from "../../svg/Chevron";
import type { Grade } from "../GradeSelector/GradeSelector";

const GRADE_OPTIONS: { value: Grade; label: string }[] = [
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
];

interface GradeDropdownProps {
  grade: Grade;
  onGradeChange: (grade: Grade) => void;
}

export default function GradeDropdown({
  grade,
  onGradeChange,
}: GradeDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    GRADE_OPTIONS.find((o) => o.value === grade)?.label ?? "1학년";

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
          {GRADE_OPTIONS.map(({ value, label }) => (
            <li key={value}>
              <button
                onClick={() => {
                  onGradeChange(value);
                  setDropdownOpen(false);
                }}
                className={`w-full cursor-pointer px-4 py-2 text-left text-xs font-medium hover:bg-[var(--color-gray-100)] ${
                  grade === value
                    ? "text-[var(--color-gray-900)]"
                    : "text-[var(--color-gray-600)]"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
