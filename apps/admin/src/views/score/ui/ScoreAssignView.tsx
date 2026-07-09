"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { useQueries } from "@tanstack/react-query";
import ScoreTabNav from "./ScoreTabNav";
import ScoreAssignFilterBar from "./ScoreAssignFilterBar";
import ScoreAssignTable from "./ScoreAssignTable";
import { useGetFilteredProjects } from "@/entities/project";
import type { Grade } from "@/entities/project";
import { getMajorScore } from "@/entities/score";
import { useGetMyInfo } from "@/entities/mypage";
import { toNullOn404 } from "@/shared/utils";
import type { ScoreFilter, ScoreArea } from "./constants";
import { getAllowedAreas } from "./constants";

const GRADE_STORAGE_KEY = "score_assign_grade";

export default function ScoreAssignView() {
  const subscribe = useMemo(() => (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);
  const grade = useSyncExternalStore(
    subscribe,
    () => (localStorage.getItem(GRADE_STORAGE_KEY) === "2" ? 2 : 1) as Grade,
    () => 1 as Grade,
  );
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");

  function handleGradeChange(g: Grade) {
    localStorage.setItem(GRADE_STORAGE_KEY, String(g));
    window.dispatchEvent(new Event("storage"));
  }

  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  const allowedAreas: ScoreArea[] = getAllowedAreas(myInfo?.adminRole, myInfo?.gradeHead);

  const { data: projects = [], isLoading: isProjectsLoading } = useGetFilteredProjects(grade);

  const scoreQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["score", "status", project.id],
      enabled: projects.length > 0,
      staleTime: 5 * 60 * 1000,
      queryFn: async () => {
        const data = await toNullOn404(() => getMajorScore(project.id).then((r) => r.data))();
        if (!data) return { scoredAreas: [] as ScoreArea[] };
        const VALID = [40, 32, 24];
        const majorDone  = [data.technicalCompleteness, data.socialValueMajor, data.aiUtilizationMajor, data.presentationMajor].every((v) => VALID.includes(v));
        const reportDone = [data.reportWriting, data.reportContent, data.aiUsagePlan, data.creativity].every((v) => VALID.includes(v));
        const socialDone = [data.userExperience, data.socialValueCommunity, data.aiUtilizationCommunity, data.presentationCommunity].every((v) => VALID.includes(v));
        const scoredAreas: ScoreArea[] = [
          ...(majorDone  ? ["major"]  as ScoreArea[] : []),
          ...(reportDone ? ["report"] as ScoreArea[] : []),
          ...(socialDone ? ["social"] as ScoreArea[] : []),
        ];
        return { scoredAreas };
      },
    })),
  });

  const isScoreLoading = scoreQueries.some((q) => q.isPending);
  const isLoading = isProjectsLoading || isScoreLoading || isMyInfoLoading;

  const teamsWithScores = projects
    .map((project, i) => {
      const scoredAreas = scoreQueries[i]?.data?.scoredAreas ?? [] as ScoreArea[];
      // 완료 여부는 3개 영역 전체가 아니라, 로그인한 계정이 담당하는 영역 기준으로 판단한다.
      const isComplete = allowedAreas.length > 0 && allowedAreas.every((a) => scoredAreas.includes(a));
      return {
        id: project.id,
        teamName: project.teamName,
        name: project.name,
        scoredAreas,
        isComplete,
      };
    })
    .sort((a, b) => a.teamName.localeCompare(b.teamName));

  const teams = teamsWithScores.filter((t) => {
    if (scoreFilter === "all") return true;
    return scoreFilter === "complete" ? t.isComplete : !t.isComplete;
  });

  return (
    <div className="h-dvh bg-background flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-5">
        <ScoreTabNav />
        <div className="w-full flex flex-col sm:max-h-[600px] bg-white rounded-2xl border border-gray-200 shadow-new p-4 sm:p-7 md:p-10">
          <ScoreAssignFilterBar
            grade={grade}
            onGradeChange={handleGradeChange}
            scoreFilter={scoreFilter}
            onFilterChange={setScoreFilter}
          />
          <ScoreAssignTable isLoading={isLoading} teams={teams} allowedAreas={allowedAreas} />
        </div>
      </div>
    </div>
  );
}
