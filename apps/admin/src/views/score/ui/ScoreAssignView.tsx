"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { GradeSelector } from "@repo/ui";
import type { Grade } from "@repo/ui";
import ScoreTabNav from "./ScoreTabNav";
import ScoreAssignFilterBar from "./ScoreAssignFilterBar";
import ScoreAssignTable from "./ScoreAssignTable";
import { useGetFilteredProjects } from "@/entities/project";
import { getMajorScore, getReportScore, getSocialScore } from "@/entities/score";
import { toNullOn404 } from "@/shared/utils";
import type { SortOrder, ScoreFilter } from "./constants";

export default function ScoreAssignView() {
  const [grade, setGrade] = useState<Grade>(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>("name");
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");

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

  const teams = projects
    .map((project, i) => ({
      ...project,
      isComplete: scoreQueries[i]?.data?.isComplete ?? false,
    }))
    .sort((a, b) =>
      sortOrder === "name"
        ? a.teamName.localeCompare(b.teamName)
        : b.teamName.localeCompare(a.teamName),
    )
    .filter((project) => {
      if (scoreFilter === "all") return true;
      return scoreFilter === "complete" ? project.isComplete : !project.isComplete;
    });

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-2 w-full max-w-[980px] mx-auto">
        <ScoreTabNav />
        <GradeSelector grade={grade} onGradeChange={setGrade} />
      </div>

      <div className="w-full max-w-[980px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
        <ScoreAssignFilterBar
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          scoreFilter={scoreFilter}
          onFilterChange={setScoreFilter}
        />
        <ScoreAssignTable isLoading={isLoading} teams={teams} />
      </div>
    </div>
  );
}
