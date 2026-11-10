import Link from "next/link";

import type { ProjectStats } from "@/entities/project-stats";

import type { StatsSortKey } from "./ProjectStatsView";

interface Props {
  isLoading: boolean;
  isError: boolean;
  rows: ProjectStats[];
  sortKey: StatsSortKey;
}

const HEAD_CLASS =
  "px-4 text-xs font-semibold text-[var(--color-gray-700)] dark:text-gray-100";

// 현재 정렬 기준 컬럼은 진하게 표시한다.
function metricClass(active: boolean) {
  return `w-20 shrink-0 px-4 text-right text-sm tabular-nums ${
    active
      ? "font-semibold text-[var(--color-gray-900)] dark:text-white"
      : "text-[var(--color-gray-600)] dark:text-gray-400"
  }`;
}

export default function ProjectStatsTable({
  isLoading,
  isError,
  rows,
  sortKey,
}: Props) {
  if (isLoading) {
    return <p className="py-10 text-center text-gray-400">불러오는 중...</p>;
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-red-400">
        통계를 불러오는 데 실패했습니다.
      </p>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div className="min-w-[40rem]">
        <div className="sticky top-0 z-10 flex h-9 items-center border-y border-[var(--color-yellow-600)] bg-[var(--color-yellow-50)] dark:border-yellow-500/20 dark:bg-[#85782c]">
          <div className={`w-14 shrink-0 ${HEAD_CLASS}`}>순위</div>
          <div className={`min-w-[8rem] flex-1 ${HEAD_CLASS}`}>프로젝트</div>
          <div className={`w-24 shrink-0 ${HEAD_CLASS}`}>학반</div>
          <div className={`w-20 shrink-0 text-right ${HEAD_CLASS}`}>조회수</div>
          <div className={`w-20 shrink-0 text-right ${HEAD_CLASS}`}>좋아요</div>
          <div className={`w-20 shrink-0 text-right ${HEAD_CLASS}`}>댓글</div>
        </div>

        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            조건에 맞는 프로젝트가 없습니다.
          </p>
        ) : (
          rows.map((row, index) => (
            <div
              key={row.projectId}
              className="flex h-12 items-center border-t border-gray-100"
            >
              <div className="w-14 shrink-0 px-4 text-sm text-[var(--color-gray-800)] dark:text-gray-200">
                {index + 1}
              </div>
              <div className="flex min-w-[8rem] flex-1 flex-col px-4">
                <Link
                  href={`/projects/${row.projectId}`}
                  className="truncate text-sm text-[var(--color-gray-800)] underline-offset-2 transition-colors hover:text-yellow-700 hover:underline dark:text-gray-200"
                >
                  {row.teamName}
                </Link>
                <span className="truncate text-[11px] text-gray-400">
                  {row.name}
                </span>
              </div>
              <div className="w-24 shrink-0 px-4 text-sm text-[var(--color-gray-600)] dark:text-gray-400">
                {row.grade ? `${row.grade}학년` : "-"}
                {row.classNo ? ` ${row.classNo}반` : ""}
              </div>
              <div className={metricClass(sortKey === "VIEWS")}>
                {row.viewCount.toLocaleString()}
              </div>
              <div className={metricClass(sortKey === "LIKES")}>
                {row.likeCount.toLocaleString()}
              </div>
              <div className={metricClass(sortKey === "COMMENTS")}>
                {row.commentCount.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
