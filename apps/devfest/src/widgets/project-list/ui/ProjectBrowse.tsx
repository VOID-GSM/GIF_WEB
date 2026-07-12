import { MOCK_PROJECTS, ProjectCard } from "@/entities/project";

export default function ProjectBrowse() {
  const count = MOCK_PROJECTS.length;
  // 프로젝트 이름 순 정렬 (한글/영문 혼용 — ko 로케일 기준)
  const projects = [...MOCK_PROJECTS].sort((a, b) =>
    a.name.localeCompare(b.name, "ko"),
  );

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gif-logo.png"
            alt="GIF"
            className="mx-auto h-14 w-auto md:h-16"
          />

          <p className="mt-7 text-[13px] font-semibold uppercase tracking-[0.22em] text-yellow-900">
            GSM Idea Festival
          </p>

          <h1 className="mt-3 text-[clamp(2.4rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-[-1.5px] text-black">
            <span className="marker-hl">DevFest</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[520px] text-[16px] leading-[1.7] text-gray-600">
            광주소프트웨어마이스터고 학생들이 직접 만든 프로젝트를 발표합니다
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
