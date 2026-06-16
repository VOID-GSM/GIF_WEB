"use client";

import { useRouter } from "next/navigation";
import ScoreAreaHeader from "./ScoreAreaHeader";
import ScoreAreaStats from "./ScoreAreaStats";
import ScoreAreaTable from "./ScoreAreaTable";
import { useScoreArea } from "./useScoreArea";

interface Props {
  area: string;
  projectId: number;
  teamName: string;
}

export default function ScoreAreaView({ area, projectId, teamName }: Props) {
  const router = useRouter();
  const {
    rows,
    completed,
    pending,
    allScored,
    isQueryLoading,
    isMutating,
    existingScore,
    selectScore,
    toggleComplete,
    handleSave,
  } = useScoreArea({ area, projectId });

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6">
      <ScoreAreaHeader area={area} teamName={teamName} onBack={() => router.back()} />

      <ScoreAreaStats total={rows.length} completed={completed} pending={pending} />

      <div className="w-full max-w-[980px] mx-auto bg-white rounded-2xl border border-gray-200 shadow-new overflow-hidden p-4 sm:p-7 md:p-10">
        <ScoreAreaTable
          isLoading={isQueryLoading}
          rows={rows}
          onSelectScore={selectScore}
          onToggleComplete={toggleComplete}
        />

        {!isQueryLoading && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={!allScored || isMutating}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isMutating ? "저장 중..." : existingScore ? "수정 저장" : "점수 저장"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
