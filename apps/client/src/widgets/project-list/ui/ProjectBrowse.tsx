"use client";

import { useState } from "react";

import {
  GRADES,
  ProjectCard,
  useGetFilteredProjects,
  type Grade,
} from "@/entities/project";
import GradeFilter from "@/features/project-filter/ui/GradeFilter";

export default function ProjectBrowse() {
  const [grade, setGrade] = useState<Grade>(GRADES[0]);
  const { data: projects, isPending, isError } = useGetFilteredProjects(grade);

  return (
    <div className="flex flex-col items-center gap-12 px-4 py-10">
      <GradeFilter value={grade} onChange={setGrade} />

      {isPending ? (
        <p className="text-gray-600">불러오는 중...</p>
      ) : isError ? (
        <p className="text-gray-600">프로젝트를 불러오지 못했습니다.</p>
      ) : !projects || projects.length === 0 ? (
        <p className="pt-70 text-gray-600">해당 학년의 프로젝트가 없습니다.</p>
      ) : (
        <div className="grid w-full max-w-[1000px] grid-cols-[repeat(auto-fill,224px)] justify-center gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
