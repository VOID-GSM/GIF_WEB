"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetMyInfo } from "@/entities/mypage";
import type { Grade } from "@/entities/project";
import { useScoreNotice } from "@/entities/score";
import { getRank } from "@repo/lib";
import ScoreTabNav from "./ScoreTabNav";
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

  const {
    data: rankRows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["score", "rank", grade],
    queryFn: async () => (await getRank(grade)).data,
  });

  const scoreRows = [...rankRows]
    .sort((a, b) => a.rank - b.rank)
    .map(({ rank, teamName, totalScore }) => ({ rank, teamName, totalScore }));

  return (
    <div className="h-[calc(100vh-3.75rem)] bg-background flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-5">
        <ScoreTabNav />
        <div className="w-full flex flex-col sm:max-h-[600px] bg-white rounded-2xl border border-gray-200 shadow-new p-4 sm:p-7 md:p-10">
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
