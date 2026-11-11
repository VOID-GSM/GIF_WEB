"use client";

import { ScoreButton } from "@repo/ui";
import type { GradeAreaSection, GradeItemRow } from "./useItemGrade";

interface Props {
  sections: GradeAreaSection[];
  onSelectScore: (itemId: number, score: number) => void;
}

function ItemScoreCell({
  item,
  onSelectScore,
}: {
  item: GradeItemRow;
  onSelectScore: Props["onSelectScore"];
}) {
  if (item.options.length === 0) {
    return <span className="text-xs text-orange-700">선택지가 없어 채점할 수 없습니다.</span>;
  }
  // 채점 후 선택지가 바뀌어 기존 점수가 선택지에 없을 수 있다.
  const isStale = item.selectedScore !== null && !item.options.includes(item.selectedScore);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-1.5">
        {item.options.map((score) => (
          <ScoreButton
            key={score}
            score={score}
            variant={item.selectedScore === score ? "active" : "inactive"}
            onClick={() => onSelectScore(item.id, score)}
          />
        ))}
      </div>
      {isStale && (
        <span className="text-[11px] text-orange-700">
          기존 점수 {item.selectedScore}점 · 현재 선택지에 없음
        </span>
      )}
    </div>
  );
}

export default function ItemGradeTable({ sections, onSelectScore }: Props) {
  if (sections.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">등록된 평가 기준이 없습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <section key={section.id} className="flex flex-col">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] dark:bg-[#85782c] dark:border-yellow-500/20">
            <span className="truncate text-sm font-semibold text-[var(--color-gray-800)] dark:text-gray-100">
              {section.name}
            </span>
            <span className="shrink-0 text-xs font-semibold text-[var(--color-gray-700)] dark:text-gray-100">
              {section.totalScore} / {section.totalMaxScore}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-[var(--color-gray-100)] dark:divide-gray-800">
            {section.items.length === 0 && (
              <p className="px-4 py-4 text-sm text-gray-400">등록된 항목이 없습니다.</p>
            )}
            {section.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 px-4 py-3 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                    {item.name}
                    {item.isChanged && (
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-600" aria-label="변경됨" />
                    )}
                  </span>
                  {item.criteria && (
                    <span className="text-xs text-gray-500 whitespace-pre-line">{item.criteria}</span>
                  )}
                </div>
                <ItemScoreCell item={item} onSelectScore={onSelectScore} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
