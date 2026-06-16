"use client";

import { ScoreButton, LabelBadge } from "@repo/ui";
import { SCORES } from "./constants";
import type { CriterionRow, ScoreValue } from "./constants";

interface Props {
  isLoading: boolean;
  rows: CriterionRow[];
  onSelectScore: (key: string, score: ScoreValue) => void;
  onToggleComplete: (key: string) => void;
}

const TABLE_HEADERS = ["평가 항목", "점수", "작업"];

export default function ScoreAreaTable({ isLoading, rows, onSelectScore, onToggleComplete }: Props) {
  if (isLoading) {
    return <p className="py-10 text-center text-gray-400">불러오는 중...</p>;
  }

  return (
    <>
      {/* 모바일: 항목별 카드 레이아웃 */}
      <div className="sm:hidden divide-y divide-[var(--color-gray-100)]">
        {rows.map((row) => (
          <div key={row.key} className="py-3 flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">{row.label}</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {SCORES.map((score) => (
                  <ScoreButton
                    key={score}
                    score={score}
                    variant={row.selectedScore === score ? "active" : "inactive"}
                    onClick={() => { if (!row.isComplete) onSelectScore(row.key, score); }}
                  />
                ))}
              </div>
              <button
                onClick={() => onToggleComplete(row.key)}
                className="ml-auto w-fit cursor-pointer"
                disabled={row.selectedScore === null}
              >
                <LabelBadge
                  status={row.isComplete ? "complete" : "edit"}
                  variant={row.isComplete ? "active" : "inactive"}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* sm 이상: 그리드 테이블 레이아웃 */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <div className="grid grid-cols-[1fr_180px_80px] gap-4 px-4 py-2.5 bg-orange-50 border-b border-t border-orange-400 min-w-[460px]">
          {TABLE_HEADERS.map((h) => (
            <span key={h} className="font-semibold text-gray-700 text-sm">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-[var(--color-gray-100)] min-w-[460px]">
          {rows.map((row) => (
            <div key={row.key} className="grid grid-cols-[1fr_180px_80px] gap-4 px-4 py-3 items-center">
              <span className="text-sm font-medium text-gray-800">{row.label}</span>
              <div className="flex gap-1.5">
                {SCORES.map((score) => (
                  <ScoreButton
                    key={score}
                    score={score}
                    variant={row.selectedScore === score ? "active" : "inactive"}
                    onClick={() => { if (!row.isComplete) onSelectScore(row.key, score); }}
                  />
                ))}
              </div>
              <button
                onClick={() => onToggleComplete(row.key)}
                className="w-fit cursor-pointer"
                disabled={row.selectedScore === null}
              >
                <LabelBadge
                  status={row.isComplete ? "complete" : "edit"}
                  variant={row.isComplete ? "active" : "inactive"}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
