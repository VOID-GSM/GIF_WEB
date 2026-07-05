"use client";

import Reveal from "../landing/Reveal";
import { MEMBERS } from "../landing/data";

const EYEBROW = "text-[12px] font-extrabold uppercase tracking-[0.2em]";

export default function VoidView() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <Reveal>
        <p className={`mb-4 text-orange-600 ${EYEBROW}`}>Made by</p>
        <h1 className="text-[36px] font-bold leading-tight sm:text-[52px]">
          <span className="bg-gradient-to-r from-yellow-700 to-orange-600 bg-clip-text text-transparent">
            Team VOID
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-[16px] text-gray-500">
          GIF를 만든 사람들이에요.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {MEMBERS.map((m, i) => (
          <Reveal key={m.name} delay={(i % 5) * 90}>
            <div className="rounded-3xl border border-yellow-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-yellow-300 hover:shadow-new">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-[18px] font-extrabold text-gray-900">
                {m.initial}
              </div>
              <h3 className="mt-4 text-[16px] font-bold text-gray-900">
                {m.name}
              </h3>
              <p className="mt-1 text-[13px] text-gray-500">{m.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
