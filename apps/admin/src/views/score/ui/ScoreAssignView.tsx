"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import ScoreTabNav from "./ScoreTabNav";
import ScoreAssignFilterBar from "./ScoreAssignFilterBar";
import ScoreAssignTable from "./ScoreAssignTable";
import EvaluationPeriodBar from "./EvaluationPeriodBar";
import type { EvaluationPeriodPayload } from "./evaluationPeriod";
import { useGetFilteredProjects } from "@/entities/project";
import type { Grade } from "@/entities/project";
import { useScoreStatuses, useSetScorePeriod } from "@/entities/score";
import { useGetMyInfo } from "@/entities/mypage";
import { PRIVILEGED_ADMIN_EMAIL } from "@/shared/constants";
import { matchesTeamQuery } from "@/shared/utils";
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
  const [teamQuery, setTeamQuery] = useState("");
  const [evaluationPeriod, setEvaluationPeriod] =
    useState<EvaluationPeriodPayload | null>(null);
  const { mutate: setScorePeriod } = useSetScorePeriod();

  function handleGradeChange(g: Grade) {
    localStorage.setItem(GRADE_STORAGE_KEY, String(g));
    window.dispatchEvent(new Event("storage"));
  }

  function handlePeriodConfirmed(payload: EvaluationPeriodPayload) {
    setScorePeriod(payload, {
      onSuccess: () => setEvaluationPeriod(payload),
    });
  }

  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  // void 관리자 계정은 실제 채점 권한이 없는 단순 관리 계정이라 항상 점수 부여가 불가능해야 한다.
  const isPrivilegedAdmin = myInfo?.email === PRIVILEGED_ADMIN_EMAIL;
  const canSetPeriod = myInfo?.adminRole === "MASTER";
  const allowedAreas: ScoreArea[] = isPrivilegedAdmin
    ? []
    : getAllowedAreas(myInfo?.adminRole, myInfo?.gradeHead);

  const { data: projects = [], isLoading: isProjectsLoading } = useGetFilteredProjects(grade);

  const scoreQueries = useScoreStatuses(projects.map((project) => project.id));

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

  const teams = teamsWithScores
    .filter((t) => {
      if (scoreFilter === "all") return true;
      return scoreFilter === "complete" ? t.isComplete : !t.isComplete;
    })
    .filter((t) => matchesTeamQuery(t.teamName, teamQuery));

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
            teamNames={teamsWithScores.map((t) => t.teamName)}
            teamQuery={teamQuery}
            onTeamQueryChange={setTeamQuery}
            evaluationPeriod={evaluationPeriod}
          />
          {!evaluationPeriod && (
            <EvaluationPeriodBar
              canSet={canSetPeriod}
              onConfirmed={handlePeriodConfirmed}
            />
          )}
          <ScoreAssignTable isLoading={isLoading} teams={teams} allowedAreas={allowedAreas} />
        </div>
      </div>
    </div>
  );
}
