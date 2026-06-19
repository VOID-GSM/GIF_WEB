"use client";

import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import type { Grade } from "@repo/ui";
import ScoreTabNav from "./ScoreTabNav";
import ScoreAssignFilterBar from "./ScoreAssignFilterBar";
import ScoreAssignTable from "./ScoreAssignTable";
import { useGetFilteredProjects } from "@/entities/project";
import { getMajorScore } from "@/entities/score";
import { useGetMyInfo } from "@/entities/mypage";
import { toNullOn404 } from "@/shared/utils";
import type { ScoreFilter, ScoreArea } from "./constants";
import { ROLE_ALLOWED_AREAS } from "./constants";

const GRADE_STORAGE_KEY = "score_assign_grade";

export default function ScoreAssignView() {
  const [grade, setGrade] = useState<Grade>(1);
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem(GRADE_STORAGE_KEY) === "2") setGrade(2);
  }, []);

  function handleGradeChange(g: Grade) {
    setGrade(g);
    localStorage.setItem(GRADE_STORAGE_KEY, String(g));
  }

  const { data: myInfo } = useGetMyInfo();
  const allowedAreas: ScoreArea[] =
    ROLE_ALLOWED_AREAS[myInfo?.adminRole ?? ""] ?? (["major", "report", "social"] as ScoreArea[]);

  const { data: projects = [], isLoading } = useGetFilteredProjects(grade);

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

  const teams = projects
    .map((project, i) => ({
      ...project,
      isComplete:  scoreQueries[i]?.data?.isComplete  ?? false,
      scoredAreas: scoreQueries[i]?.data?.scoredAreas ?? [] as ScoreArea[],
    }))
    .sort((a, b) => a.teamName.localeCompare(b.teamName))
    .filter((project) => {
      if (scoreFilter === "all") return true;
      return scoreFilter === "complete" ? project.isComplete : !project.isComplete;
    });

  return (
    <div className="h-[calc(100vh-5rem)] bg-background relative">
      <div className="absolute top-16 sm:top-20 left-0 right-0 px-4 sm:px-6 z-10">
        <div className="max-w-[980px] mx-auto">
          <ScoreTabNav />
        </div>
      </div>

      <div className="h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[980px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
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
