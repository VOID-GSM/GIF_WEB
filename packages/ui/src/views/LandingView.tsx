"use client";

import Image from "next/image";
import Reveal from "../landing/Reveal";
import { FEATURES } from "../landing/data";

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
        {/* 배경: 아이디어 페스티벌 사진 + 검정 오버레이(사진 연하게) + 브랜드 블롭 */}
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
          <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-300 opacity-40 blur-[120px]" />
          <div className="absolute bottom-0 right-[-5%] h-[420px] w-[420px] rounded-full bg-orange-300 opacity-30 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-5%] h-[360px] w-[360px] rounded-full bg-yellow-200 opacity-30 blur-[120px]" />
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

        {/* 스크롤 인디케이터 — 마우스 휠 안에서 점이 아래로 내려가며 스크롤을 유도 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-[14px] border-2 border-yellow-600 p-1.5">
            <span
              className="h-2 w-2 rounded-full bg-orange-500"
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
            <p className="mb-4 text-orange-600">Features</p>
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
    </>
  );
}
