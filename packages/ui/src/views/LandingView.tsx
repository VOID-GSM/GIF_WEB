"use client";

import Image from "next/image";
import Reveal from "../landing/Reveal";
import { FEATURES, STEPS } from "../landing/data";

interface LandingViewProps {
  /** 로그인 페이지 경로 (기본 /signin) */
  signinHref?: string;
}

export default function LandingView({
  signinHref = "/signin",
}: LandingViewProps) {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* 배경: 아이디어 페스티벌 사진 + 검정 오버레이(사진 연하게) + 연노랑 글로우 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/ideafestival.png"
            alt=""
            width={1920}
            height={1080}
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* 사진 위에 깔리는 검정 레이어 — 사진을 연하게 만든다 */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300 opacity-30 blur-[130px]" />
          <div className="absolute bottom-[5%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-200 opacity-25 blur-[130px]" />
        </div>

        <Image
          src="/logo.png"
          alt="GIF"
          width={300}
          height={200}
          priority
          className="h-auto w-[180px] sm:w-[240px] md:w-[280px]"
        />

        <p className="mt-8 max-w-xl text-[18px] font-semibold text-white sm:text-[22px]">
          아이디어가 현실이 되는 곳,
          <br className="hidden sm:block" /> 광주소프트웨어마이스터고 아이디어
          페스티벌
        </p>

        <a
          href={signinHref}
          className="mt-9 inline-block rounded-full bg-yellow-600 px-8 py-3 text-[16px] font-bold text-gray-900 shadow-new transition hover:bg-yellow-500 active:scale-[0.98]"
        >
          시작하기 →
        </a>

        {/* 스크롤 인디케이터 — 마우스 휠 안에서 점이 아래로 내려가며 스크롤을 유도 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-[14px] border-2 border-yellow-500 p-1.5">
            <span
              className="h-2 w-2 rounded-full bg-yellow-400"
              style={{
                animation: "gif-scroll-wheel 1.6s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes gif-scroll-wheel {
            0%   { opacity: 0; transform: translateY(0); }
            25%  { opacity: 1; }
            75%  { opacity: 1; transform: translateY(12px); }
            100% { opacity: 0; transform: translateY(12px); }
          }
        `}</style>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="scroll-mt-16 bg-yellow-50 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-[32px] font-bold leading-tight text-gray-900 sm:text-[44px]">
              <span className="rounded-md bg-yellow-200 px-2">GIF</span>가
              도와드려요
            </h2>
            <p className="mt-4 max-w-xl text-[16px] text-gray-500">
              팀 구성부터 자료 제출, 평가, 점수 집계까지 — 페스티벌 운영에 필요한
              모든 기능을 하나의 플랫폼에 담았어요.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100}>
                <div className="group h-full rounded-3xl border border-yellow-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-yellow-300 hover:shadow-new">
                  <span className="block h-1.5 w-10 rounded-full bg-yellow-400" />
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

      {/* ===== Steps ===== */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-[32px] font-bold leading-tight text-gray-900 sm:text-[44px]">
              이렇게 <span className="rounded-md bg-yellow-200 px-2">참여</span>
              해요
            </h2>
            <p className="mt-4 max-w-xl text-[16px] text-gray-500">
              팀 구성부터 발표·심사까지, 페스티벌은 이렇게 진행돼요.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delay={(i % 4) * 100}>
                <div className="h-full rounded-3xl border border-yellow-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-yellow-300 hover:shadow-new">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-600 bg-yellow-50 text-[16px] font-extrabold text-gray-900">
                    {s.step}
                  </div>
                  <h3 className="mt-5 text-[18px] font-bold text-gray-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-yellow-100 py-32 text-center">
        <Reveal>
          <h2 className="px-6 text-[34px] font-extrabold text-gray-900 sm:text-[48px]">
            지금, 당신의 아이디어를 시작하세요
          </h2>
          <p className="mt-4 text-[16px] font-medium text-gray-600">
            GIF와 함께라면 준비부터 수상까지 한 걸음이에요.
          </p>
          <a
            href={signinHref}
            className="mt-10 inline-block rounded-full border border-yellow-600 bg-white px-10 py-4 text-[16px] font-bold text-gray-900 shadow-sm transition hover:bg-yellow-50 active:scale-[0.98]"
          >
            시작하기 →
          </a>
        </Reveal>
      </section>
    </>
  );
}
