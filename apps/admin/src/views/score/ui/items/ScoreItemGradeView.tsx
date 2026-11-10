"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMyInfo } from "@/entities/mypage";
import { PRIVILEGED_ADMIN_EMAIL } from "@/shared/constants";
import ScoreAreaHeader from "../ScoreAreaHeader";
import ItemGradeTable from "./ItemGradeTable";
import { useItemGrade } from "./useItemGrade";

interface Props {
  projectId: number;
  teamName: string;
}

export default function ScoreItemGradeView({ projectId, teamName }: Props) {
  const router = useRouter();
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  // void 관리자 계정은 채점 권한이 없다 (서버도 403).
  const isPrivilegedAdmin = myInfo?.email === PRIVILEGED_ADMIN_EMAIL;
  const canGrade = !!myInfo && !isPrivilegedAdmin;

  const {
    sections,
    isLoading,
    isError,
    isSaving,
    totalScore,
    totalMaxScore,
    gradableCount,
    scoredCount,
    changedCount,
    selectScore,
    resetDraft,
    save,
  } = useItemGrade({ projectId, enabled: canGrade });

  // 저장하지 않은 점수가 있으면 새로고침·탭 닫기 전에 브라우저 확인창을 띄운다.
  useEffect(() => {
    if (changedCount === 0) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [changedCount]);

  function handleBack() {
    if (changedCount > 0 && !window.confirm("저장하지 않은 점수가 있습니다. 나가시겠습니까?")) return;
    router.back();
  }

  function renderBody() {
    if (isMyInfoLoading || (canGrade && isLoading)) {
      return <p className="py-10 text-center text-gray-400">불러오는 중...</p>;
    }
    if (!canGrade) {
      return <p className="py-10 text-center text-sm text-gray-400">채점 권한이 없는 계정입니다.</p>;
    }
    if (!(projectId > 0) || isError) {
      return (
        <p className="py-10 text-center text-sm text-gray-400">채점 정보를 불러오지 못했습니다.</p>
      );
    }
    return (
      <>
        <ItemGradeTable sections={sections} onSelectScore={selectScore} />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-3 text-sm text-gray-500">
            <span>
              합계{" "}
              <b className="text-xl font-bold text-orange-600 dark:text-orange-400">{totalScore}</b>
              <span className="ml-1 text-gray-400">/ {totalMaxScore}</span>
            </span>
            <span>
              채점 {scoredCount} / {gradableCount}
            </span>
          </div>
          <div className="flex justify-end gap-2">
            {changedCount > 0 && (
              <button
                type="button"
                onClick={resetDraft}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition-colors dark:hover:bg-gray-800"
              >
                되돌리기
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={changedCount === 0 || isSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSaving ? "저장 중..." : changedCount > 0 ? `${changedCount}개 항목 저장` : "저장"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-[980px] flex flex-col gap-5">
        <ScoreAreaHeader onBack={handleBack} teamName={teamName} label="항목별 채점" />
        <div className="bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10 flex flex-col">
          {renderBody()}
        </div>
      </div>
    </div>
  );
}
