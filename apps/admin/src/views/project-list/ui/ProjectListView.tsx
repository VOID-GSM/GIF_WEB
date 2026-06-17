"use client";

import {
  GRADES,
  ProjectCard,
  useGetFilteredProjects,
  useStoredGrade,
} from "@/entities/project";
import GradeFilter from "@/features/project-filter/ui/GradeFilter";

export default function ProjectListView() {
  // 마지막으로 선택한 학년을 복원한다 (확정 전엔 null → 초기 학년 깜빡임 방지)
  const { grade, setGrade } = useStoredGrade();

  const {
    data: projects,
    isPending,
    isError,
  } = useGetFilteredProjects(grade ?? GRADES[0], grade !== null);
  // 서버가 grade로 거르지 않고 전체를 반환하므로 선택 학년으로 한 번 더 거른다
  const visibleProjects = projects?.filter((project) => project.grade === grade);

  if (grade === null) {
    return (
      <div className="flex flex-col items-center gap-12 px-4 py-10">
        <p className="text-gray-600">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-12 px-4 py-10">
      <GradeFilter value={grade} onChange={setGrade} />

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
