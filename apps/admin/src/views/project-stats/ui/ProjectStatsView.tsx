"use client";

import { useMemo, useState } from "react";

import {
  useGetProjectStats,
  type ProjectStats,
  type ProjectStatsSort,
} from "@/entities/project-stats";

import ProjectStatsTable from "./ProjectStatsTable";
import TopProjectsChart from "./TopProjectsChart";

// 서버 정렬(VIEWS/LIKES)에 더해 댓글순은 화면에서 정렬한다.
export type StatsSortKey = ProjectStatsSort | "COMMENTS";

const SORT_OPTIONS: { value: StatsSortKey; label: string }[] = [
  { value: "VIEWS", label: "조회수순" },
  { value: "LIKES", label: "좋아요순" },
  { value: "COMMENTS", label: "댓글순" },
];

const GRADE_OPTIONS = [1, 2] as const;
const CLASS_OPTIONS = [1, 2, 3, 4] as const;

const SELECT_CLASS =
  "h-9 cursor-pointer rounded-[8px] border border-gray-300 bg-white px-2.5 text-[13px] text-gray-700 outline-none focus:border-yellow-600 dark:bg-gray-900 dark:text-gray-200";

export default function ProjectStatsView() {
  const [grade, setGrade] = useState<number | undefined>();
  const [classNo, setClassNo] = useState<number | undefined>();
  const [sortKey, setSortKey] = useState<StatsSortKey>("VIEWS");

  const { data, isLoading, isError } = useGetProjectStats({
    grade,
    classNo,
    // 댓글순은 서버가 지원하지 않으므로 기본 정렬로 받아 화면에서 다시 정렬한다.
    sort: sortKey === "COMMENTS" ? "VIEWS" : sortKey,
  });

  const rows = useMemo<ProjectStats[]>(() => {
    if (!data) return [];
    if (sortKey !== "COMMENTS") return data;
    return [...data].sort((a, b) => b.commentCount - a.commentCount);
  }, [data, sortKey]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          views: acc.views + row.viewCount,
          likes: acc.likes + row.likeCount,
          comments: acc.comments + row.commentCount,
        }),
        { views: 0, likes: 0, comments: 0 },
      ),
    [rows],
  );

  const isReady = !isLoading && !isError;

  return (
    <div className="flex h-dvh w-full justify-center bg-background">
      <div className="flex h-full w-full max-w-4xl flex-col px-4 py-8">
        <div className="shrink-0 border-b border-gray-200 pb-4">
          <h1 className="text-[19px] font-semibold tracking-[-0.3px] text-gray-900">
            프로젝트 통계
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
            프로젝트별 조회수·좋아요·댓글 수를 비교할 수 있습니다.
          </p>
        </div>

        {/* 필터 + 정렬 */}
        <div className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              aria-label="학년"
              className={SELECT_CLASS}
              value={grade ?? ""}
              onChange={(e) =>
                setGrade(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">전체 학년</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}학년
                </option>
              ))}
            </select>
            <select
              aria-label="반"
              className={SELECT_CLASS}
              value={classNo ?? ""}
              onChange={(e) =>
                setClassNo(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">전체 반</option>
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}반
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-[10px] bg-gray-100 p-1 dark:bg-gray-800">
            {SORT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSortKey(value)}
                className={`cursor-pointer rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  sortKey === value
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isReady && (
          <div className="mt-4 grid shrink-0 grid-cols-3 gap-2">
            <SummaryTile label="총 조회수" value={totals.views} />
            <SummaryTile label="총 좋아요" value={totals.likes} />
            <SummaryTile label="총 댓글" value={totals.comments} />
          </div>
        )}

        {isReady && rows.length > 0 && (
          <TopProjectsChart rows={rows} sortKey={sortKey} />
        )}

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <ProjectStatsTable
            isLoading={isLoading}
            isError={isError}
            rows={rows}
            sortKey={sortKey}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[12px] border border-gray-200 bg-white px-4 py-3">
      <p className="text-[12px] text-gray-500">{label}</p>
      <p className="mt-0.5 text-[18px] font-semibold tabular-nums text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
