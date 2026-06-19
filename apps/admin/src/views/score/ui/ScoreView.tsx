"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import { useGetFilteredProjects } from "@/entities/project";
import { useGetMyInfo } from "@/entities/mypage";
import type { Grade } from "@/entities/project";
import {
  getMajorScore,
  useScoreNotice,
} from "@/entities/score";
import { Chevron } from "@repo/ui";
import { toNullOn404 } from "@/shared/utils";

const GRADE_STORAGE_KEY = "score_assign_grade";

const GRADE_OPTIONS: { value: Grade; label: string }[] = [
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
];

export default function ScoreView() {
  const [grade, setGrade] = useState<Grade>(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: noticeScore, isPending: isNoticing } = useScoreNotice();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(GRADE_STORAGE_KEY) === "2") setGrade(2);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleGradeChange(g: Grade) {
    setGrade(g);
    localStorage.setItem(GRADE_STORAGE_KEY, String(g));
    setDropdownOpen(false);
  }

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useGetFilteredProjects(grade);

  const scoreQueries = useQueries({
    queries: (projects ?? []).map((project) => ({
      queryKey: ["score", "all", project.id],
      queryFn: async () => {
        const data = await toNullOn404(() => getMajorScore(project.id).then((res) => res.data))();
        return data?.subTotalScore ?? 0;
      },
    })),
  });

  const isScoreLoading = scoreQueries.some((q) => q.isLoading);
  const isScoreError = scoreQueries.some((q) => q.isError);
  const isLoading = isProjectsLoading || isScoreLoading;
  const isError = isProjectsError || isScoreError;

  const scoreRows: { rank: number; teamName: string; totalScore: number }[] =
    !projects || isScoreLoading
      ? []
      : projects
          .map((project, i) => ({
            teamName: project.teamName,
            totalScore: scoreQueries[i]?.data ?? 0,
          }))
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((row, i) => ({ ...row, rank: i + 1 }));

  const { data: myInfo } = useGetMyInfo();
  const canNotice = myInfo?.adminRole === "MASTER";
  const selectedLabel = GRADE_OPTIONS.find((o) => o.value === grade)?.label ?? "1학년";

  return (
    <div className="h-[calc(100vh-5rem)] bg-background relative">
      <div className="absolute top-14 sm:top-16 left-0 right-0 px-4 sm:px-6 z-10">
        <nav className="flex gap-6 max-w-[980px] mx-auto">
          <Link
            href="/score"
            className="text-xl sm:text-2xl font-bold pb-1 text-gray-400 whitespace-nowrap"
          >
            점수 부여
          </Link>
          <span className="text-xl sm:text-2xl font-bold pb-1 border-b-2 border-yellow-600 whitespace-nowrap">
            점수 합계
          </span>
        </nav>
      </div>

      <div className="h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 w-fit py-[6.5px] px-[10px] rounded-[8px] text-[12px] border border-gray-500 text-gray-500 bg-white cursor-pointer"
              >
                {selectedLabel}
                <Chevron className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <ul className="absolute top-full mt-1 left-0 z-10 bg-white rounded-lg shadow-[var(--shadow-new)] overflow-hidden min-w-[100px]">
                  {GRADE_OPTIONS.map(({ value, label }) => (
                    <li key={value}>
                      <button
                        onClick={() => handleGradeChange(value)}
                        className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-[var(--color-gray-100)] cursor-pointer ${
                          grade === value ? "text-[var(--color-gray-900)]" : "text-[var(--color-gray-600)]"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {canNotice && (
              <button
                type="button"
                onClick={() => noticeScore()}
                className="py-[6.5px] px-[20px] rounded-[8px] text-[12px] bg-yellow-600 hover:bg-yellow-700 text-black font-semibold cursor-pointer transition-colors"
              >
                {isNoticing ? "공지 중..." : "공지하기"}
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="py-10 text-center text-gray-400">불러오는 중...</p>
          ) : isError ? (
            <p className="py-10 text-center text-red-400">점수를 불러오는 데 실패했습니다.</p>
          ) : (
            <div className="flex flex-col">
              <div className="flex justify-between bg-orange-50 py-3 sm:py-4">
                <div className="flex gap-1.5">
                  <div className="w-12 sm:w-16 md:w-20 text-center font-medium text-sm sm:text-base">
                    등수
                  </div>
                  <div className="flex-1 text-center font-medium text-sm sm:text-base">
                    팀명
                  </div>
                </div>
                <div className="w-24 sm:w-32 md:w-40 text-center font-medium text-sm sm:text-base">
                  점수 수합
                </div>
              </div>
              {scoreRows.length === 0 ? (
                <p className="py-10 text-center text-gray-400 text-sm">
                  해당 학년에 등록된 팀이 없습니다.
                </p>
              ) : scoreRows.map(({ rank, teamName, totalScore }) => (
                <div
                  key={rank}
                  className="flex justify-between items-center py-3 sm:py-[14px] border-t border-gray-100"
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 sm:w-16 md:w-20 text-center font-medium text-sm sm:text-base">
                      {rank}
                    </div>
                    <div className="flex-1 text-center font-medium text-sm sm:text-base">
                      {teamName}
                    </div>
                  </div>
                  <div className="w-24 sm:w-32 md:w-40 text-center font-medium text-sm sm:text-base">
                    {totalScore}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
