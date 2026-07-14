interface ScheduleStep {
  id: string;
  date: string;
  /** 상태 계산용 ISO 날짜 (하루짜리 일정이면 endDate와 동일). */
  startDate: string;
  endDate: string;
  label: string;
  /** 집중 기간처럼 안내 문구가 필요한 항목에만 채운다. 강조 중일 때만 노출된다. */
  description?: string;
}

const SCHEDULE_STEPS: ScheduleStep[] = [
  {
    id: "1",
    date: "5.27 - 6.13",
    startDate: "2026-05-27",
    endDate: "2026-06-13",
    label: "팀 조직",
  },
  {
    id: "2",
    date: "7.06 - 7.10",
    startDate: "2026-07-06",
    endDate: "2026-07-10",
    label: "1차 집중 기간",
    description: "수업 없이 페스티벌 준비에만 집중하는 기간",
  },
  {
    id: "3",
    date: "7.15",
    startDate: "2026-07-15",
    endDate: "2026-07-15",
    label: "중간 발표",
  },
  {
    id: "4",
    date: "12.21 - 12.25",
    startDate: "2026-12-21",
    endDate: "2026-12-25",
    label: "2차 집중 기간",
    description: "수업 없이 페스티벌 준비에만 집중하는 기간",
  },
  {
    id: "5",
    date: "12.28",
    startDate: "2026-12-28",
    endDate: "2026-12-28",
    label: "최종 발표",
  },
  {
    id: "6",
    date: "12.28 - 12.29",
    startDate: "2026-12-28",
    endDate: "2026-12-29",
    label: "아이디어페스티벌 전시",
  },
];

export default function ScheduleTimelineCard() {
  const todayStr = new Date().toLocaleDateString("sv-SE");

  return (
    <section className="w-full rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-gray-900">
        전체
        <span className="rounded-md bg-yellow-200 px-1.5 py-0.5 dark:text-yellow-200">일정</span>
      </h2>
      <p className="mt-1.5 text-[12px] text-gray-400">
        집중 기간에는 정규 수업 없이 페스티벌 준비에만 집중해요.
      </p>

      <ol className="mt-4 flex flex-col">
        {SCHEDULE_STEPS.map((step, idx) => {
          // 오늘이 해당 항목의 날짜 범위에 포함될 때만 강조한다.
          const highlighted =
            todayStr >= step.startDate && todayStr <= step.endDate;

          return (
            <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
              {highlighted && (
                <span className="absolute -inset-x-2 -inset-y-1 rounded-lg bg-yellow-50" />
              )}
              {idx !== SCHEDULE_STEPS.length - 1 && (
                <span className="absolute top-3 left-[5px] z-10 h-full w-px bg-gray-200" />
              )}
              <span
                className={`relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ${
                  highlighted
                    ? "bg-yellow-600 dark:bg-yellow-400"
                    : "border-2 border-gray-300 bg-white"
                }`}
              />
              <div className="relative z-10 flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-gray-900">
                  {step.date}
                </span>
                <span
                  className={`text-[15px] ${
                    highlighted
                      ? "font-semibold text-gray-900"
                      : "font-medium text-gray-600"
                  }`}
                >
                  {step.label}
                </span>
                {highlighted && step.description && (
                  <span className="text-[12px] text-gray-400">
                    {step.description}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
