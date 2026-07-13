"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "../landing/Reveal";
import { WINNERS, type WinnerItem } from "../landing/data";

const GRADES = [1, 2] as const;

/** 로고가 있으면 이미지를, 없으면 팀 이니셜을 아바타로 보여준다. */
function WinnerAvatar({
  winner,
  highlight,
}: {
  winner: WinnerItem;
  highlight: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const size = highlight ? "h-16 w-16" : "h-14 w-14";

  if (!winner.logo || failed) {
    return (
      <div
        className={`flex ${size} items-center justify-center rounded-2xl border border-yellow-200 bg-yellow-50 text-[18px] font-extrabold text-gray-900`}
      >
        {winner.team ? winner.team.charAt(0) : winner.title.charAt(0)}
      </div>
    );
  }

  return (
    <div
      className={`flex ${size} items-center justify-center overflow-hidden rounded-2xl border border-yellow-200 bg-white`}
    >
      <Image
        src={winner.logo}
        alt={winner.title}
        width={64}
        height={64}
        unoptimized
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function WinnerCard({
  winner,
  highlight,
}: {
  winner: WinnerItem;
  highlight: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-3xl p-8 transition ${
        highlight
          ? "border-2 border-yellow-600 bg-yellow-50 shadow-new"
          : "border border-yellow-100 bg-white shadow-sm hover:shadow-new"
      }`}
    >
      <div className="flex items-center justify-between">
        <WinnerAvatar winner={winner} highlight={highlight} />
        <span className="inline-flex items-center rounded-full border border-yellow-600 bg-white px-3 py-1 text-[12px] font-bold text-gray-900">
          {winner.rank}
        </span>
      </div>

      <h3
        className={`mt-5 font-bold text-gray-900 ${highlight ? "text-[24px]" : "text-[20px]"}`}
      >
        {winner.title}
      </h3>
      {winner.team && (
        <p className="mt-1 text-[14px] font-semibold text-orange-600">
          {winner.team}
        </p>
      )}
      {winner.desc && (
        <p className="mt-3 text-[14px] leading-relaxed text-gray-500">
          {winner.desc}
        </p>
      )}
      {winner.members.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {winner.members.map((name) => (
            <span
              key={name}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-medium text-gray-600"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WinnersView() {
  const [grade, setGrade] = useState<(typeof GRADES)[number]>(1);
  const winners = WINNERS.filter((winner) => winner.grade === grade);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <Reveal>
        <h1 className="text-[36px] font-bold leading-tight text-gray-900 sm:text-[52px]">
          2025 <span className="rounded-md bg-yellow-200 px-2">수상작</span>{" "}
          모음
        </h1>
        <p className="mt-4 max-w-xl text-[16px] text-gray-500">
          지난 페스티벌을 빛낸 팀들을 소개해요. 학년을 선택해 확인해 보세요.
        </p>
      </Reveal>

      {/* 학년 선택 탭 */}
      <Reveal delay={80}>
        <div className="mt-10 flex gap-6 border-b border-gray-200">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              className={`-mb-px cursor-pointer border-b-2 px-1 pb-3 text-[16px] font-bold transition ${
                grade === g
                  ? "border-yellow-500 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {g}학년
            </button>
          ))}
        </div>
      </Reveal>

      {/* 시상대 — 최우수상을 가운데에 크게, 우수·장려상은 같은 크기 (모바일은 1→2→3위) */}
      <div
        key={grade}
        className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch"
      >
        {winners.map((winner, i) => {
          const isFirst = i === 0;
          // 데스크톱: 우수상(왼쪽) · 최우수상(가운데) · 장려상(오른쪽)
          const orderClass = isFirst
            ? "order-1 md:order-2"
            : i === 1
              ? "order-2 md:order-1"
              : "order-3 md:order-3";

          return (
            <Reveal
              key={`${grade}-${winner.team}-${winner.title}`}
              delay={i * 120}
              className={`h-full ${orderClass} ${isFirst ? "md:scale-[1.03]" : ""}`}
            >
              <WinnerCard winner={winner} highlight={isFirst} />
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
