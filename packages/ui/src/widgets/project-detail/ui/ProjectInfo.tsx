import type { ReactNode } from "react";

import NameBadge from "../../../components/Badge/NameBadge";

interface ProjectInfoMember {
  userId: number;
  name: string;
  studentNumber: string;
  role: string;
}

interface ProjectInfoProps {
  project: {
    name: string;
    teamName: string;
    description: string;
    logo: string;
    members: ProjectInfoMember[];
  };
  // 로고 영역과 설명 사이에 들어가는 AI 요약 배너 슬롯 (없으면 설명이 로고 바로 아래)
  summary?: ReactNode;
}

// 읽기(잠금) 모드의 프로젝트 정보 영역 — 생성 페이지와 동일한 레이아웃 (admin·client 공용)
export default function ProjectInfo({ project, summary }: ProjectInfoProps) {
  const readonlyValue = "text-2xl text-gray-900 font-medium";

  return (
    <div className="flex flex-col">
      <section className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="mx-auto h-[160px] w-[240px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          {project.logo && (
            // logo는 외부 API에서 내려오는 동적 URL이라 next/image 대신 img 사용
            <img
              src={project.logo}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="shrink-0 text-2xl font-medium text-gray-700">
              프로젝트명
            </span>
            <span className={readonlyValue}>{project.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="shrink-0 text-2xl font-medium text-gray-700">
              팀명
            </span>
            <span className={readonlyValue}>{project.teamName}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-9 shrink-0 items-center">
              <span className="text-2xl font-medium text-gray-700">팀원</span>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {project.members.map((member) => (
                <NameBadge
                  key={member.userId}
                  id={Number(member.studentNumber)}
                  name={member.name}
                  isEditable={false}
                  color={member.role === "LEADER" ? "yellow" : "gray"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI 요약 — 로고 영역과 33px 간격 */}
      {summary && <div className="mt-[33px]">{summary}</div>}

      {/* 프로젝트 설명 — 요약이 있으면 16px, 없으면 로고 영역과 56px 간격 */}
      <p
        className={`w-full break-words whitespace-pre-wrap font-medium leading-relaxed text-gray-700 ${
          summary ? "mt-4" : "mt-14"
        }`}
      >
        {project.description}
      </p>
    </div>
  );
}
