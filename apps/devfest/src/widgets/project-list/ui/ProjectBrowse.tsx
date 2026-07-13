import Link from "next/link";

import { MOCK_PROJECTS, ProjectCard } from "@/entities/project";

// 정적 데이터이므로 모듈 로드 시 1회만 정렬 (렌더마다 재정렬 방지)
// 프로젝트 이름 순 정렬 (한글/영문 혼용 — ko 로케일 기준)
const SORTED_PROJECTS = [...MOCK_PROJECTS].sort((a, b) =>
  a.name.localeCompare(b.name, "ko"),
);

const GIF_PROJECT = MOCK_PROJECTS.find((project) => project.name === "GIF");

export default function ProjectBrowse() {
  const count = SORTED_PROJECTS.length;
  const projects = SORTED_PROJECTS;

  return (
    <div className="min-h-screen bg-background">
      {/* GIF 브랜드 히어로 — 옐로우 웜톤 그라데이션 위에 형광펜 강조 */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-yellow-50 to-background">
        {/* 은은한 옐로우 글로우 */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-30%] h-[420px] w-[720px] max-w-[120vw] -translate-x-1/2 rounded-full bg-yellow-200/40 blur-[120px]"
        />

        <div className="relative mx-auto max-w-[1000px] px-4 py-16 text-center md:py-24">
          <Link
            href={GIF_PROJECT ? `/projects/${GIF_PROJECT.id}` : "#"}
            className="gif-logo-wrap mx-auto"
            aria-label="GIF 프로젝트 상세 보기"
          >
            <span aria-hidden className="gif-logo-glow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gif-logo.png"
              alt="GIF"
              className="h-14 w-auto cursor-pointer md:h-16"
            />
          </Link>

          <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.22em] text-yellow-900">
            제 3회 프로젝트 모음
          </p>

          <h1 className="mx-auto mt-3 max-w-[15ch] text-[clamp(1.9rem,5vw,3.1rem)] font-bold leading-[1.12] tracking-[-1.5px] text-black">
            <span className="marker-hl">DevFest</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[520px] text-[16px] leading-[1.7] text-gray-600">
            광주소프트웨어마이스터고 학생 프로젝트 발표회
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-yellow-600/30 bg-white/70 px-4 py-1.5 text-[14px] font-medium text-gray-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-yellow-600" />총 {count}개
            프로젝트
          </div>
        </div>
      </section>

      {/* 프로젝트 그리드 */}
      <section className="mx-auto max-w-[1120px] px-4 py-14 md:py-16">
        {count === 0 ? (
          <p className="py-20 text-center text-gray-600">
            등록된 프로젝트가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
