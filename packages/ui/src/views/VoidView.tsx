"use client";

import Reveal from "../landing/Reveal";
import { MEMBERS, type MemberItem } from "../landing/data";

const INTRO = [
  "VOID는 프로젝트 중심으로 진행하는 웹 개발 동아리입니다.",
  "Front-end, Back-end, Design, DevOps 등 여러 전공 분야의 팀원들이 소속해 서로의 전공을 이해하고 협업하며 프로젝트를 진행합니다.",
  "VOID에 합류하면 과제 기반 학습과 프로젝트 경험을 통해 개발 역량을 키우고, 활발한 전공 공유를 통해 지속적으로 성장할 수 있습니다.",
];

function MemberCard({ member }: { member: MemberItem }) {
  const inner = (
    <>
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-gray-900 ${
            member.lead
              ? "border-2 border-yellow-600 bg-yellow-100"
              : "border border-yellow-600 bg-yellow-50"
          }`}
        >
          {member.initial}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[17px] font-bold text-gray-900">
              {member.name}
            </h3>
            {member.lead && (
              <span className="shrink-0 rounded-full border border-yellow-600 bg-white px-2 py-0.5 text-[11px] font-bold text-gray-900">
                부장
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] text-gray-500">
            {member.role}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        {member.github ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 transition group-hover:text-gray-900">
            <svg
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
            </svg>
            GitHub 방문
            <span className="transition group-hover:translate-x-0.5">→</span>
          </span>
        ) : (
          <span className="text-[13px] text-gray-400">GitHub 미연결</span>
        )}
      </div>
    </>
  );

  const base = `group flex h-full flex-col rounded-3xl p-6 shadow-sm transition ${
    member.lead
      ? "border-2 border-yellow-600 bg-yellow-50"
      : "border border-yellow-100 bg-white"
  } hover:-translate-y-1 hover:border-yellow-300 hover:shadow-new`;

  if (member.github) {
    return (
      <a
        href={member.github}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} cursor-pointer`}
      >
        {inner}
      </a>
    );
  }

  return <div className={base}>{inner}</div>;
}

export default function VoidView() {
  return (
    <main className="pb-28 pt-15">
      {/* ===== Hero (움직이는 배경 애니메이션) ===== */}
      <section className="relative isolate overflow-hidden bg-yellow-50 px-6 py-28 sm:py-36">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <span className="gif-float absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-yellow-200 opacity-70" />
          <span className="gif-float-slow absolute right-[12%] top-[28%] h-16 w-16 rounded-3xl bg-yellow-300 opacity-60" />
          <span className="gif-float absolute bottom-[14%] left-[22%] h-12 w-12 rounded-2xl bg-yellow-400 opacity-50" />
          <span className="gif-float-slow absolute bottom-[20%] right-[24%] h-20 w-20 rounded-full bg-yellow-200 opacity-70" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <Reveal direction="none">
            <h1 className="gif-bob text-[64px] font-extrabold leading-none tracking-tight text-gray-900 sm:text-[96px]">
              VOID
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-8 text-[18px] font-medium leading-relaxed text-gray-700 sm:text-[22px]">
              VOID에게 공백은 아무것도 없는 상태가 아니라,
              <br className="hidden sm:block" />{" "}
              <span className="font-bold">
                <span className="rounded-md bg-yellow-200 px-2">
                  무엇이든 담을 수 있는 가능성
                </span>
              </span>
              입니다.
            </p>
          </Reveal>
        </div>

        <style>{`
          @keyframes gif-float {
            0%,100% { transform: translateY(0) rotate(0deg); }
            50%     { transform: translateY(-18px) rotate(6deg); }
          }
          @keyframes gif-bob {
            0%,100% { transform: translateY(0); }
            50%     { transform: translateY(-8px); }
          }
          .gif-float { animation: gif-float 5s ease-in-out infinite; }
          .gif-float-slow { animation: gif-float 7s ease-in-out infinite; }
          .gif-bob { animation: gif-bob 4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .gif-float, .gif-float-slow, .gif-bob { animation: none; }
          }
        `}</style>
      </section>

      {/* ===== Introduce ===== */}
      <section className="mx-auto max-w-5xl px-6">
        <Reveal>
          <h2 className="mt-20 text-[26px] font-bold italic text-gray-900 sm:text-[32px]">
            Introduce
          </h2>
        </Reveal>
        <div className="mt-8 space-y-4">
          {INTRO.map((text, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <div className="flex gap-4 rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm">
                <span className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-400" />
                <p className="text-[15px] leading-relaxed text-gray-600 sm:text-[16px]">
                  {text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ===== Members ===== */}
        <Reveal>
          <h2 className="mt-20 text-[26px] font-bold text-gray-900 sm:text-[32px]">
            함께 만든 <span className="rounded-md bg-yellow-200 px-2">사람들</span>
          </h2>
          <p className="mt-3 text-[15px] text-gray-500">
            카드를 누르면 각 팀원의 GitHub으로 이동해요.
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((m, i) => (
            <Reveal key={m.name} delay={(i % 3) * 90}>
              <MemberCard member={m} />
            </Reveal>
          ))}
        </div>

        {/* ===== Contact ===== */}
        <Reveal delay={120}>
          <div className="mt-14 rounded-3xl border border-yellow-100 bg-yellow-50 px-8 py-10 text-center">
            <p className="text-[16px] font-semibold text-gray-900">
              문의나 제안이 있으신가요?
            </p>
            <p className="mt-2 text-[14px] text-gray-500">
              언제든 Team VOID에게 편하게 연락해 주세요.
            </p>
            <a
              href="mailto:teamvoid0107@gmail.com"
              className="mt-6 inline-block rounded-full border border-yellow-600 bg-white px-6 py-2.5 text-[15px] font-bold text-gray-900 transition hover:bg-yellow-100 active:scale-95"
            >
              teamvoid0107@gmail.com
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
