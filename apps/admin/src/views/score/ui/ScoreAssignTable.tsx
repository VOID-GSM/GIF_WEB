"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { SectionBadge } from "@repo/ui";
import type { ScoreArea } from "./constants";

// 모바일 카드에서는 "영역"을 뺀 축약 라벨을 쓴다.
const COMPACT_AREA_LABELS: Record<ScoreArea, string> = {
  major: "전공 중심",
  report: "보고서",
  social: "사회 중심",
};

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
  "px-4 h-9 flex items-center bg-[var(--color-yellow-50)] border-y border-[var(--color-yellow-600)] text-xs font-semibold text-[var(--color-gray-700)] sticky top-0 z-10";

export default function ScoreAssignTable({ isLoading, teams, allowedAreas }: Props) {
  const router = useRouter();

  function renderBadges(team: TeamRow, compact = false) {
    return AREAS.map((area) => {
      const isAllowed = allowedAreas.includes(area);
      const isScored  = team.scoredAreas?.includes(area) ?? false;
      const variant   = isAllowed ? (isScored ? "active" : "unscored") : "inactive";
      const label     = compact ? COMPACT_AREA_LABELS[area] : undefined;
      const size      = compact ? "sm" : "md";
      return isAllowed ? (
        <button
          key={area}
          onClick={() =>
            router.push(
              `/score/${area}?projectId=${team.id}&teamName=${encodeURIComponent(team.teamName)}`,
            )
          }
          className="shrink-0 cursor-pointer"
        >
          <SectionBadge status={area} variant={variant} label={label} size={size} />
        </button>
      ) : (
        <div key={area} className="shrink-0 cursor-not-allowed">
          <SectionBadge status={area} variant="inactive" label={label} size={size} />
        </div>
      );
    });
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-[var(--color-gray-400)]">
        불러오는 중...
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-[var(--color-gray-400)]">
        해당하는 팀이 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* 모바일: 카드 레이아웃 (< sm) */}
      <div className="sm:hidden flex flex-col divide-y divide-[var(--color-gray-100)]">
        {teams.map((team) => (
          <div key={team.id} className="py-3 flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-[var(--color-gray-500)]">
                {team.teamName}
              </span>
              <span className="text-sm text-[var(--color-gray-800)] line-clamp-2">
                {team.name}
              </span>
            </div>
            <div className="flex flex-nowrap justify-center gap-3">{renderBadges(team, true)}</div>
          </div>
        ))}
      </div>

      {/* 데스크탑: 테이블 레이아웃 (>= sm) */}
      <div className="hidden sm:block w-full flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-[1fr_120px_minmax(200px,auto)] min-w-[520px]">
          <span className={headerCellCx}>프로젝트명</span>
          <span className={headerCellCx}>팀명</span>
          <span className={headerCellCx}>점수 부여</span>

          {teams.map((team) => (
            <Fragment key={team.id}>
              <span className="border-t border-[var(--color-gray-100)] px-4 h-11 text-sm text-[var(--color-gray-800)] truncate flex items-center min-w-0">
                {team.name}
              </span>
              <span className="border-t border-[var(--color-gray-100)] px-4 h-11 text-sm text-[var(--color-gray-600)] flex items-center">
                {team.teamName}
              </span>
              <div className="border-t border-[var(--color-gray-100)] px-4 h-11 flex flex-wrap items-center gap-2">
                {renderBadges(team)}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
