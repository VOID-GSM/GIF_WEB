"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { useQueries } from "@tanstack/react-query";
import { useGetFilteredProjects } from "@/entities/project";
import { useGetMyInfo } from "@/entities/mypage";
import type { Grade } from "@/entities/project";
import { getMajorScore, useScoreNotice } from "@/entities/score";
import { toNullOn404 } from "@/shared/utils";
import ScoreCollectionFilterBar from "./ScoreCollectionFilterBar";
import ScoreCollectionTable from "./ScoreCollectionTable";

const GRADE_STORAGE_KEY = "score_assign_grade";

export default function ScoreView() {
  const subscribe = useMemo(() => (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  }, []);
  const grade = useSyncExternalStore(
    subscribe,
    () => (localStorage.getItem(GRADE_STORAGE_KEY) === "2" ? 2 : 1) as Grade,
    () => 1 as Grade,
  );

  function handleGradeChange(g: Grade) {
    localStorage.setItem(GRADE_STORAGE_KEY, String(g));
    window.dispatchEvent(new Event("storage"));
  }

  const { mutate: noticeScore, isPending: isNoticing } = useScoreNotice();
  const { data: myInfo } = useGetMyInfo();
  const canNotice = myInfo?.adminRole === "MASTER";

  const { data: projects, isLoading: isProjectsLoading, isError: isProjectsError } =
    useGetFilteredProjects(grade);

  const scoreQueries = useQueries({
    queries: (projects ?? []).map((project) => ({
      queryKey: ["score", "all", project.id],
      queryFn: async () => {
        const data = await toNullOn404(() => getMajorScore(project.id).then((res) => res.data))();
        return data?.subTotalScore ?? 0;
      },
    })),
  });

  const isLoading = isProjectsLoading || scoreQueries.some((q) => q.isLoading);
  const isError = isProjectsError || scoreQueries.some((q) => q.isError);

  const scoreRows = (projects ?? [])
    .map((project, i) => ({
      teamName: project.teamName,
      totalScore: scoreQueries[i]?.data ?? 0,
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((row, i) => ({ ...row, rank: i + 1 }));

  return (
    <div className="h-[calc(100vh-5rem)] bg-background flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-[980px] flex flex-col gap-5">
        <nav className="flex gap-6">
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
        <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl border border-gray-200 shadow-new p-4 sm:p-7 md:p-10">
          <ScoreCollectionFilterBar
            grade={grade}
            onGradeChange={handleGradeChange}
            canNotice={canNotice}
            isNoticing={isNoticing}
            onNotice={() => noticeScore()}
          />
          <ScoreCollectionTable isLoading={isLoading} isError={isError} scoreRows={scoreRows} />
        </div>
      </div>
    </div>
  );
}
