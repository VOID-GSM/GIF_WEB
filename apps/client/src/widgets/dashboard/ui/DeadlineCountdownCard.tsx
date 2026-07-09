"use client";

import { useGetFormList, formatDeadline } from "@/entities/form";
import { useGetMyProject } from "@/entities/project";

function getDDayLabel(deadline: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return "D-DAY";
  if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
  return `D-${diffDays}`;
}

export default function DeadlineCountdownCard() {
  const { data: myProjects, isLoading: isProjectLoading } = useGetMyProject();
  const projectId = myProjects?.[0]?.id;
  const { data: forms, isLoading: isFormsLoading } = useGetFormList(projectId);

  const loading = isProjectLoading || isFormsLoading;

  const todayStr = new Date().toISOString().slice(0, 10);
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
