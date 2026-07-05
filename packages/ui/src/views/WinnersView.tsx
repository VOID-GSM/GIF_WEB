"use client";

import Reveal from "../landing/Reveal";
import { WINNERS } from "../landing/data";

const EYEBROW = "text-[12px] font-extrabold uppercase tracking-[0.2em]";

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

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {WINNERS.map((w, i) => (
          <Reveal key={w.team} delay={i * 120}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-yellow-100 bg-white p-8 shadow-sm transition hover:shadow-new">
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${w.accent}`}
              />
              <div className="text-[44px]">{w.medal}</div>
              <div className="mt-3 inline-block rounded-full bg-gradient-to-r from-yellow-600 to-orange-500 px-3 py-1 text-[12px] font-bold text-gray-900">
                {w.rank}
              </div>
              <h3 className="mt-4 text-[20px] font-bold text-gray-900">
                {w.title}
              </h3>
              <p className="mt-1 text-[14px] font-semibold text-orange-700">
                {w.team}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-gray-500">
                {w.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
