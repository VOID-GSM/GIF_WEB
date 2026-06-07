"use client";

import { useState } from "react";

import { RANK_MOCK_DATA, useGetRank } from "@repo/lib";
import type { RankItem } from "@repo/lib";

import GradeSelector from "../components/GradeSelector/GradeSelector";
import type { Grade } from "../components/GradeSelector/GradeSelector";

const BAR_HEIGHTS = [
  "clamp(150px, 53vw, 400px)",
  "clamp(120px, 42vw, 320px)",
  "clamp(90px, 32vw, 240px)",
  "clamp(60px, 21vw, 160px)",
  "clamp(30px, 11vw, 80px)",
];

export default function RankView() {
  const [grade, setGrade] = useState<Grade>(1);
  const { data: apiData, isPending, isError } = useGetRank({ grade });
  const data = (
    apiData && apiData.length > 0 ? apiData : RANK_MOCK_DATA[grade]
  ) as RankItem[];

  return (
    <div className="h-[calc(100vh-5rem)] relative flex items-center justify-center bg-white overflow-hidden">
      <div className="absolute top-20 w-full flex justify-center">
        <GradeSelector grade={grade} onGradeChange={setGrade} />
      </div>

      <section className="w-full px-4 md:px-0">
        {isPending ? (
          <RankSkeleton />
        ) : isError ? (
          <p className="text-center text-gray-500">
            등수 정보를 불러오지 못했습니다
          </p>
        ) : (
          <RankChart items={data} />
        )}
      </section>
    </div>
  );
}

const barStyle = {
  width: "clamp(50px, 13vw, 120px)",
  gap: "clamp(4px, 1.5vw, 16px)",
  borderRadius: "clamp(8px, 2vw, 20px)",
} as const;

function RankChart({ items }: { items: RankItem[] }) {
  return (
    <div className="flex flex-row items-end justify-center" style={{ gap: barStyle.gap }}>
      {items.slice(0, 5).map((item, index) => (
        <div key={item.rank} className="flex flex-col items-center">
          <div
            className="flex justify-center overflow-hidden"
            style={{
              width: barStyle.width,
              height: BAR_HEIGHTS[index] ?? BAR_HEIGHTS[BAR_HEIGHTS.length - 1],
              background: "var(--gradient-rank)",
              borderRadius: barStyle.borderRadius,
            }}
          >
            <span
              className="text-center font-semibold"
              style={{
                fontSize: "clamp(10px, 2.5vw, 20px)",
                marginTop: "clamp(12px, 3vw, 32px)",
              }}
            >
              {item.teamName}
            </span>
          </div>
          <span
            className="font-semibold"
            style={{
              fontSize: "clamp(12px, 2vw, 20px)",
              marginTop: "clamp(6px, 1vw, 12px)",
            }}
          >
            {item.rank}등
          </span>
        </div>
      ))}
    </div>
  );
}

function RankSkeleton() {
  return (
    <div className="flex flex-row items-end justify-center" style={{ gap: barStyle.gap }}>
      {BAR_HEIGHTS.map((height, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="animate-pulse bg-gray-200"
            style={{ width: barStyle.width, height, borderRadius: barStyle.borderRadius }}
          />
          <span
            className="animate-pulse rounded bg-gray-200"
            style={{
              width: "clamp(18px, 3vw, 32px)",
              height: "clamp(10px, 1.5vw, 16px)",
              marginTop: "clamp(6px, 1vw, 12px)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
