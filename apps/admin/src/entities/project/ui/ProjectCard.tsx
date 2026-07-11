import Link from "next/link";
import { ProjectLogo } from "@repo/ui";

import type { FilteredProject } from "../model/types";

interface ProjectCardProps {
  project: FilteredProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex h-[176px] w-[224px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[12px] bg-white shadow-new transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="h-[112px] w-full">
        <ProjectLogo
          src={project.logo}
          alt={project.name}
          className="h-full w-full object-cover"
          fallbackClassName="h-full w-full bg-white object-contain p-5"
        />
      </div>
      <div className="flex h-[64px] flex-col justify-center bg-yellow-50 pl-[20px] pr-[32px] leading-[1.4]">
        <p className="truncate text-[20px] font-semibold tracking-[-0.5px] text-black">
          {project.name}
        </p>
        <p className="truncate text-[16px] font-medium tracking-[-0.4px] text-gray-600">
          {project.teamName}
        </p>
      </div>
    </Link>
  );
}
