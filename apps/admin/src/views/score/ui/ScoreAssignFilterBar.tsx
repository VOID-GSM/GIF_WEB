"use client";

import { useState, useRef, useEffect } from "react";
import { Chevron, GrantButton } from "@repo/ui";
import type { GrantStatus } from "@repo/ui";
import { SORT_LABELS } from "./constants";
import type { SortOrder, ScoreFilter } from "./constants";

const LEGEND = [
  { dot: "bg-green-50 border-green-500",   label: "점수 부여 완료" },
  { dot: "bg-orange-50 border-orange-400", label: "점수 미부여"   },
  { dot: "bg-gray-100 border-gray-300",    label: "해당 없음"     },
];

interface Props {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  scoreFilter: ScoreFilter;
  onFilterChange: (filter: ScoreFilter) => void;
}

export default function ScoreAssignFilterBar({
  sortOrder,
  onSortChange,
  scoreFilter,
  onFilterChange,
}: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 w-full">
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => setSortOpen((prev) => !prev)}
          className="flex items-center gap-1 w-fit py-[6.5px] px-[10px] rounded-[8px] text-[12px] border border-gray-500 text-gray-500 bg-white cursor-pointer"
        >
          {SORT_LABELS[sortOrder]}
          <Chevron className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
        </button>
        {sortOpen && (
          <ul className="absolute top-full mt-1 left-0 z-10 bg-white rounded-lg shadow-[var(--shadow-new)] overflow-hidden min-w-[100px]">
            {(Object.entries(SORT_LABELS) as [SortOrder, string][]).map(([key, label]) => (
              <li key={key}>
                <button
                  onClick={() => { onSortChange(key); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-[var(--color-gray-100)] cursor-pointer ${
                    sortOrder === key ? "text-[var(--color-gray-900)]" : "text-[var(--color-gray-600)]"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {(["ungranted", "granted"] as GrantStatus[]).map((status) => {
        const filter: ScoreFilter = status === "ungranted" ? "incomplete" : "complete";
        return (
          <GrantButton
            key={status}
            status={status}
            isActive={scoreFilter === filter}
            onClick={() => onFilterChange(scoreFilter === filter ? "all" : filter)}
          />
        );
      })}
      <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-x-4 text-xs text-gray-500">
        {LEGEND.map(({ dot, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full border inline-block ${dot}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
