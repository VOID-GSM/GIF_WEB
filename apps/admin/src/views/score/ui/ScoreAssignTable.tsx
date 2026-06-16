"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { AREA_LABELS, AREA_LABELS_SHORT } from "./constants";
import type { ScoreArea } from "./constants";

interface TeamRow {
  id: number;
  teamName: string;
  name: string;
}

interface Props {
  isLoading: boolean;
  teams: TeamRow[];
}

const AREAS: ScoreArea[] = ["major", "report", "social"];

const headerCellCx =
  "px-3 sm:px-4 py-2.5 bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] text-xs font-semibold text-[var(--color-gray-700)]";

export default function ScoreAssignTable({ isLoading, teams }: Props) {
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-[80px_1fr_auto] min-w-[340px] sm:grid-cols-[100px_1fr_auto] sm:min-w-[500px]">
        <span className={headerCellCx}>팀명</span>
        <span className={headerCellCx}>프로젝트명</span>
        <span className={headerCellCx}>점수 부여</span>

        {isLoading ? (
          <div className="col-span-3 px-4 py-8 text-center text-sm text-[var(--color-gray-400)]">
            불러오는 중...
          </div>
        ) : teams.length === 0 ? (
          <div className="col-span-3 px-4 py-8 text-center text-sm text-[var(--color-gray-400)]">
            해당하는 팀이 없습니다.
          </div>
        ) : (
          teams.map((team) => (
            <Fragment key={team.id}>
              <span className="border-t border-[var(--color-gray-100)] px-3 sm:px-4 py-3 text-sm text-[var(--color-gray-800)] flex items-center min-w-0">
                {team.teamName}
              </span>
              <span className="border-t border-[var(--color-gray-100)] px-3 sm:px-4 py-3 text-sm text-[var(--color-gray-600)] truncate flex items-center min-w-0">
                {team.name}
              </span>
              <div className="border-t border-[var(--color-gray-100)] px-3 sm:px-4 py-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() =>
                      router.push(
                        `/score/assign/${area}?projectId=${team.id}&teamName=${encodeURIComponent(team.teamName)}`,
                      )
                    }
                    className="px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium border bg-[var(--color-gray-100)] border-[var(--color-gray-200)] text-[var(--color-gray-600)] cursor-pointer hover:bg-[var(--color-gray-200)] transition-colors"
                  >
                    <span className="sm:hidden">{AREA_LABELS_SHORT[area]}</span>
                    <span className="hidden sm:inline">{AREA_LABELS[area]}</span>
                  </button>
                ))}
              </div>
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
