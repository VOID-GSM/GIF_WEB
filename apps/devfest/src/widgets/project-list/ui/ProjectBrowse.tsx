import { MOCK_PROJECTS, ProjectCard } from "@/entities/project";

export default function ProjectBrowse() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      {/* GIF 브랜드 히어로 */}
      <section className="border-b border-gray-200 bg-white px-4 py-14 md:py-20">
        <div className="mx-auto max-w-[1000px] text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gif-logo.png"
            alt="GIF"
            className="mx-auto h-14 w-auto md:h-16"
          />
          <h1 className="mt-6 text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-1px] text-black">
            DevFest
          </h1>
          <p className="mt-3 text-[16px] text-gray-600">
            GSM Idea Festival · 학생 프로젝트 쇼케이스
          </p>
        </div>
      </section>

      {/* 프로젝트 그리드 */}
      <section className="mx-auto flex max-w-[1000px] flex-col items-center px-4 py-12">
        {MOCK_PROJECTS.length === 0 ? (
          <p className="py-20 text-gray-600">등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid w-full grid-cols-[repeat(auto-fill,224px)] justify-center gap-6">
            {MOCK_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
