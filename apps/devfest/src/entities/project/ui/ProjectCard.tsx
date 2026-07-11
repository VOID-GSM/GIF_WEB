"use client";

import { useRef } from "react";
import Link from "next/link";
import { ProjectLogo } from "@repo/ui";

import type { Project } from "../model/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
      className="group flex h-[176px] w-[224px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[12px] bg-white shadow-new transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-[112px] w-full overflow-hidden">
        <ProjectLogo
          src={project.logo}
          alt={project.name}
          className="h-full w-full object-cover"
          fallbackClassName="h-full w-full bg-white object-contain p-5"
        />
        {project.demoVideoUrl && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            <source src={project.demoVideoUrl} type="video/mp4" />
          </video>
        )}
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
