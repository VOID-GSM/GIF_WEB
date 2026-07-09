interface ScheduleStep {
  id: string;
  date: string;
  label: string;
  status: "done" | "in-progress" | "upcoming";
}

const SCHEDULE_STEPS: ScheduleStep[] = [
  { id: "1", date: "", label: "팀 접수", status: "done" },
  { id: "2", date: "07.06 - 07.10", label: "1차 집중기간", status: "in-progress" },
  { id: "3", date: "07.15", label: "중간 발표", status: "upcoming" },
  { id: "4", date: "12.21 - 12.25", label: "2차 집중기간", status: "upcoming" },
  { id: "5", date: "미정", label: "최종 발표", status: "upcoming" },
  { id: "6", date: "12.28 - 12.29", label: "아이디어 페스티벌 전시", status: "upcoming" },
];

const DOT_STYLE: Record<ScheduleStep["status"], string> = {
  done: "bg-gray-300",
  "in-progress": "bg-yellow-600",
  upcoming: "bg-gray-200",
};

export default function ScheduleTimelineCard() {
  return (
    <section className="w-full rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <h2 className="text-[13px] font-medium text-gray-400">진행 일정</h2>

      <ol className="mt-4 flex flex-col">
        {SCHEDULE_STEPS.map((step, idx) => (
          <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
            {step.status === "in-progress" && (
              <span className="absolute -inset-x-2 -inset-y-1 rounded-lg bg-yellow-50" />
            )}
            {idx !== SCHEDULE_STEPS.length - 1 && (
              <span className="absolute top-3 left-[5px] z-10 h-full w-px bg-gray-200" />
            )}
            <span
              className={`relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ${DOT_STYLE[step.status]}`}
            />
            <div className="relative z-10 flex flex-col gap-0.5">
              {step.date && (
                <span className="text-[13px] text-gray-400">
                  {step.status === "in-progress" && (
                    <span className="mr-1 font-medium text-yellow-800">
                      진행중・
                    </span>
                  )}
                  {step.date}
                </span>
              )}
              <span
                className={`text-[15px] ${
                  step.status === "in-progress"
                    ? "font-semibold text-gray-900"
                    : "font-medium text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
