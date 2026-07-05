"use client";

import Image from "next/image";
import IntroHeader from "../landing/IntroHeader";
import Reveal from "../landing/Reveal";
import { STATS, FEATURES, WINNERS, MEMBERS } from "../landing/data";

interface LandingViewProps {
  /** 로그인 페이지 경로 (기본 /signin) */
  signinHref?: string;
}

// 섹션 상단 눈에 띄는 라벨 공통 스타일 (Pretendard, 브랜드 색상).
const EYEBROW = "text-[12px] font-extrabold uppercase tracking-[0.2em]";

export default function LandingView({
  signinHref = "/signin",
}: LandingViewProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900">
      <IntroHeader signinHref={signinHref} />

      {/* ===== Hero ===== */}
      <section
        id="top"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        {/* 배경 그라데이션 블롭 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300 opacity-60 blur-[120px]" />
          <div className="absolute bottom-0 right-[-5%] h-[420px] w-[420px] rounded-full bg-orange-300 opacity-50 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-5%] h-[360px] w-[360px] rounded-full bg-yellow-200 opacity-50 blur-[120px]" />
        </div>

        <span
          className={`mb-8 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-orange-700 ${EYEBROW}`}
        >
          GSM Idea Festival
        </span>

        <Image
          src="/gif-logo.png"
          alt="GIF"
          width={300}
          height={200}
          priority
          className="h-auto w-[180px] sm:w-[240px] md:w-[280px]"
        />

        <p className="mt-8 max-w-xl text-[18px] font-semibold text-gray-700 sm:text-[22px]">
          아이디어가 현실이 되는 곳,
          <br className="hidden sm:block" /> 광주소프트웨어마이스터고 아이디어
          페스티벌
        </p>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-gray-500">
          팀 프로젝트 관리부터 제출·평가·순위까지, 페스티벌의 모든 과정을 한
          곳에서.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={signinHref}
            className="group rounded-full bg-gradient-to-r from-yellow-600 to-orange-500 px-8 py-4 text-[15px] font-bold text-gray-900 shadow-new transition hover:from-yellow-500 hover:to-orange-400 active:scale-[0.98]"
          >
            시작하기
            <span className="ml-1 inline-block transition group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#about"
            className="rounded-full border border-yellow-600 bg-white/70 px-8 py-4 text-[15px] font-semibold text-orange-700 backdrop-blur transition hover:bg-yellow-50"
          >
            더 알아보기
          </a>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-yellow-600 p-1.5">
            <span className="h-2 w-1 animate-bounce rounded-full bg-orange-500" />
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      <section id="about" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-28">
        <Reveal>
          <p className={`mb-4 text-orange-600 ${EYEBROW}`}>About</p>
          <h2 className="text-[32px] font-bold leading-tight sm:text-[44px]">
            <span className="bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">
              아이디어 페스티벌
            </span>
            이란?
          </h2>
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

        {/* 통계 */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-7 text-center">
                <div className="bg-gradient-to-br from-yellow-700 to-orange-600 bg-clip-text text-[34px] font-extrabold text-transparent">
                  {s.value}
                </div>
                <div className="mt-1 text-[13px] font-medium text-gray-500">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="scroll-mt-16 bg-yellow-50 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className={`mb-4 text-orange-600 ${EYEBROW}`}>Features</p>
            <h2 className="text-[32px] font-bold leading-tight sm:text-[44px]">
              <span className="bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">
                GIF
              </span>
              가 도와드려요
            </h2>
            <p className="mt-4 max-w-xl text-[16px] text-gray-500">
              페스티벌 운영에 필요한 모든 기능을 담았어요.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100}>
                <div className="group h-full rounded-3xl border border-yellow-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-yellow-300 hover:shadow-new">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-200 text-[24px] transition group-hover:from-yellow-300 group-hover:to-orange-300">
                    {f.icon}
                  </div>
                  <h3 className="mt-5 text-[19px] font-bold text-gray-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Winners ===== */}
      <section id="winners" className="scroll-mt-16 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className={`mb-4 text-orange-600 ${EYEBROW}`}>Hall of Fame</p>
            <h2 className="text-[32px] font-bold leading-tight sm:text-[44px]">
              2025{" "}
              <span className="bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">
                수상작
              </span>
            </h2>
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
        </div>
      </section>

      {/* ===== Team VOID ===== */}
      <section id="team" className="scroll-mt-16 bg-gray-900 py-28 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className={`mb-4 text-yellow-500 ${EYEBROW}`}>Made by</p>
            <h2 className="text-[32px] font-bold leading-tight sm:text-[44px]">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
                Team VOID
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-[16px] text-gray-400">
              GIF를 만든 사람들이에요.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {MEMBERS.map((m, i) => (
              <Reveal key={m.name} delay={(i % 5) * 90}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-yellow-500/40 hover:bg-white/10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-[18px] font-extrabold text-gray-900">
                    {m.initial}
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold">{m.name}</h3>
                  <p className="mt-1 text-[13px] text-gray-400">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden py-32 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-500"
        />
        <Reveal>
          <h2 className="px-6 text-[34px] font-extrabold text-gray-900 sm:text-[48px]">
            지금, 당신의 아이디어를 시작하세요
          </h2>
          <p className="mt-4 text-[16px] font-medium text-gray-900/70">
            GIF와 함께라면 준비부터 수상까지 한 걸음이에요.
          </p>
          <a
            href={signinHref}
            className="mt-10 inline-block rounded-full bg-gray-900 px-10 py-4 text-[16px] font-bold text-white shadow-new transition hover:bg-black active:scale-[0.98]"
          >
            시작하기 →
          </a>
        </Reveal>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-yellow-100 py-10 text-center">
        <p className={`text-orange-600 ${EYEBROW}`}>GIF · Team VOID</p>
        <p className="mt-3 text-[13px] text-gray-400">
          © 2026 VOID. Gwangju Software Meister High School.
        </p>
      </footer>
    </div>
  );
}
