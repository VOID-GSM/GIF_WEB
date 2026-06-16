"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useGetFilteredProjects } from "@/entities/project";
import type { Grade } from "@/entities/project";
import {
  getSocialScore,
  getReportScore,
  getMajorScore,
} from "@/entities/score";
import { GradeSelector, NoticeButton } from "@repo/ui";
import { MOCK_SCORE_ROWS } from "../model/mockScoreRows";

const toNullOn404 =
  <T,>(fn: () => Promise<T>) =>
  () =>
    fn().catch((err: { response?: { status?: number } }) => {
      if (err.response?.status === 404) return null;
      throw err;
    });

export default function ScoreView() {
  const [grade, setGrade] = useState<Grade>(1);

  const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useGetFilteredProjects(grade);

  const scoreQueries = useQueries({
    queries: (projects ?? []).flatMap((project) => [
      {
        queryKey: ["score", "social", project.id],
        queryFn: toNullOn404(() =>
          getSocialScore(project.id).then((res) => res.data),
        ),
      },
      {
        queryKey: ["score", "report", project.id],
        queryFn: toNullOn404(() =>
          getReportScore(project.id).then((res) => res.data),
        ),
      },
      {
        queryKey: ["score", "major", project.id],
        queryFn: toNullOn404(() =>
          getMajorScore(project.id).then((res) => res.data),
        ),
      },
    ]),
  });

  const isScoreLoading = scoreQueries.some((q) => q.isLoading);
  const isScoreError = scoreQueries.some((q) => q.isError);
  const isLoading = isProjectsLoading || isScoreLoading;
  const isError = isProjectsError || isScoreError;

  const scoreRows =
    !projects || isScoreLoading
      ? []
      : projects
          .map((project, i) => {
            const social = scoreQueries[i * 3]?.data?.subTotalScore ?? 0;
            const report = scoreQueries[i * 3 + 1]?.data?.subTotalScore ?? 0;
            const major = scoreQueries[i * 3 + 2]?.data?.subTotalScore ?? 0;
            return {
              teamName: project.teamName,
              totalScore: social + report + major,
            };
          })
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((row, i) => ({ ...row, rank: i + 1 }));

  return (
    <div className="min-h-screen bg-background py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-2 w-full max-w-[980px] mx-auto">
        <nav className="flex gap-2 w-full">
          <a
            href="/score/assign"
            className="text-2xl sm:text-2xl font-bold pb-1 text-gray-400 whitespace-nowrap"
          >
            점수 부여
          </a>
          <span className="text-2xl sm:text-2xl font-bold pb-1 border-b-2 border-yellow-500 whitespace-nowrap">
            점수 합계
          </span>
        </nav>

        <GradeSelector grade={grade} onGradeChange={setGrade} />
      </div>

      <div className="w-full mx-auto flex flex-col items-center gap-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
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
              {(scoreRows.length > 0 ? scoreRows : MOCK_SCORE_ROWS).map(
                ({ rank, teamName, totalScore }) => (
                  <div
                    key={rank}
                    className="flex justify-between items-center py-3 sm:py-[14px] border-t border-gray-100"
                  >
                    <div className="flex items-center">
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
                ),
              )}
            </div>
          )}
        </div>

        <NoticeButton onClick={() => {}} />
      </div>
    </div>
  );
}
