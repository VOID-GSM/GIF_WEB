import type { FilteredProject } from "../model/types";

interface ProjectCardProps {
  project: FilteredProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex h-[176px] w-[224px] shrink-0 flex-col overflow-hidden rounded-[12px] bg-white shadow-new">
      <div className="flex h-[112px] items-center justify-center p-4">
        {/* logoPath는 외부 API에서 내려오는 동적 URL이라 next/image 대신 img 사용 */}
        {/* 이미지가 없으면 GIF 로고를 fallback으로 표시 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.logoPath || "/gif-logo.png"}
          alt={project.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="flex h-[64px] flex-col justify-center bg-yellow-50 pl-[20px] pr-[32px] leading-[1.4]">
        <p className="text-[20px] font-semibold tracking-[-0.5px] text-black">
          {project.name}
        </p>
        <p className="text-[16px] font-medium tracking-[-0.4px] text-gray-600">
          {project.teamName}
        </p>
      </div>
    </div>
  );
}
