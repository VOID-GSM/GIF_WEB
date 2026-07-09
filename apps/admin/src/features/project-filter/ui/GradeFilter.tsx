"use client";

import { useEffect, useRef, useState } from "react";

import { Chevron } from "@repo/ui";
import { GRADES, type Grade } from "@/entities/project";

interface GradeFilterProps {
  value: Grade;
  onChange: (grade: Grade) => void;
}

export default function GradeFilter({ value, onChange }: GradeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[40px] w-[120px] cursor-pointer items-center justify-between rounded-[32px] border border-gray-300 bg-white px-4 text-[16px] font-medium text-gray-600 transition-colors hover:border-gray-400"
      >
        {value}학년
        <Chevron
          direction={isOpen ? "up" : "down"}
          className="h-4 w-4 text-gray-400 transition-transform duration-200"
        />
      </button>

      {isOpen && (
        <ul className="absolute top-[calc(100%+6px)] left-0 z-10 w-[120px] overflow-hidden rounded-[16px] border border-gray-100 bg-white shadow-new">
          {GRADES.map((grade) => {
            const selected = grade === value;
            return (
              <li key={grade}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(grade);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-yellow-50 ${
                    selected ? "font-semibold text-gray-900" : "text-gray-600"
                  }`}
                >
                  {grade}학년
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
