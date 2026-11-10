"use client";

import { useState } from "react";
import { EventViewModal, EventFormModal } from "@repo/ui";

export type CalendarEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
};

export type CalendarMode = "write" | "view";

export const PRESET_COLOR_MAP = {
  red: "var(--color-red)",
  orange: "var(--color-orange)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
  blue: "var(--color-blue)",
  purple: "var(--color-purple)",
  gray: "var(--color-gray)",
} as const;

export type PresetColorKey = keyof typeof PRESET_COLOR_MAP;

export function resolveColor(color: string): string {
  return PRESET_COLOR_MAP[color as PresetColorKey] ?? color;
}

/**
 * 캘린더 전용 색상. 디자인 토큰(CSS 변수)을 우선 쓰고, 아직 토큰이 없으면 fallback hex를 쓴다.
 * globals.css의 theme에 아래 변수를 추가하면 이 파일은 수정 없이 토큰 값을 따라간다.
 */
const CAL = {
  highlightBg: "bg-[color:var(--color-calendar-highlight,#FFF2C2)]",
  highlightHoverBg: "hover:bg-[color:var(--color-calendar-highlight,#FFF2C2)]",
  accentBg: "bg-[color:var(--color-calendar-accent,#695C4A)]",
  accentText: "text-[color:var(--color-calendar-accent,#695C4A)]",
  accentHoverText: "hover:text-[color:var(--color-calendar-accent,#695C4A)]",
  guideBg: "bg-[color:var(--color-calendar-guide-bg,#FFFAE8)]",
  guideBorder: "border-[color:var(--color-calendar-guide-border,#F0D98A)]",
  stepBg: "bg-[color:var(--color-calendar-step-bg,#F5E4A8)]",
} as const;

function getDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function DayCell({
  day,
  year,
  month,
  events,
  today,
  selectStart,
  selectEnd,
  hoverDate,
  mode,
  onDayClick,
  onEventClick,
  onHover,
}: {
  day: number;
  year: number;
  month: number;
  events: CalendarEvent[];
  today: string;
  selectStart: string | null;
  selectEnd: string | null;
  hoverDate: string | null;
  mode: CalendarMode;
  onDayClick: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onHover: (dateStr: string | null) => void;
}) {
  const dateStr = getDateStr(year, month, day);
  const isToday = dateStr === today;
  const isWrite = mode === "write";

  const event = events.find(
    (e) => e.startDate <= dateStr && dateStr <= e.endDate,
  );

  const isSelectStart = isWrite && selectStart === dateStr;
  const isSelectEnd = isWrite && selectEnd === dateStr;
  const isSelected = isSelectStart || isSelectEnd;

  // 종료일을 고르기 전에는 hover(또는 포커스) 중인 날짜를 종료일 후보로 본다
  const isPicking = isWrite && Boolean(selectStart) && !selectEnd;
  const previewEnd = isPicking ? hoverDate : null;

  // 시작일보다 앞 날짜에 hover해도 범위가 올바른 방향으로 칠해지도록 정렬
  const [rangeFrom, rangeTo] =
    selectStart && previewEnd
      ? selectStart <= previewEnd
        ? [selectStart, previewEnd]
        : [previewEnd, selectStart]
      : [null, null];

  // 화면에 칠할 범위: 미리보기 > 확정된 범위 > 시작일 하루
  const displayFrom = isWrite ? (rangeFrom ?? selectStart) : null;
  const displayTo = isWrite ? (rangeTo ?? selectEnd ?? selectStart) : null;

  const inRange = Boolean(
    displayFrom && displayTo && displayFrom <= dateStr && dateStr <= displayTo,
  );
  const isRangeStart = inRange && displayFrom === dateStr;
  const isRangeEnd = inRange && displayTo === dateStr;

  // 라벨은 사용자가 클릭한 칸을 "시작"으로 고정하고, hover 칸에만 "종료"를 붙인다
  const endLabelDate = selectEnd ?? previewEnd;
  const labelText = !isWrite
    ? null
    : selectStart === dateStr
      ? "시작"
      : endLabelDate === dateStr
        ? "종료"
        : null;

  const dateLabel = `${month + 1}월 ${day}일`;

  if (event) {
    const colorVar = resolveColor(event.color);
    const isSingle = event.startDate === event.endDate;
    const isStart = event.startDate === dateStr;
    const isEnd = event.endDate === dateStr;

    // 일정 위를 지날 때도 미리보기가 끊기지 않도록 hover 날짜를 갱신한다
    const hoverProps = isWrite
      ? {
          onMouseEnter: () => onHover(dateStr),
          onFocus: () => onHover(dateStr),
          onBlur: () => onHover(null),
        }
      : {};

    if (isSingle) {
      return (
        <button
          type="button"
          aria-label={`${event.title}, ${dateLabel}`}
          className="mx-auto flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10"
          onClick={() => onEventClick(event)}
          {...hoverProps}
        >
          <span
            className="flex items-center justify-center w-7 h-7 text-sm sm:w-[35px] sm:h-[35px] sm:text-[20px] rounded-full cursor-pointer text-gray-900 transition-transform hover:scale-110"
            style={{ border: `2px solid ${colorVar}` }}
          >
            {day}
          </span>
        </button>
      );
    }

    return (
      <button
        type="button"
        aria-label={`${event.title}, ${dateLabel}`}
        className={`flex items-center justify-center h-7 w-full text-sm sm:h-[35px] sm:text-[20px] cursor-pointer text-gray-900 transition-colors hover:brightness-95
          ${isStart ? "rounded-l-full" : ""}
          ${isEnd ? "rounded-r-full" : ""}
        `}
        style={{
          borderTop: `2px solid ${colorVar}`,
          borderBottom: `2px solid ${colorVar}`,
          borderLeft: isStart ? `2px solid ${colorVar}` : "none",
          borderRight: isEnd ? `2px solid ${colorVar}` : "none",
        }}
        onClick={() => onEventClick(event)}
        {...hoverProps}
      >
        {day}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!isWrite}
      aria-label={labelText ? `${dateLabel}, ${labelText}` : dateLabel}
      aria-pressed={isWrite ? isSelected : undefined}
      className={`relative flex items-center justify-center h-7 w-full text-sm sm:h-[35px] sm:text-[20px] transition-all duration-150
        ${isWrite ? "cursor-pointer" : ""}
        ${isWrite && !isPicking ? `${CAL.highlightHoverBg} hover:rounded-full` : ""}
        ${inRange ? CAL.highlightBg : ""}
        ${isRangeStart && isRangeEnd ? "rounded-full" : ""}
        ${isRangeStart && !isRangeEnd ? "rounded-l-full" : ""}
        ${isRangeEnd && !isRangeStart ? "rounded-r-full" : ""}
      `}
      onClick={() => onDayClick(dateStr)}
      onMouseEnter={() => onHover(dateStr)}
      onFocus={() => onHover(dateStr)}
      onBlur={() => onHover(null)}
    >
      {labelText && (
        <span
          className={`pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold leading-none ${CAL.accentText}`}
        >
          {labelText}
        </span>
      )}

      <span
        className={`flex items-center justify-center w-7 h-7 text-sm sm:w-9 sm:h-9 sm:text-[20px] rounded-full transition-all duration-150
          ${
            isSelected
              ? `${CAL.accentBg} text-white font-bold shadow-sm`
              : isToday && !inRange
                ? "bg-yellow-400 text-gray-900 font-semibold"
                : "text-gray-900"
          }
          ${isWrite && !isSelected ? "hover:scale-110" : ""}
        `}
      >
        {day}
      </span>
    </button>
  );
}

const GUIDE = {
  1: { title: "시작일 선택", message: "일정의 시작일을 선택해 주세요." },
  2: {
    title: "종료일 선택",
    message: "시작일이 선택되었어요. 이제 종료일을 선택해 주세요.",
  },
  3: { title: "선택 완료", message: "기간이 선택되었어요." },
} as const;

export default function CalendarField({
  fieldId,
  mode = "write",
  editable = false,
  events: initialEvents = [],
  onChange,
}: {
  fieldId: number;
  mode?: CalendarMode;
  editable?: boolean;
  events?: CalendarEvent[];
  onChange?: (fieldId: number, events: CalendarEvent[]) => void;
}) {
  const todayDate = new Date();

  const todayStr = getDateStr(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate(),
  );

  const [currentMonth, setCurrentMonth] = useState(
    new Date(todayDate.getFullYear(), todayDate.getMonth()),
  );

  const [selectStart, setSelectStart] = useState<string | null>(null);
  const [selectEnd, setSelectEnd] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [viewTarget, setViewTarget] = useState<CalendarEvent | null>(null);

  const [formTarget, setFormTarget] = useState<{
    start: string;
    end: string;
    event?: CalendarEvent;
    isEditing: boolean;
  } | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(year, month + (i - 3));

    return {
      label: `${d.getMonth() + 1}월`,
      year: d.getFullYear(),
      month: d.getMonth(),
    };
  });

  const handleDayClick = (dateStr: string) => {
    if (!selectStart || (selectStart && selectEnd)) {
      setSelectStart(dateStr);
      setSelectEnd(null);
    } else {
      const start = selectStart <= dateStr ? selectStart : dateStr;
      const end = selectStart <= dateStr ? dateStr : selectStart;

      setSelectStart(start);
      setSelectEnd(end);
      setHoverDate(null);
      setFormTarget({ start, end, isEditing: false });
    }
  };

  const handleSelectCancel = () => {
    setSelectStart(null);
    setSelectEnd(null);
    setHoverDate(null);
  };

  const handleEditRequest = () => {
    if (!viewTarget) return;

    setFormTarget({
      start: viewTarget.startDate,
      end: viewTarget.endDate,
      event: viewTarget,
      isEditing: true,
    });

    setViewTarget(null);
  };

  const handleDeleteRequest = () => {
    if (!viewTarget) return;

    const updated = initialEvents.filter((e) => e.id !== viewTarget.id);

    onChange?.(fieldId, updated);
    setViewTarget(null);
  };

  const handleFormSubmit = (title: string, color: string) => {
    if (!formTarget) return;

    const targetEvent = formTarget.event;

    const updated = targetEvent
      ? initialEvents.map((e) =>
          e.id === targetEvent.id ? { ...e, title, color } : e,
        )
      : [
          ...initialEvents,
          {
            id: generateId(),
            title,
            startDate: formTarget.start,
            endDate: formTarget.end,
            color,
          },
        ];

    onChange?.(fieldId, updated);

    setFormTarget(null);
    setSelectStart(null);
    setSelectEnd(null);
  };

  const handleFormCancel = () => {
    setFormTarget(null);
  };

  const handleFormClose = () => {
    setFormTarget(null);
    setSelectStart(null);
    setSelectEnd(null);
  };

  const guideStep = !selectStart ? 1 : !selectEnd ? 2 : 3;
  const guide = GUIDE[guideStep];

  return (
    <>
      {viewTarget && (
        <EventViewModal
          event={viewTarget}
          editable={editable}
          onClose={() => setViewTarget(null)}
          onEdit={handleEditRequest}
          onDelete={handleDeleteRequest}
        />
      )}

      {formTarget && (
        <EventFormModal
          startDate={formTarget.start}
          endDate={formTarget.end}
          initialTitle={formTarget.event?.title}
          initialColor={formTarget.event?.color}
          submitLabel={formTarget.isEditing ? "수정하기" : "추가하기"}
          showCancel={formTarget.isEditing}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          onClose={handleFormClose}
        />
      )}

      {mode === "write" && (
        <div
          role="status"
          className={`mb-4 flex items-center gap-3 rounded-lg border px-3 py-3 sm:px-4 ${CAL.guideBorder} ${CAL.guideBg}`}
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${CAL.stepBg} ${CAL.accentText}`}
          >
            {guideStep}
          </div>

          <div className="min-w-0">
            <p
              className={`text-sm font-semibold sm:text-base ${CAL.accentText}`}
            >
              {guide.title}
            </p>

            <p className="text-xs text-gray-600 sm:text-sm">{guide.message}</p>
          </div>

          {guideStep === 2 && (
            <button
              type="button"
              onClick={handleSelectCancel}
              className={`ml-auto shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 sm:text-sm ${CAL.accentBg}`}
            >
              선택 취소
            </button>
          )}
        </div>
      )}

      <div className="mb-4 text-center text-lg text-gray-900 sm:text-[20px]">
        {year}
      </div>

      <div className="mb-[10px] flex items-center justify-between">
        <button
          className={`cursor-pointer px-1 text-gray-500 transition-colors sm:px-2 sm:pl-6 ${CAL.accentHoverText}`}
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          aria-label="이전 달"
        >
          {"<"}
        </button>

        <div className="flex items-center gap-2 text-sm sm:gap-[27px] sm:text-base">
          {monthLabels.map((m, i) => (
            <span
              key={i}
              onClick={() => setCurrentMonth(new Date(m.year, m.month))}
              className={`cursor-pointer transition-colors ${CAL.accentHoverText} ${
                i === 3 ? "font-semibold text-black" : "text-gray-500"
              }`}
            >
              {m.label}
            </span>
          ))}
        </div>

        <button
          className={`cursor-pointer px-1 text-gray-500 transition-colors sm:px-2 sm:pr-6 ${CAL.accentHoverText}`}
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          aria-label="다음 달"
        >
          {">"}
        </button>
      </div>

      <div className="rounded-[10px] px-3 py-4 shadow-[0_0_6px_0_#E2E2E2] sm:px-22 sm:py-5">
        <div
          className={`grid grid-cols-7 text-center ${
            mode === "write" ? "mb-3 sm:mb-2" : "mb-2"
          }`}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className="mx-auto flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-900 sm:h-10 sm:w-10 sm:text-[20px]"
            >
              {d}
            </div>
          ))}
        </div>

        {/* write 모드는 날짜 위에 "시작/종료" 라벨이 놓이므로 모바일 행 간격을 넓힌다 */}
        <div
          className={`grid grid-cols-7 sm:gap-y-[18px] ${
            mode === "write" ? "gap-y-4" : "gap-y-2"
          }`}
          onMouseLeave={() => setHoverDate(null)}
        >
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="mx-auto h-8 w-8 sm:h-10 sm:w-10" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <DayCell
              key={day}
              day={day}
              year={year}
              month={month}
              events={initialEvents}
              today={todayStr}
              selectStart={selectStart}
              selectEnd={selectEnd}
              hoverDate={hoverDate}
              mode={mode}
              onDayClick={handleDayClick}
              onEventClick={setViewTarget}
              onHover={setHoverDate}
            />
          ))}
        </div>
      </div>
    </>
  );
}
