"use client";

import { useTranslations } from "next-intl";

import Reveal from "../landing/Reveal";
import { STATS, SCHEDULE } from "../landing/data";

const POINT_KEYS = ["freeTopic", "teamProject", "areaReview", "gradeAward"] as const;

const highlight = (chunks: React.ReactNode) => (
  <span className="rounded-md bg-yellow-200 px-2">{chunks}</span>
);

export default function AboutView() {
  const t = useTranslations("intro.about");
  return (
    <main className="mx-auto max-w-5xl px-6 pb-28 pt-32">
      <Reveal>
        <h1 className="text-[36px] font-bold leading-tight text-gray-900 sm:text-[52px]">
          {t.rich("title", { hl: highlight })}
        </h1>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-6 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          {t("intro1")}
        </p>
      </Reveal>

      <Reveal delay={180}>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          {t("intro2")}
        </p>
      </Reveal>

      {/* 수치 요약 */}
      <Reveal delay={220}>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.key}
              className="rounded-2xl border border-yellow-600 bg-yellow-50 px-5 py-7 text-center"
            >
              <div className="text-[34px] font-extrabold text-gray-900">
                {s.value}
              </div>
              <div className="mt-1 text-[13px] font-medium text-gray-500">
                {t(`stats.${s.key}`)}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 특징 */}
      <Reveal delay={260}>
        <h2 className="mt-20 text-[24px] font-bold text-gray-900 sm:text-[30px]">
          {t.rich("pointsTitle", { hl: highlight })}
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {POINT_KEYS.map((key, i) => (
          <Reveal key={key} delay={(i % 2) * 120}>
            <div className="h-full rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm transition hover:border-yellow-300 hover:shadow-new">
              <span className="block h-1.5 w-10 rounded-full bg-yellow-400" />
              <h3 className="mt-4 text-[18px] font-bold text-gray-900">
                {t(`points.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-gray-500">
                {t(`points.${key}.desc`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 일정 */}
      <Reveal>
        <h2 className="mt-20 text-[24px] font-bold text-gray-900 sm:text-[30px]">
          {t.rich("scheduleTitle", { hl: highlight })}
        </h2>
        <p className="mt-3 text-[14px] text-gray-500">
          {t("scheduleDesc")}
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
                    {t(`schedule.${s.key}`)}
                  </p>
                  {s.focus && (
                    <p className="mt-0.5 text-[13px] text-gray-500">
                      {t("focusNote")}
                    </p>
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
