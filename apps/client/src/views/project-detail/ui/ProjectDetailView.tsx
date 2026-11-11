"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { DeadlineStatusSection, FormListSection, ProjectInfo } from "@repo/ui";

import { useAuthSession } from "@/entities/auth";
import { useIncreaseProjectView } from "@/entities/engagement";
import { getDeadlineSummary, useGetForms } from "@/entities/form";
import { useGetMyProject, useGetPublicProject } from "@/entities/project";
import { useRequireLogin } from "@/features/auth-guard";
import { LikeButton } from "@/features/project-like";
import { CommentIcon, EyeIcon } from "@/shared/ui/EngagementIcons";

import AiSummarySection from "@/widgets/project-detail/ui/AiSummarySection";
import ProjectLinkSection from "@/widgets/project-detail/ui/ProjectLinkSection";
import ScheduleSection from "@/widgets/project-detail/ui/ScheduleSection";
import { ProjectCommentSection } from "@/widgets/project-comment";

interface ProjectDetailViewProps {
  projectId: number;
}

export default function ProjectDetailView({
  projectId,
}: ProjectDetailViewProps) {
  const t = useTranslations("project.detail");
  const router = useRouter();

  // 공개 페이지 — 비로그인·외부 사용자도 볼 수 있고, 팀 관리 영역은 재학생에게만 보인다.
  const { isGuest, canManageTeam } = useAuthSession();
  const requireLogin = useRequireLogin();

  const { data: project, isPending, isError } = useGetPublicProject(projectId);
  const { data: myProjects } = useGetMyProject({ enabled: canManageTeam });

  // 내 팀 여부 — 내 프로젝트 목록에 현재 상세 id가 포함되는지로 판단
  const isMine =
    canManageTeam && (myProjects?.some((p) => p.id === projectId) ?? false);

  const { data: forms } = useGetForms(projectId, { enabled: isMine });

  // 조회수 — 프로젝트가 로드되면 projectId당 한 번만 집계 (StrictMode 이중 실행 방지)
  const { mutate: increaseView } = useIncreaseProjectView(projectId);
  const viewedProjectId = useRef<number | null>(null);
  const isLoaded = !!project;

  useEffect(() => {
    if (!isLoaded || viewedProjectId.current === projectId) return;
    viewedProjectId.current = projectId;
    increaseView();
  }, [isLoaded, projectId, increaseView]);

  const goToEdit = () => {
    const editPath = `/projects/${projectId}/edit`;
    requireLogin(() => router.push(editPath), editPath);
  };

  // 양식 클릭 — 제출했으면 수정/상세, 아니면 제출 페이지로 이동
  const goToForm = (formId: number) => {
    const form = forms?.find((f) => f.id === formId);
    const formPath = `/form/${formId}/${form?.submitted ? "edit" : "submit"}`;
    requireLogin(() => router.push(formPath), formPath);
  };

  // 비로그인 상태에서 팀 관리 기능을 쓰려면 로그인 후 이 페이지로 돌아온다.
  const goToSignin = () => requireLogin(() => {});

  if (isPending || isError || !project) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4">
        <p className="text-[14px] text-gray-600">
          {isError ? t("loadError") : t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh justify-center bg-background px-4 pb-8 pt-[67px]">
      <div className="flex w-full min-w-0 max-w-[830px] flex-col">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex w-fit cursor-pointer items-center gap-2 text-lg font-semibold text-gray-700 transition-colors hover:text-gray-900"
        >
          {t("back")}
        </button>

        {/* 정보 영역 — 생성 페이지와 동일한 레이아웃 (로고 · 팀 정보 · 설명) */}
        {/* AI 요약(다른 팀 프로젝트일 때만)은 로고 영역과 설명 사이에 노출 */}
        <ProjectInfo
          project={project}
          summary={
            // AI 요약은 교내 사용자 전용 API — 다른 팀 프로젝트일 때만 노출
            canManageTeam && !isMine ? (
              <AiSummarySection projectId={projectId} />
            ) : undefined
          }
        />

        {/* 링크 — 설명 바로 아래에 작은 칩으로. 다른 팀은 등록된 링크가 있을 때만 노출 */}
        <div className="mt-4 empty:mt-0">
          {/* 링크 조회는 로그인이 필요하다 (외부 사용자는 조회 가능) */}
          {!isGuest && (
            <ProjectLinkSection projectId={projectId} editable={isMine} />
          )}
        </div>

        {/* 참여 지표 — 조회수 · 좋아요 · 댓글 수 */}
        <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5" aria-label={t("views")}>
            <EyeIcon className="h-4 w-4" />
            {project.viewCount.toLocaleString()}
          </span>
          <LikeButton
            projectId={projectId}
            isLiked={project.isLiked}
            likeCount={project.likeCount}
          />
          <span className="flex items-center gap-1.5" aria-label={t("comments")}>
            <CommentIcon className="h-4 w-4" />
            {project.commentCount.toLocaleString()}
          </span>
        </div>

        {/* 마감현황 · 양식 목록 (좌) / 일정 캘린더 (우) — 내 팀일 때만 */}
        {/* 프로젝트 설명 ↔ 마감현황 간격 56px */}
        {isMine && (
          <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-stretch sm:gap-8 lg:gap-12">
            {/* 좌측: 일정(우측) 높이에 맞춰 늘어나고, 양식 목록이 남는 공간을 채우며 스크롤 */}
            <div className="flex flex-1 flex-col gap-8 sm:min-h-0">
              <DeadlineStatusSection
                summary={getDeadlineSummary(forms ?? [])}
              />
              <FormListSection
                forms={forms ?? []}
                onFormClick={goToForm}
              />
            </div>
            <ScheduleSection projectId={projectId} forms={forms ?? []} />
          </div>
        )}

        {/* 수정하기 — 하단 중앙. 일정 ↔ 수정하기 간격 60px */}
        {isMine && (
          <div className="mt-[60px] flex justify-center">
            <button
              type="button"
              onClick={goToEdit}
              className="rounded-full bg-yellow-600 px-10 py-2.5 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90"
            >
              {t("edit")}
            </button>
          </div>
        )}

        {/* 댓글 — 누구나 조회, 로그인 사용자만 작성 */}
        <div className="mt-[60px]">
          <ProjectCommentSection projectId={projectId} />
        </div>

        {/* 비로그인 — 우리 팀 프로젝트라면 로그인 후 관리할 수 있도록 안내 */}
        {isGuest && (
          <div className="mt-[60px] flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-gray-500">
              {t("signinHint")}
            </p>
            <button
              type="button"
              onClick={goToSignin}
              className="cursor-pointer rounded-full border border-yellow-600 bg-yellow-50 px-8 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-100"
            >
              {t("signin")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
