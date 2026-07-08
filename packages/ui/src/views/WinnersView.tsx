"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "../landing/Reveal";
import { WINNERS, type WinnerItem } from "../landing/data";

const EYEBROW = "text-[12px] font-extrabold uppercase tracking-[0.2em]";
const GRADES = [1, 2] as const;

/** 로고가 있으면 이미지를, 없거나 로드 실패 시 메달 이모지를 보여준다. */
function WinnerLogo({ winner }: { winner: WinnerItem }) {
  const [failed, setFailed] = useState(false);

  if (!winner.logo || failed) {
    return <div className="text-[44px]">{winner.medal}</div>;
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <Image
        src={winner.logo}
        alt={winner.title}
        width={64}
        height={64}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function WinnerCard({ winner }: { winner: WinnerItem }) {
  if (winner.pending) {
    return (
      <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <div className="inline-block rounded-full bg-gradient-to-r from-yellow-600 to-orange-500 px-3 py-1 text-[12px] font-bold text-gray-900">
          {winner.rank}
        </div>
        <p className="mt-4 text-[15px] font-semibold text-gray-400">공개 예정</p>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-yellow-100 bg-white p-8 shadow-sm transition hover:shadow-new">
      <div
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${winner.accent}`}
      />
      <WinnerLogo winner={winner} />
      <div className="mt-3 inline-block rounded-full bg-gradient-to-r from-yellow-600 to-orange-500 px-3 py-1 text-[12px] font-bold text-gray-900">
        {winner.rank}
      </div>
      <h3 className="mt-4 text-[20px] font-bold text-gray-900">{winner.title}</h3>
      {winner.team && (
        <p className="mt-1 text-[14px] font-semibold text-orange-700">
          {winner.team}
        </p>
      )}
      <p className="mt-3 text-[14px] leading-relaxed text-gray-500">
        {winner.desc}
      </p>
      {winner.members.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
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
  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <Reveal>
        <p className={`mb-4 text-orange-600 ${EYEBROW}`}>Hall of Fame</p>
        <h1 className="text-[36px] font-bold leading-tight sm:text-[52px]">
          2025{" "}
          <span className="bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">
            수상작 모음
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-[16px] text-gray-500">
          지난 페스티벌을 빛낸 팀들을 소개해요.
        </p>
      </Reveal>

      {GRADES.map((grade) => {
        const winners = WINNERS.filter((winner) => winner.grade === grade);
        if (winners.length === 0) return null;

        return (
          <section key={grade} className="mt-16">
            <Reveal>
              <h2 className="text-[24px] font-bold text-gray-900 sm:text-[28px]">
                {grade}학년
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {winners.map((winner, i) => (
                <Reveal key={`${grade}-${winner.rank}`} delay={i * 120}>
                  <WinnerCard winner={winner} />
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
