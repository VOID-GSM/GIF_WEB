"use client";

import { useRef } from "react";
import Link from "next/link";
import { ProjectLogo } from "@repo/ui";

import type { Project } from "../model/types";
import { useLogoBg } from "../lib/logoBg";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoBg = useLogoBg(project.logo, project.logoBg);

  const handleEnter = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handleLeave = () => {
    videoRef.current?.pause();
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-new ring-1 ring-black/[0.06] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:ring-yellow-600/40"
    >
      {/* 미디어 — 로고는 전체가 보이도록 contain + 여백, 호버 시 시연 영상이 꽉 채움.
          배경은 로고 배경색에 맞추고, 투명/흰색 로고는 기본 회색을 사용 */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden ${
          logoBg ? "" : "bg-gradient-to-br from-gray-50 to-gray-100"
        }`}
        style={logoBg ? { backgroundColor: logoBg } : undefined}
      >
        <ProjectLogo
          src={project.logo}
          alt={project.name}
          className={`absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
            project.logoFit === "cover"
              ? "object-cover"
              : "object-contain p-6"
          }`}
          fallbackClassName="absolute inset-0 h-full w-full object-contain p-6"
        />
        {project.demoVideoUrl && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <source src={project.demoVideoUrl} type="video/mp4" />
          </video>
        )}
        {/* 상단 옐로우 라인 — 호버 시 등장 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-yellow-500 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </div>

      {/* 팀 · 프로젝트명 */}
      <div className="flex items-center gap-2 border-t border-gray-300 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
            <p className="truncate text-[12px] font-medium tracking-[-0.2px] text-gray-500">
              {project.teamName}
            </p>
          </div>
          <p className="mt-0.5 truncate text-[17px] font-bold tracking-[-0.5px] text-black">
            {project.name}
          </p>
        </div>
        <span
          aria-hidden
          className="shrink-0 translate-x-1 text-[16px] text-yellow-900 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        >
          →
        </span>
      </div>
    </Link>
  );
}
