"use client";

import Reveal from "../landing/Reveal";
import { STATS } from "../landing/data";

const EYEBROW = "text-[12px] font-extrabold uppercase tracking-[0.2em]";

export default function AboutView() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-28 pt-32">
      <Reveal>
        <p className={`mb-4 text-orange-600 ${EYEBROW}`}>About</p>
        <h1 className="text-[36px] font-bold leading-tight sm:text-[52px]">
          <span className="bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">
            아이디어페스티벌
          </span>
          이란?
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          아이디어 페스티벌은 광주소프트웨어마이스터고 학생들이 팀을 이뤄
          자유로운 주제로 소프트웨어 프로젝트를 기획·개발하고, 그 결과물을
          발표·심사받는 교내 최대 규모의 창작 축제입니다. GIF는 기존의 수기
          방식에서 벗어나 팀 구성부터 자료 제출, 평가, 점수 집계까지 전 과정을
          하나의 플랫폼으로 통합해 운영 효율을 극대화합니다.
        </p>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-7 text-center"
            >
              <div className="bg-gradient-to-br from-yellow-700 to-orange-600 bg-clip-text text-[34px] font-extrabold text-transparent">
                {s.value}
              </div>
              <div className="mt-1 text-[13px] font-medium text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
