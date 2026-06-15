"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  GRADES,
  ProjectCard,
  useGetFilteredProjects,
  type Grade,
} from "@/entities/project";
import GradeFilter from "@/features/project-filter/ui/GradeFilter";

function parseGrade(value: string | null): Grade {
  const parsed = Number(value);
  return (GRADES as readonly number[]).includes(parsed)
    ? (parsed as Grade)
    : GRADES[0];
}

export default function ProjectListView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const grade = parseGrade(searchParams.get("grade"));
  const { data: projects, isPending, isError } = useGetFilteredProjects(grade);
  // 서버가 grade로 거르지 않고 전체를 반환하므로 선택 학년으로 한 번 더 거른다
  const visibleProjects = projects?.filter((project) => project.grade === grade);

  const handleChange = (next: Grade) => {
    router.replace(`${pathname}?grade=${next}`, { scroll: false });
  };

  return (
    <div className="flex flex-col items-center gap-12 px-4 py-10">
      <GradeFilter value={grade} onChange={handleChange} />

      {isPending ? (
        <p className="text-gray-600">불러오는 중...</p>
      ) : isError ? (
        <p className="text-gray-600">프로젝트를 불러오지 못했습니다.</p>
      ) : !visibleProjects || visibleProjects.length === 0 ? (
        <p className="pt-70 text-gray-600">해당 학년의 프로젝트가 없습니다.</p>
      ) : (
        <div className="grid w-full max-w-[1000px] grid-cols-[repeat(auto-fill,224px)] justify-center gap-6">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
