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
import { ROLE_ALLOWED_AREAS } from "./constants";

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

  const { data: myInfo } = useGetMyInfo();
  const allowedAreas: ScoreArea[] =
    ROLE_ALLOWED_AREAS[myInfo?.adminRole ?? ""] ?? (["major", "report", "social"] as ScoreArea[]);

  const { data: projects = [], isLoading: isProjectsLoading } = useGetFilteredProjects(grade);

  const scoreQueries = useQueries({
    queries: projects.map((project) => ({
      queryKey: ["score", "status", project.id],
      enabled: projects.length > 0,
      staleTime: 5 * 60 * 1000,
      queryFn: async () => {
        const data = await toNullOn404(() => getMajorScore(project.id).then((r) => r.data))();
        if (!data) return { isComplete: false, scoredAreas: [] as ScoreArea[] };
        const VALID = [40, 32, 24];
        const majorDone  = [data.technicalCompleteness, data.socialValueMajor, data.aiUtilizationMajor, data.presentationMajor].every((v) => VALID.includes(v));
        const reportDone = [data.reportWriting, data.reportContent, data.aiUsagePlan, data.creativity].every((v) => VALID.includes(v));
        const socialDone = [data.userExperience, data.socialValueCommunity, data.aiUtilizationCommunity, data.presentationCommunity].every((v) => VALID.includes(v));
        const scoredAreas: ScoreArea[] = [
          ...(majorDone  ? ["major"]  as ScoreArea[] : []),
          ...(reportDone ? ["report"] as ScoreArea[] : []),
          ...(socialDone ? ["social"] as ScoreArea[] : []),
        ];
        return { isComplete: majorDone && reportDone && socialDone, scoredAreas };
      },
    })),
  });

  const isScoreLoading = scoreQueries.some((q) => q.isPending);
  const isLoading = isProjectsLoading || isScoreLoading;

  const teamsWithScores = projects
    .map((project, i) => ({
      id: project.id,
      teamName: project.teamName,
      name: project.name,
      scoredAreas: scoreQueries[i]?.data?.scoredAreas ?? [] as ScoreArea[],
      isComplete: scoreQueries[i]?.data?.isComplete ?? false,
    }))
    .sort((a, b) => a.teamName.localeCompare(b.teamName));

  const teams = teamsWithScores.filter((t) => {
    if (scoreFilter === "all") return true;
    return scoreFilter === "complete" ? t.isComplete : !t.isComplete;
  });

  return (
    <div className="h-[calc(100vh-5rem)] bg-background flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-[980px] flex flex-col gap-5">
        <ScoreTabNav />
        <div className="bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
          <ScoreAssignFilterBar
            grade={grade}
            onGradeChange={handleGradeChange}
            scoreFilter={scoreFilter}
            onFilterChange={setScoreFilter}
          />
          <div className="overflow-y-auto max-h-[440px]">
            <ScoreAssignTable isLoading={isLoading} teams={teams} allowedAreas={allowedAreas} />
          </div>
        </div>
      </div>
    </div>
  );
}
