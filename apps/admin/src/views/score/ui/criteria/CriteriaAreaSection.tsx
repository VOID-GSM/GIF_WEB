"use client";

import type { ScoreCriteriaArea, ScoreCriteriaItem } from "@/entities/score";
import OptionChip from "./OptionChip";
import type { MoveDirection } from "./reorder";

interface Props {
  area: ScoreCriteriaArea;
  canEdit: boolean;
  isFirst: boolean;
  isLast: boolean;
  isReordering: boolean;
  onMoveArea: (direction: MoveDirection) => void;
  onMoveItem: (index: number, direction: MoveDirection) => void;
  onEditArea: () => void;
  onDeleteArea: () => void;
  onAddItem: () => void;
  onEditItem: (item: ScoreCriteriaItem) => void;
  onDeleteItem: (item: ScoreCriteriaItem) => void;
}

const textButtonCx =
  "text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer dark:hover:text-gray-100";
const dangerTextButtonCx =
  "text-xs font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer";
const moveButtonCx =
  "flex h-6 w-6 items-center justify-center rounded-md text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-100";

function MoveButtons({
  canUp,
  canDown,
  disabled,
  label,
  onMove,
}: {
  canUp: boolean;
  canDown: boolean;
  disabled: boolean;
  label: string;
  onMove: (direction: MoveDirection) => void;
}) {
  return (
    <div className="flex shrink-0 gap-0.5">
      <button
        type="button"
        aria-label={`${label} 위로 이동`}
        disabled={!canUp || disabled}
        onClick={() => onMove("up")}
        className={moveButtonCx}
      >
        ▲
      </button>
      <button
        type="button"
        aria-label={`${label} 아래로 이동`}
        disabled={!canDown || disabled}
        onClick={() => onMove("down")}
        className={moveButtonCx}
      >
        ▼
      </button>
    </div>
  );
}

export default function CriteriaAreaSection({
  area,
  canEdit,
  isFirst,
  isLast,
  isReordering,
  onMoveArea,
  onMoveItem,
  onEditArea,
  onDeleteArea,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: Props) {
  return (
    <section className="flex flex-col">
      {/* 영역 헤더 — 점수 테이블 헤더와 같은 노란 띠 */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] dark:bg-[#85782c] dark:border-yellow-500/20">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-[var(--color-gray-800)] dark:text-gray-100">
            {area.name}
          </span>
          <span className="shrink-0 text-xs text-[var(--color-gray-600)] dark:text-gray-200">
            최고점 {area.totalMaxScore}점
          </span>
        </div>
        {canEdit && (
          <div className="flex shrink-0 items-center gap-3">
            <MoveButtons
              canUp={!isFirst}
              canDown={!isLast}
              disabled={isReordering}
              label={`${area.name} 영역`}
              onMove={onMoveArea}
            />
            <button type="button" onClick={onEditArea} className={textButtonCx}>
              수정
            </button>
            <button type="button" onClick={onDeleteArea} className={dangerTextButtonCx}>
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col divide-y divide-[var(--color-gray-100)] dark:divide-gray-800">
        {area.items.length === 0 && (
          <p className="px-4 py-4 text-sm text-gray-400">등록된 항목이 없습니다.</p>
        )}
        {area.items.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-gray-800">{item.name}</span>
              {item.criteria && (
                <span className="text-xs text-gray-500 whitespace-pre-line">{item.criteria}</span>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {item.options.length > 0 ? (
                item.options.map((score) => <OptionChip key={score} score={score} />)
              ) : (
                // #214 이후 만든 항목은 선택지가 비어 있어 채점할 수 없다.
                <span className="rounded-full border border-orange-400 bg-orange-50 px-3 py-[3px] text-[12px] font-semibold text-orange-700">
                  선택지 없음 · 채점 불가
                </span>
              )}
              {canEdit && (
                <div className="ml-2 flex items-center gap-3">
                  <MoveButtons
                    canUp={index > 0}
                    canDown={index < area.items.length - 1}
                    disabled={isReordering}
                    label={`${item.name} 항목`}
                    onMove={(direction) => onMoveItem(index, direction)}
                  />
                  <button type="button" onClick={() => onEditItem(item)} className={textButtonCx}>
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item)}
                    className={dangerTextButtonCx}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {canEdit && (
          <button
            type="button"
            onClick={onAddItem}
            className="px-4 py-3 text-left text-sm font-medium text-yellow-700 hover:bg-yellow-50 transition-colors cursor-pointer dark:text-yellow-300 dark:hover:bg-yellow-500/10"
          >
            + 항목 추가
          </button>
        )}
      </div>
    </section>
  );
}
