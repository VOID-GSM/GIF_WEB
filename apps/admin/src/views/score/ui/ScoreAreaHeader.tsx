import ScoreTabNav from "./ScoreTabNav";
import { AREA_LABELS, type ScoreArea } from "@/entities/score";

interface Props {
  onBack: () => void;
  teamName?: string;
  area: string;
}

export default function ScoreAreaHeader({ onBack, teamName, area }: Props) {
  const areaLabel = AREA_LABELS[area as ScoreArea];
  return (
    <div className="w-full max-w-[980px] mx-auto flex flex-col gap-1">
      <button
        onClick={onBack}
        className="text-lg font-semibold text-gray-700 hover:text-gray-900 cursor-pointer flex items-center gap-2 w-fit mb-8"
      >
        ← 뒤로
      </button>
      <ScoreTabNav />
      {(teamName || areaLabel) && (
        <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">채점 대상 팀</span>
            {teamName && (
              <span className="truncate text-xl font-bold text-gray-900">
                {teamName}
              </span>
            )}
          </div>
          {areaLabel && (
            <span className="shrink-0 rounded-full border border-yellow-600 bg-yellow-50 px-4 py-1.5 text-sm font-semibold text-yellow-700">
              {areaLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
