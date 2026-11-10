import type { ProjectStats } from "@/entities/project-stats";

import type { StatsSortKey } from "./ProjectStatsView";

const TOP_COUNT = 5;

const METRIC: Record<
  StatsSortKey,
  { label: string; pick: (row: ProjectStats) => number }
> = {
  VIEWS: { label: "조회수", pick: (row) => row.viewCount },
  LIKES: { label: "좋아요", pick: (row) => row.likeCount },
  COMMENTS: { label: "댓글", pick: (row) => row.commentCount },
};

interface Props {
  rows: ProjectStats[];
  sortKey: StatsSortKey;
}

// 현재 정렬 기준으로 상위 5개 프로젝트를 가로 막대로 보여준다.
export default function TopProjectsChart({ rows, sortKey }: Props) {
  const { label, pick } = METRIC[sortKey];
  const top = rows.slice(0, TOP_COUNT);
  const max = Math.max(1, ...top.map(pick));

  return (
    <section className="mt-4 shrink-0 rounded-[12px] border border-gray-200 bg-white px-4 py-3.5">
      <h2 className="text-[13px] font-semibold text-gray-800">
        {label} 상위 {top.length}개 프로젝트
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {top.map((row) => {
          const value = pick(row);
          return (
            <li key={row.projectId} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-[12px] text-gray-600 sm:w-36">
                {row.teamName}
              </span>
              <div className="h-2.5 min-w-0 flex-1 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-yellow-600"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-[12px] font-medium tabular-nums text-gray-800">
                {value.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
