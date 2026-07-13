"use client";

import Reveal from "../landing/Reveal";
import { STATS, SCHEDULE } from "../landing/data";

const POINTS = [
  {
    title: "자유로운 주제",
    desc: "정해진 틀 없이 팀이 원하는 아이디어를 자유롭게 구현해요.",
  },
  {
    title: "팀 프로젝트",
    desc: "기획부터 개발, 발표까지 팀원과 함께 하나의 결과물을 완성해요.",
  },
  {
    title: "영역별 심사",
    desc: "전공중심영역·사회중심영역·보고서영역으로 나눠 평가해요.",
  },
  {
    title: "학년별 시상",
    desc: "1·2학년 각각 최우수·우수·장려상으로 우수 팀을 시상해요.",
  },
];

export default function AboutView() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-28 pt-32">
      <Reveal>
        <h1 className="text-[36px] font-bold leading-tight text-gray-900 sm:text-[52px]">
          <span className="rounded-md bg-yellow-200 px-2">
            아이디어페스티벌
          </span>
          이란?
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          아이디어 페스티벌은 광주소프트웨어마이스터고 학생들이 팀을 이뤄
          자유로운 주제로 프로젝트를 기획·개발하고, 그 결과물을 발표·심사받는
          교내 최대 규모의 창작 축제입니다. 상상 속 아이디어를 직접 손으로
          구현해 보며, 기획력과 개발 실력은 물론 팀으로 협업하는 경험까지 함께
          쌓을 수 있어요.
        </p>
      </Reveal>

      <Reveal delay={180}>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          GIF(Gsm Idea Festival)는 기존의 수기 방식에서 벗어나 팀 구성부터 자료
          제출, 평가, 점수 집계까지 전 과정을 하나의 플랫폼으로 통합해 운영
          효율을 극대화합니다. 학생은 제출에만 집중하고, 선생님은 심사와 집계를
          더 빠르고 정확하게 진행할 수 있어요.
        </p>
      </Reveal>

      {/* 수치 요약 */}
      <Reveal delay={220}>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-yellow-600 bg-yellow-50 px-5 py-7 text-center"
            >
              <div className="text-[34px] font-extrabold text-gray-900">
                {s.value}
              </div>
              <div className="mt-1 text-[13px] font-medium text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 특징 */}
      <Reveal delay={260}>
        <h2 className="mt-20 text-[24px] font-bold text-gray-900 sm:text-[30px]">
          이런 점이 <span className="rounded-md bg-yellow-200 px-2">특별</span>
          해요
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {POINTS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 120}>
            <div className="h-full rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm transition hover:border-yellow-300 hover:shadow-new">
              <span className="block h-1.5 w-10 rounded-full bg-yellow-400" />
              <h3 className="mt-4 text-[18px] font-bold text-gray-900">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-gray-500">
                {p.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 일정 */}
      <Reveal>
        <h2 className="mt-20 text-[24px] font-bold text-gray-900 sm:text-[30px]">
          전체 <span className="rounded-md bg-yellow-200 px-2">일정</span>
        </h2>
        <p className="mt-3 text-[14px] text-gray-500">
          집중 기간에는 정규 수업 없이 페스티벌 준비에만 집중해요.
        </p>
      </Reveal>
      <ol className="mt-8 space-y-4 border-l-2 border-yellow-200 pl-6 sm:pl-8">
        {SCHEDULE.map((s, i) => (
          <Reveal key={s.period} delay={(i % 3) * 90}>
            <li className="relative">
              <span
                className={`absolute top-4 h-3.5 w-3.5 rounded-full border-2 ${
                  s.focus
                    ? "border-yellow-600 bg-yellow-400"
                    : "border-yellow-500 bg-white"
                } ${"-left-[33px] sm:-left-[41px]"}`}
              />
              <div
                className={`flex flex-col gap-1 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-5 ${
                  s.focus
                    ? "border border-yellow-600 bg-yellow-50"
                    : "border border-yellow-100 bg-white shadow-sm"
                }`}
              >
                <span className="shrink-0 text-[14px] font-bold text-gray-900 sm:w-32">
                  {s.period}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-gray-900">
                    {s.title}
                  </p>
                  {s.note && (
                    <p className="mt-0.5 text-[13px] text-gray-500">{s.note}</p>
                  )}
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </main>
  );
}
