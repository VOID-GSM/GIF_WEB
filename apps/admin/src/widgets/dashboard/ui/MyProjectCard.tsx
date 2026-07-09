"use client";

import Link from "next/link";

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
      className="flex h-[112px] w-full items-center overflow-hidden rounded-[12px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="h-[112px] w-[224px] shrink-0">
        {/* logo는 외부 API에서 내려오는 동적 URL이라 next/image 대신 img 사용 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.logo}
          alt={project.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex h-full min-w-0 flex-1 flex-col justify-center gap-0.5 bg-yellow-50 pl-[20px] pr-[16px]">
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
