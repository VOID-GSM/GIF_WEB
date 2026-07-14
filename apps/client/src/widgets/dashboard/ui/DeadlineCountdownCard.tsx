"use client";

import { useEffect, useState } from "react";

import { useGetFormList, formatDeadline } from "@/entities/form";
import { useGetMyProject } from "@/entities/project";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// deadline은 시간 포함(YYYY-MM-DDTHH:mm:ss) 또는 날짜만(YYYY-MM-DD)의 KST 문자열이다.
// 타임존이 없으면 KST(+09:00)로 간주해 파싱한다 (isDeadlinePassed와 동일한 규칙).
function parseDeadline(deadline: string): Date {
  const hasTimezone = deadline.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(deadline);
  const iso = deadline.includes("T") ? deadline : `${deadline}T23:59:59`;
  return new Date(hasTimezone ? iso : `${iso}+09:00`);
}

// 마감이 지났으면 마감 표시, 1시간 이내면 분/초, 하루 이내면 시간, 그 외엔 D-day를 보여준다.
function getDDayLabel(deadline: string, now: number): string {
  const diffMs = parseDeadline(deadline).getTime() - now;

  if (diffMs <= 0) {
    const diffDays = Math.floor(-diffMs / DAY_MS);
    return diffDays === 0 ? "마감" : `D+${diffDays}`;
  }
  if (diffMs < HOUR_MS) {
    const minutes = Math.floor(diffMs / MINUTE_MS);
    const seconds = Math.floor((diffMs % MINUTE_MS) / 1000);
    return minutes > 0 ? `${minutes}분 ${seconds}초 남음` : `${seconds}초 남음`;
  }
  if (diffMs < DAY_MS) {
    const hours = Math.ceil(diffMs / HOUR_MS);
    return `${hours}시간 남음`;
  }
  return `D-${Math.ceil(diffMs / DAY_MS)}`;
}

export default function DeadlineCountdownCard() {
  const { data: myProjects, isLoading: isProjectLoading } = useGetMyProject();
  const projectId = myProjects?.[0]?.id;
  const { data: forms, isLoading: isFormsLoading } = useGetFormList(projectId);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loading = isProjectLoading || isFormsLoading;

  const todayStr = new Date(now).toLocaleDateString("sv-SE");
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
          <p className="mt-2 text-[36px] font-bold tracking-[-0.5px] text-yellow-600 dark:text-yellow-400">
            {getDDayLabel(nextForm.deadline, now)}
          </p>
          <p className="mt-1 text-[13px] text-gray-500">
            {nextForm.title} · {formatDeadline(nextForm.deadline)} 마감
          </p>
        </>
      )}
    </section>
  );
}
