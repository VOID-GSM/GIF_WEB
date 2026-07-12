"use client";

import { useState } from "react";

import { EventViewModal } from "@repo/ui";
import {
  resolveColor,
  useGetProjectSchedule,
  type CalendarEvent,
} from "@/entities/form-submissions";
import type { FormSummary } from "@/entities/form";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
// 주 수가 다른 달에도 동일한 크기를 유지하기 위해 항상 6주(42칸)를 그린다.
const TOTAL_CELLS = 42;

interface ScheduleSectionProps {
  projectId: number;
  // 제출 여부·formId 를 얻기 위한 양식 목록
  forms?: FormSummary[];
}

function getDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// 일정 — 팀이 제출한 양식들의 캘린더 답변을 모아서 보여준다.
// 선생님이 캘린더를 포함해 공지한 양식에 학생이 작성·제출한 일정이 그대로 표시되며,
// 이벤트를 클릭하면 내용을 확인할 수 있다.
export default function ScheduleSection({
  projectId,
  forms = [],
}: ScheduleSectionProps) {
  // 제출한 양식만 캘린더 답변을 가지므로 그 양식들만 조회한다.
  const submittedFormIds = forms.filter((f) => f.submitted).map((f) => f.id);
  const { events } = useGetProjectSchedule(projectId, submittedFormIds);

  const today = new Date();
  const todayStr = getDateStr(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth()),
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showHint, setShowHint] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = Array.from({ length: TOTAL_CELLS }, (_, i) => {
    const day = i - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-semibold tracking-tight text-gray-600">
          일정
        </span>
        <div className="relative flex items-center">
          <button
            type="button"
            aria-label="일정 안내"
            onClick={() => setShowHint((prev) => !prev)}
            onBlur={() => setShowHint(false)}
            className="flex size-4 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-[11px] font-semibold text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-500"
          >
            ?
          </button>
          {showHint && (
            <span className="absolute left-6 top-1/2 z-10 w-max -translate-y-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium tracking-tight text-gray-500 shadow-new">
              캘린더가 포함된 양식을 제출하면 작성한 일정이 여기에 반영됩니다.
            </span>
          )}
        </div>
      </div>

      <div className="w-fit rounded-xl bg-white px-10 py-5 shadow-new">
        {/* 월 이동 */}
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            className="px-2 text-gray-500"
            onClick={() => setCurrentMonth(new Date(year, month - 1))}
          >
            {"<"}
          </button>
          <span className="text-base font-semibold tracking-tight text-black">
            {year}년 {month + 1}월
          </span>
          <button
            type="button"
            className="px-2 text-gray-500"
            onClick={() => setCurrentMonth(new Date(year, month + 1))}
          >
            {">"}
          </button>
        </div>

        <div className="grid grid-cols-7">
          {WEEKDAYS.map((day, i) => (
            <div
              key={`${day}-${i}`}
              className="flex size-10 items-center justify-center text-xl font-semibold tracking-tight text-black"
            >
              {day}
            </div>
          ))}

          {cells.map((date, i) => {
            if (date === null) {
              return <div key={i} className="size-10" />;
            }

            const dateStr = getDateStr(year, month, date);
            const isToday = dateStr === todayStr;
            const event = events.find(
              (e) => e.startDate <= dateStr && dateStr <= e.endDate,
            );

            // 일정 없음 — 오늘이면 노란 원
            if (!event) {
              return (
                <div key={i} className="flex size-10 items-center justify-center">
                  <span
                    className={`flex size-[30px] items-center justify-center rounded-full text-xl font-medium tracking-tight text-black ${
                      isToday ? "bg-yellow-600" : ""
                    }`}
                  >
                    {date}
                  </span>
                </div>
              );
            }

            const colorVar = resolveColor(event.color);
            const isSingle = event.startDate === event.endDate;
            const isStart = event.startDate === dateStr;
            const isEnd = event.endDate === dateStr;

            // 단일 일정 — 원형 테두리
            if (isSingle) {
              return (
                <div key={i} className="flex size-10 items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className={`flex size-[30px] cursor-pointer items-center justify-center rounded-full text-xl font-medium tracking-tight text-black ${
                      isToday ? "bg-yellow-600" : ""
                    }`}
                    style={{ border: `1px solid ${colorVar}` }}
                  >
                    {date}
                  </button>
                </div>
              );
            }

            // 연속 일정 — 이어진 캡슐
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className={`flex h-[30px] w-full cursor-pointer items-center justify-center self-center text-xl font-medium tracking-tight text-black ${
                  isStart ? "rounded-l-full" : ""
                } ${isEnd ? "rounded-r-full" : ""} ${
                  isToday ? "bg-yellow-600" : ""
                }`}
                style={{
                  borderTop: `1px solid ${colorVar}`,
                  borderBottom: `1px solid ${colorVar}`,
                  borderLeft: isStart ? `1px solid ${colorVar}` : "none",
                  borderRight: isEnd ? `1px solid ${colorVar}` : "none",
                }}
              >
                {date}
              </button>
            );
          })}
        </div>
      </div>

      {selectedEvent && (
        <EventViewModal
          event={selectedEvent}
          editable={false}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => {}}
        />
      )}
    </section>
  );
}
