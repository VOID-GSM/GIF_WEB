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
  hoverDate, // 추가: 마우스가 올라간 날짜
  mode,
  onDayClick,
  onEventClick,
  onHover, // 추가: hover 날짜 변경
}: {
  day: number;
  year: number;
  month: number;
  events: CalendarEvent[];
  today: string;
  selectStart: string | null;
  selectEnd: string | null;
  hoverDate: string | null; // 추가
  mode: CalendarMode;
  onDayClick: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onHover: (dateStr: string | null) => void; // 추가
}) {
  const dateStr = getDateStr(year, month, day);
  const isToday = dateStr === today;

  const event = events.find(
    (e) => e.startDate <= dateStr && dateStr <= e.endDate,
  );

  const inSelectRange = Boolean(
    mode === "write" &&
    selectStart &&
    selectEnd &&
    selectStart <= dateStr &&
    dateStr <= selectEnd,
  );

  const isSelectStart = mode === "write" && selectStart === dateStr;
  const isSelectEnd = mode === "write" && selectEnd === dateStr;
  const isSelected = isSelectStart || isSelectEnd;

  // 추가: 시작일만 고른 상태에서 hover 중이면 범위를 미리 계산
  const previewEnd =
    mode === "write" && selectStart && !selectEnd ? hoverDate : null;

  const [rangeFrom, rangeTo] =
    selectStart && previewEnd
      ? selectStart <= previewEnd
        ? [selectStart, previewEnd]
        : [previewEnd, selectStart]
      : [null, null];

  const inPreview = Boolean(
    rangeFrom && rangeTo && rangeFrom <= dateStr && dateStr <= rangeTo,
  );

  // 추가: "시작" / "종료" 라벨 표시 여부
  const startLabelDate = rangeFrom ?? selectStart;
  const endLabelDate = rangeTo ?? selectEnd;

  const showStartLabel = mode === "write" && startLabelDate === dateStr;
  const showEndLabel =
    mode === "write" &&
    endLabelDate === dateStr &&
    endLabelDate !== startLabelDate;

  const cell =
    "flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 mx-auto";

  if (event) {
    const colorVar = resolveColor(event.color);
    const isSingle = event.startDate === event.endDate;
    const isStart = event.startDate === dateStr;
    const isEnd = event.endDate === dateStr;

    if (isSingle) {
      return (
        <div className={cell} onClick={() => onEventClick(event)}>
          <span
            className="flex items-center justify-center w-7 h-7 text-sm sm:w-[35px] sm:h-[35px] sm:text-[20px] rounded-full cursor-pointer text-gray-900 transition-transform hover:scale-110"
            style={{ border: `2px solid ${colorVar}` }}
          >
            {day}
          </span>
        </div>
      );
    }

    return (
      <div
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
      >
        {day}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center h-7 w-full text-sm sm:h-[35px] sm:text-[20px] transition-all duration-150
        ${mode === "write" ? "cursor-pointer hover:bg-[#FFF2C2] hover:rounded-full" : ""}
        ${inSelectRange || inPreview ? "bg-[#FFF2C2]" : ""}
        ${isSelectStart && !isSelectEnd ? "rounded-l-full bg-[#FFF2C2]" : ""}
        ${isSelectEnd && !isSelectStart ? "rounded-r-full bg-[#FFF2C2]" : ""}
        ${isSelectStart && isSelectEnd ? "rounded-full bg-[#FFF2C2]" : ""}
      `}
      onClick={() => mode === "write" && onDayClick(dateStr)}
      onMouseEnter={() => mode === "write" && onHover(dateStr)}
    >
      {showStartLabel && (
        <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-[#695C4A]">
          시작
        </span>
      )}

      {showEndLabel && (
        <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-[#695C4A]">
          종료
        </span>
      )}

      <span
        className={`flex items-center justify-center w-7 h-7 text-sm sm:w-9 sm:h-9 sm:text-[20px] rounded-full transition-all duration-150
          ${
            isSelected
              ? "bg-[#695C4A] text-white font-bold shadow-sm"
              : isToday && !inSelectRange
                ? "bg-yellow-400 text-gray-900 font-semibold"
                : "text-gray-900"
          }
          ${mode === "write" && !isSelected ? "hover:scale-110" : ""}
        `}
      >
        {day}
      </span>
    </div>
  );
}

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
  const [hoverDate, setHoverDate] = useState<string | null>(null); // 추가
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
      setHoverDate(null); // 추가: 종료일을 고르면 미리보기 해제
      setFormTarget({ start, end, isEditing: false });
    }
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

  const guideMessage = selectStart
    ? "시작일이 선택되었어요. 이제 종료일을 선택해 주세요."
    : "일정의 시작일을 선택해 주세요.";

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
          className="mb-4 flex items-center gap-3 rounded-lg border border-[#F0D98A] bg-[#FFFAE8] px-3 py-3 sm:px-4"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5E4A8] text-[#695C4A] font-bold">
            {selectStart ? "2" : "1"}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#695C4A] sm:text-base">
              {selectStart ? "종료일 선택" : "시작일 선택"}
            </p>

            <p className="text-xs text-gray-600 sm:text-sm">{guideMessage}</p>
          </div>
        </div>
      )}

      <div className="mb-4 text-center text-lg text-gray-900 sm:text-[20px]">
        {year}
      </div>

      <div className="mb-[10px] flex items-center justify-between">
        <button
          className="cursor-pointer px-1 text-gray-500 transition-colors hover:text-[#695C4A] sm:px-2 sm:pl-6"
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
              className={`cursor-pointer transition-colors hover:text-[#695C4A] ${
                i === 3 ? "font-semibold text-black" : "text-gray-500"
              }`}
            >
              {m.label}
            </span>
          ))}
        </div>

        <button
          className="cursor-pointer px-1 text-gray-500 transition-colors hover:text-[#695C4A] sm:px-2 sm:pr-6"
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          aria-label="다음 달"
        >
          {">"}
        </button>
      </div>

      <div className="rounded-[10px] px-3 py-4 shadow-[0_0_6px_0_#E2E2E2] sm:px-22 sm:py-5">
        <div className="mb-2 grid grid-cols-7 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className="mx-auto flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-900 sm:h-10 sm:w-10 sm:text-[20px]"
            >
              {d}
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-7 gap-y-2 sm:gap-y-[18px]"
          onMouseLeave={() => setHoverDate(null)} // 추가: 격자를 벗어나면 미리보기 해제
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
              hoverDate={hoverDate} // 추가
              mode={mode}
              onDayClick={handleDayClick}
              onEventClick={setViewTarget}
              onHover={setHoverDate} // 추가
            />
          ))}
        </div>
      </div>
    </>
  );
}
