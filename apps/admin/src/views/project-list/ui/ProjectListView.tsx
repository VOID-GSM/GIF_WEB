"use client";

import { useState } from "react";

import {
  GRADES,
  ProjectCard,
  useGetFilteredProjects,
  useStoredGrade,
} from "@/entities/project";
import GradeFilter from "@/features/project-filter/ui/GradeFilter";
import { useGetMyInfo } from "@/entities/mypage";
import DeadlineCountdownCard from "@/widgets/dashboard/ui/DeadlineCountdownCard";
import ScheduleTimelineCard from "@/widgets/dashboard/ui/ScheduleTimelineCard";
import MyProjectCard from "@/widgets/dashboard/ui/MyProjectCard";

export default function ProjectListView() {
  // 마지막으로 선택한 학년을 복원한다 (확정 전엔 null → 초기 학년 깜빡임 방지)
  const { grade, setGrade } = useStoredGrade();
  const { data: myInfo } = useGetMyInfo();
  const [showAll, setShowAll] = useState(false);

  const {
    data: projects,
    isPending,
    isError,
  } = useGetFilteredProjects(grade ?? GRADES[0], grade !== null);
  // 서버가 grade로 거르지 않고 전체를 반환하므로 선택 학년으로 한 번 더 거른다
  // 내가 담당하는 팀(adminTeam과 teamName이 일치)을 맨 앞으로 정렬한다
  const visibleProjects = projects
    ?.filter((project) => project.grade === grade)
    .slice()
    .sort((a, b) => {
      const aMine = a.teamName === myInfo?.adminTeam ? 0 : 1;
      const bMine = b.teamName === myInfo?.adminTeam ? 0 : 1;
      return aMine - bMine;
    });
  const myProject = visibleProjects?.find(
    (project) => project.teamName === myInfo?.adminTeam,
  );

  if (grade === null) {
    return (
      <div className="flex min-h-dvh flex-col items-start gap-12 bg-background px-4 py-10">
        <p className="text-gray-600">불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      {/* 모바일: 내 프로젝트 → 자세히 보기 → 제출 마감 → 진행 일정 순으로 세로 배치 */}
      <div className="flex min-h-dvh flex-col gap-8 bg-background px-4 pt-16 pb-6 min-[900px]:hidden">
        <GradeFilter value={grade} onChange={setGrade} />

        {isPending ? (
          <p className="text-gray-600">불러오는 중...</p>
        ) : isError ? (
          <p className="text-gray-600">프로젝트를 불러오지 못했습니다.</p>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-gray-900">
                  내 프로젝트
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="cursor-pointer text-[13px] font-medium text-gray-500"
                >
                  {showAll ? "접기" : "전체 보기 ›"}
                </button>
              </div>
              {myProject && <MyProjectCard project={myProject} />}
            </div>

            {showAll &&
              (!visibleProjects || visibleProjects.length === 0 ? (
                <p className="text-gray-600">
                  해당 학년의 프로젝트가 없습니다.
                </p>
              ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fill,224px)] justify-start gap-6">
                  {visibleProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ))}
          </>
        )}

        <DeadlineCountdownCard />
        <ScheduleTimelineCard />
      </div>

      {/* 데스크톱: 기존 학년 필터 + 전체 그리드 */}
      <div className="hidden min-h-dvh flex-col items-start gap-12 bg-background px-4 py-10 min-[900px]:flex">
        <GradeFilter value={grade} onChange={setGrade} />

        {isPending ? (
          <p className="text-gray-600">불러오는 중...</p>
        ) : isError ? (
          <p className="text-gray-600">프로젝트를 불러오지 못했습니다.</p>
        ) : !visibleProjects || visibleProjects.length === 0 ? (
          <p className="w-full pt-70 text-center text-gray-600">
            해당 학년의 프로젝트가 없습니다.
          </p>
        ) : (
          <div className="grid w-full max-w-[1000px] grid-cols-[repeat(auto-fill,224px)] justify-start gap-6">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
