"use client";

import { useGetFormList, formatDeadline } from "@/entities/form";
import { useGetMyProject } from "@/entities/project";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

// deadline은 시간 포함(YYYY-MM-DDTHH:mm:ss) 또는 날짜만(YYYY-MM-DD)의 KST 문자열이다.
// 타임존이 없으면 KST(+09:00)로 간주해 파싱한다 (isDeadlinePassed와 동일한 규칙).
function parseDeadline(deadline: string): Date {
  const hasTimezone = deadline.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(deadline);
  const iso = deadline.includes("T") ? deadline : `${deadline}T23:59:59`;
  return new Date(hasTimezone ? iso : `${iso}+09:00`);
}

// 마감까지 하루 이상 남았으면 D-day, 하루 안쪽으로 남았으면 남은 시간을 보여준다.
function getDDayLabel(deadline: string): string {
  const diffMs = parseDeadline(deadline).getTime() - Date.now();

  if (diffMs <= 0) {
    const diffDays = Math.floor(-diffMs / DAY_MS);
    return diffDays === 0 ? "D-DAY" : `D+${diffDays}`;
  }
  if (diffMs < DAY_MS) {
    const hours = Math.max(1, Math.ceil(diffMs / HOUR_MS));
    return `${hours}시간 남음`;
  }
  return `D-${Math.ceil(diffMs / DAY_MS)}`;
}

export default function DeadlineCountdownCard() {
  const { data: myProjects, isLoading: isProjectLoading } = useGetMyProject();
  const projectId = myProjects?.[0]?.id;
  const { data: forms, isLoading: isFormsLoading } = useGetFormList(projectId);

  const loading = isProjectLoading || isFormsLoading;

  const todayStr = new Date().toLocaleDateString("sv-SE");
  const nextForm = (forms ?? [])
    .filter((form) => form.deadline >= todayStr)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0];

  return (
    <section className="w-full rounded-xl bg-yellow-100 p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <span className="text-[13px] font-medium text-gray-500">
        제출 마감까지
      </span>

      {loading ? (
        <p className="mt-4 text-[14px] text-gray-500">불러오는 중...</p>
      ) : !nextForm ? (
        <p className="mt-4 text-[14px] text-gray-500">
          예정된 마감 양식이 없습니다.
        </p>
      ) : (
        <>
          <p className="mt-2 text-[36px] font-bold tracking-[-0.5px] text-yellow-600">
            {getDDayLabel(nextForm.deadline)}
          </p>
          <p className="mt-1 text-[13px] text-gray-500">
            {nextForm.title} · {formatDeadline(nextForm.deadline)} 마감
          </p>
        </>
      )}
    </section>
  );
}
