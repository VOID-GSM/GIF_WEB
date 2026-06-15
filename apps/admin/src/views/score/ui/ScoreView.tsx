"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useGetProjectsByGrade } from "@/entities/project";
import { getSocialScore, getReportScore, getMajorScore } from "@/entities/score";
import { GradeSelector, NoticeButton } from "@repo/ui";
import type { Grade } from "@repo/ui";

export default function ScoreView() {
  const [grade, setGrade] = useState<Grade>(1);

  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsByGrade(grade);

  const scoreQueries = useQueries({
    queries: (projects ?? []).flatMap((project) => [
      {
        queryKey: ["score", "social", project.id],
        queryFn: () => getSocialScore(project.id).then((res) => res.data),
      },
      {
        queryKey: ["score", "report", project.id],
        queryFn: () => getReportScore(project.id).then((res) => res.data),
      },
      {
        queryKey: ["score", "major", project.id],
        queryFn: () => getMajorScore(project.id).then((res) => res.data),
      },
    ]),
  });

  const isScoreLoading = scoreQueries.some((q) => q.isLoading);
  const isLoading = isProjectsLoading || isScoreLoading;

  const scoreRows = useMemo(() => {
    if (!projects || isScoreLoading) return [];
    return projects
      .map((project, i) => {
        const social = scoreQueries[i * 3]?.data?.subTotalScore ?? 0;
        const report = scoreQueries[i * 3 + 1]?.data?.subTotalScore ?? 0;
        const major = scoreQueries[i * 3 + 2]?.data?.subTotalScore ?? 0;
        return { teamName: project.teamName, totalScore: social + report + major };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((row, i) => ({ ...row, rank: i + 1 }));
  }, [projects, scoreQueries, isScoreLoading]);

  return (
    <div className="min-h-screen bg-gray-100 px-16 py-10 flex gap-10">
      <h1 className="text-2xl font-bold border-b-2 border-yellow-500 pb-1 h-fit">
        점수 부여&nbsp;&nbsp;점수 합계
      </h1>

      <div className="flex flex-col flex-1 items-center gap-6">
        <GradeSelector grade={grade} onGradeChange={setGrade} />

        <div className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-10">
          {isLoading ? (
            <p className="text-center">불러오는 중...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-orange-50">
                  <th className="py-4 text-center font-medium w-28">등수</th>
                  <th className="py-4 text-center font-medium">팀명</th>
                  <th className="py-4 text-center font-medium w-40">점수 수합</th>
                </tr>
              </thead>
              <tbody>
                {scoreRows.map(({ rank, teamName, totalScore }) => (
                  <tr key={rank} className="border-t border-gray-100">
                    <td className="py-[14px] text-center font-medium">{rank}</td>
                    <td className="py-[14px] text-center font-medium">{teamName}</td>
                    <td className="py-[14px] text-center font-medium">{totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <NoticeButton onClick={() => {}} />
      </div>
    </div>
  );
}
