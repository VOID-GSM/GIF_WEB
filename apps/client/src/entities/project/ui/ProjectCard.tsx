import { useTranslations } from "next-intl";
import Link from "next/link";
import { ProjectLogo } from "@repo/ui";

import { CommentIcon, HeartIcon } from "@/shared/ui/EngagementIcons";

import type { FilteredProject } from "../model/types";

interface ProjectCardProps {
  project: FilteredProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("project.card");
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex h-[176px] w-[224px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[12px] bg-white shadow-new transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-[112px] w-full">
        <ProjectLogo
          src={project.logo}
          alt={project.name}
          className="h-full w-full object-cover"
          fallbackClassName="h-full w-full bg-white object-contain p-5"
        />
        {/* 좋아요 · 댓글 수 — 로고 우하단 칩 (고정 높이 레이아웃 유지) */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
          <span className="flex items-center gap-1" aria-label={t("likes")}>
            <HeartIcon
              filled={project.isLiked === true}
              className={`h-3.5 w-3.5 ${project.isLiked ? "text-yellow-500" : ""}`}
            />
            {project.likeCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1" aria-label={t("comments")}>
            <CommentIcon className="h-3.5 w-3.5" />
            {project.commentCount.toLocaleString()}
          </span>
        </div>
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
