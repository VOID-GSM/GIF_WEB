"use client";

import Link from "next/link";
import { ProjectLogo } from "@repo/ui";

import { useGetProject, type FilteredProject } from "@/entities/project";

interface MyProjectCardProps {
  project: FilteredProject;
}

export default function MyProjectCard({ project }: MyProjectCardProps) {
  const { data: detail } = useGetProject(project.id);
  const memberNames = detail?.members.map((member) => member.name).join(", ");

  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex w-full flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="h-[180px] w-full">
        <ProjectLogo
          src={project.logo}
          alt={project.name}
          className="h-full w-full object-cover"
          fallbackClassName="h-full w-full bg-white object-contain p-10"
        />
      </div>
      <div className="flex flex-col gap-0.5 bg-yellow-50 px-5 py-4">
        <p className="truncate text-[18px] font-semibold tracking-[-0.5px] text-black">
          {project.name}
        </p>
        <p className="truncate text-[14px] font-medium tracking-[-0.4px] text-gray-600">
          {project.teamName}
        </p>
        {memberNames && (
          <p className="truncate text-[13px] text-gray-500">{memberNames}</p>
        )}
      </div>
    </Link>
  );
}
