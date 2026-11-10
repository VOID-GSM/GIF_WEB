"use client";

import { useEffect, useRef, useState } from "react";

import { Chevron } from "@repo/ui";
import { GRADES, type GradeFilterValue } from "@/entities/project";

// 전체를 맨 앞에 두고 1학년, 2학년 순으로 보여준다
const OPTIONS: readonly GradeFilterValue[] = ["all", ...GRADES];

function getLabel(value: GradeFilterValue) {
  return value === "all" ? "전체" : `${value}학년`;
}

interface GradeFilterProps {
  value: GradeFilterValue;
  onChange: (grade: GradeFilterValue) => void;
}

export default function GradeFilter({ value, onChange }: GradeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[40px] w-[120px] cursor-pointer items-center justify-between rounded-[32px] border border-gray-300 bg-white px-4 text-[16px] font-medium text-gray-600 transition-colors hover:border-gray-400"
      >
        {getLabel(value)}
        <Chevron
          direction={isOpen ? "up" : "down"}
          className="h-4 w-4 text-gray-400 transition-transform duration-200"
        />
      </button>

      {isOpen && (
        <ul className="absolute top-[calc(100%+6px)] left-0 z-10 w-[120px] overflow-hidden rounded-[16px] border border-gray-100 bg-white shadow-new">
          {OPTIONS.map((option) => {
            const selected = option === value;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-yellow-50 ${
                    selected ? "font-semibold text-gray-900" : "text-gray-600"
                  }`}
                >
                  {getLabel(option)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
