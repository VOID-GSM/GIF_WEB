"use client";

import type { FormSummary } from "@/entities/form";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface ScheduleSectionProps {
  // 마감일을 캘린더에 표시하기 위한 양식 목록 (디자인 641-2714)
  forms?: FormSummary[];
}

// 일정 — 현재 월 캘린더. 오늘은 노란 원, 마감일은 주황 테두리로 표시
export default function ScheduleSection({ forms = [] }: ScheduleSectionProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 이번 달에 해당하는 마감일(일자)들의 집합
  const deadlineDays = new Set(
    forms
      .map((form) => new Date(form.deadline))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate()),
  );

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section className="flex flex-col gap-3">
      <span className="text-xl font-semibold tracking-tight text-gray-600">
        일정
      </span>

      <div className="w-fit rounded-xl bg-white px-10 py-5 shadow-new">
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
            const isToday = date === todayDate;
            const isDeadline = date !== null && deadlineDays.has(date);

            return (
              <div
                key={i}
                className="flex size-10 items-center justify-center"
              >
                {date !== null && (
                  <span
                    className={`flex size-[30px] items-center justify-center rounded-full text-xl font-medium tracking-tight text-black ${
                      isToday
                        ? "bg-yellow-600"
                        : isDeadline
                          ? "border border-orange-600"
                          : ""
                    }`}
                  >
                    {date}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
