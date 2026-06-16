"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import { Chevron, GradeSelector, GrantButton } from "@repo/ui";
import type { Grade, GrantStatus } from "@repo/ui";
import ScoreTabNav from "./ScoreTabNav";
import { useGetFilteredProjects } from "@/entities/project";
import { getMajorScore, getReportScore, getSocialScore } from "@/entities/score";

type ScoreArea = "major" | "report" | "social";
type SortOrder = "name" | "name-desc";
type ScoreFilter = "all" | "incomplete" | "complete";

const AREA_LABELS: Record<ScoreArea, string> = {
  major: "전공 중심 영역",
  report: "보고서 영역",
  social: "사회 중심 영역",
};

const AREA_LABELS_SHORT: Record<ScoreArea, string> = {
  major: "전공",
  report: "보고서",
  social: "사회",
};

const SORT_LABELS: Record<SortOrder, string> = {
  name: "이름순",
  "name-desc": "이름역순",
};

const toNullOn404 =
  <T,>(fn: () => Promise<T>) =>
  () =>
    fn().catch((err: { response?: { status?: number } }) => {
      if (err.response?.status === 404) return null;
      throw err;
    });

export default function ScoreAssignView() {
  const [grade, setGrade] = useState<Grade>(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("name");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: projects = [], isLoading } = useGetFilteredProjects(grade);

  const scoreQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["score", "status", project.id],
      enabled: scoreFilter !== "all",
      queryFn: async () => {
        const [major, report, social] = await Promise.all([
          toNullOn404(() => getMajorScore(project.id).then((r) => r.data))(),
          toNullOn404(() => getReportScore(project.id).then((r) => r.data))(),
          toNullOn404(() => getSocialScore(project.id).then((r) => r.data))(),
        ]);
        return { isComplete: major !== null && report !== null && social !== null };
      },
    })),
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sorted = [...projects]
    .sort((a, b) =>
      sortOrder === "name"
        ? a.teamName.localeCompare(b.teamName)
        : b.teamName.localeCompare(a.teamName),
    )
    .filter((_, i) => {
      if (scoreFilter === "all") return true;
      const isComplete = scoreQueries[i]?.data?.isComplete ?? false;
      return scoreFilter === "complete" ? isComplete : !isComplete;
    });

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-2 w-full max-w-[980px] mx-auto">
        <ScoreTabNav />
        <GradeSelector grade={grade} onGradeChange={setGrade} />
      </div>

      <div className="w-full max-w-[980px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex items-center gap-1 w-fit py-[6.5px] px-[10px] rounded-[8px] text-[12px] border border-gray-500 text-gray-500 bg-white cursor-pointer"
            >
              {SORT_LABELS[sortOrder]}
              <Chevron className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <ul className="absolute top-full mt-1 left-0 z-10 bg-white rounded-lg shadow-[var(--shadow-new)] overflow-hidden min-w-[100px]">
                {(Object.entries(SORT_LABELS) as [SortOrder, string][]).map(([key, label]) => (
                  <li key={key}>
                    <button
                      onClick={() => { setSortOrder(key); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-[var(--color-gray-100)] cursor-pointer ${
                        sortOrder === key ? "text-[var(--color-gray-900)]" : "text-[var(--color-gray-600)]"
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {(["ungranted", "granted"] as GrantStatus[]).map((status) => {
            const filter: ScoreFilter = status === "ungranted" ? "incomplete" : "complete";
            return (
              <GrantButton
                key={status}
                status={status}
                isActive={scoreFilter === filter}
                onClick={() => setScoreFilter((prev) => (prev === filter ? "all" : filter))}
              />
            );
          })}
        </div>

        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-[80px_1fr_auto] min-w-[340px] sm:grid-cols-[100px_1fr_auto] sm:min-w-[500px]">
            <span className="px-3 sm:px-4 py-2.5 bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] text-xs font-semibold text-[var(--color-gray-700)]">팀명</span>
            <span className="px-3 sm:px-4 py-2.5 bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] text-xs font-semibold text-[var(--color-gray-700)]">프로젝트명</span>
            <span className="px-3 sm:px-4 py-2.5 bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] text-xs font-semibold text-[var(--color-gray-700)]">점수 부여</span>

            {isLoading ? (
              <div className="col-span-3 px-4 py-8 text-center text-sm text-[var(--color-gray-400)]">
                불러오는 중...
              </div>
            ) : sorted.length === 0 ? (
              <div className="col-span-3 px-4 py-8 text-center text-sm text-[var(--color-gray-400)]">
                해당하는 팀이 없습니다.
              </div>
            ) : (
              sorted.map((team) => (
                <Fragment key={team.id}>
                  <span className="border-t border-[var(--color-gray-100)] px-3 sm:px-4 py-3 text-sm text-[var(--color-gray-800)] flex items-center min-w-0">{team.teamName}</span>
                  <span className="border-t border-[var(--color-gray-100)] px-3 sm:px-4 py-3 text-sm text-[var(--color-gray-600)] truncate flex items-center min-w-0">{team.name}</span>
                  <div className="border-t border-[var(--color-gray-100)] px-3 sm:px-4 py-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {(["major", "report", "social"] as ScoreArea[]).map((area) => (
                      <button
                        key={area}
                        onClick={() =>
                          router.push(
                            `/score/assign/${area}?projectId=${team.id}&teamName=${encodeURIComponent(team.teamName)}`,
                          )
                        }
                        className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium border bg-[var(--color-gray-100)] border-[var(--color-gray-200)] text-[var(--color-gray-600)] cursor-pointer hover:bg-[var(--color-gray-200)] transition-colors"
                      >
                        <span className="sm:hidden">{AREA_LABELS_SHORT[area]}</span>
                        <span className="hidden sm:inline">{AREA_LABELS[area]}</span>
                      </button>
                    ))}
                  </div>
                </Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
