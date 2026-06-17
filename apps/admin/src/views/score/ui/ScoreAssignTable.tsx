"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { SectionBadge } from "@repo/ui";
import type { ScoreArea } from "./constants";

interface TeamRow {
  id: number;
  teamName: string;
  name: string;
  scoredAreas?: ScoreArea[];
}

interface Props {
  isLoading: boolean;
  teams: TeamRow[];
  allowedAreas: ScoreArea[];
}

const AREAS: ScoreArea[] = ["major", "report", "social"];

const headerCellCx =
  "px-3 sm:px-4 py-2.5 bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] text-xs font-semibold text-[var(--color-gray-700)]";

export default function ScoreAssignTable({ isLoading, teams, allowedAreas }: Props) {
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
                {AREAS.map((area) => {
                  const isAllowed = allowedAreas.includes(area);
                  const isScored  = team.scoredAreas?.includes(area) ?? false;
                  const variant   = isAllowed ? (isScored ? "active" : "unscored") : "inactive";
                  return isAllowed ? (
                    <button
                      key={area}
                      onClick={() =>
                        router.push(
                          `/score/${area}?projectId=${team.id}&teamName=${encodeURIComponent(team.teamName)}`,
                        )
                      }
                      className="cursor-pointer"
                    >
                      <SectionBadge status={area} variant={variant} />
                    </button>
                  ) : (
                    <div key={area} className="cursor-not-allowed">
                      <SectionBadge status={area} variant="inactive" />
                    </div>
                  );
                })}
              </div>
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
