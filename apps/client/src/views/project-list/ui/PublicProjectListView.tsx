"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useAuthSession } from "@/entities/auth";
import {
  GRADES,
  ProjectCard,
  useGetFilteredProjects,
  useStoredGrade,
} from "@/entities/project";
import GradeFilter from "@/features/project-filter/ui/GradeFilter";
import { getEmptyMessageKey } from "@/features/project-filter/lib/getEmptyMessage";
import {
  PUBLIC_HOME_PATH,
  REDIRECT_REASONS,
  SEARCH_PARAM_KEYS,
} from "@/shared/constants";
import ExternalProfileCard from "@/widgets/project-list/ui/ExternalProfileCard";
import SigninPromptCard from "@/widgets/project-list/ui/SigninPromptCard";

// proxy 가 외부 사용자를 재학생 전용 페이지에서 돌려보냈으면 한 번 안내하고 파라미터를 지운다.
function useRedirectReasonNotice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get(SEARCH_PARAM_KEYS.REASON);
  const tAuth = useTranslations("auth");

  useEffect(() => {
    if (reason !== REDIRECT_REASONS.EXTERNAL_ONLY) return;
    toast.info(tAuth("studentOnly"), {
      id: REDIRECT_REASONS.EXTERNAL_ONLY,
    });
    router.replace(PUBLIC_HOME_PATH);
  }, [reason, router, tAuth]);
}

// 공개 프로젝트 목록 — 비로그인·외부 사용자도 학년별 프로젝트를 둘러볼 수 있다.
export default function PublicProjectListView() {
  const t = useTranslations("project.list");
  useRedirectReasonNotice();

  const { isGuest, isExternal } = useAuthSession();
  const { grade, setGrade } = useStoredGrade();
  const {
    data: projects,
    isPending,
    isError,
  } = useGetFilteredProjects(grade ?? GRADES[0], grade !== null);
  // 서버가 선택한 학년으로 거른 목록을 내려준다 (전체는 grade 없이 요청해 모든 학년을 받는다)
  // 전체를 볼 때 학년이 섞이므로 학년 순으로 정렬한다
  const visibleProjects = projects?.slice().sort((a, b) => a.grade - b.grade);
  const emptyKey = getEmptyMessageKey(grade);

  const sideCard = isGuest ? (
    <SigninPromptCard />
  ) : isExternal ? (
    <ExternalProfileCard />
  ) : null;

  return (
    <div className="flex w-full flex-col gap-6 bg-background px-0 min-[900px]:flex-row min-[900px]:items-start min-[900px]:px-6">
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col items-start gap-8 px-4 pt-16 pb-6 min-[900px]:gap-12 min-[900px]:py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-gray-900">
            {t("browseTitle")}
          </h1>
          <p className="text-[14px] text-gray-500">
            {t("browseDesc")}
          </p>
        </div>

        {/* 모바일에서는 안내 카드를 목록 위에 둔다 */}
        {sideCard && <div className="w-full min-[900px]:hidden">{sideCard}</div>}

        {grade === null ? (
          <p className="text-gray-600">{t("loading")}</p>
        ) : (
          <>
            <GradeFilter value={grade} onChange={setGrade} />

            {isPending ? (
              <p className="text-gray-600">{t("loading")}</p>
            ) : isError ? (
              <p className="text-gray-600">{t("loadError")}</p>
            ) : !visibleProjects || visibleProjects.length === 0 ? (
              <p className="w-full py-20 text-center text-gray-600">
                {t(emptyKey)}
              </p>
            ) : (
              <div className="grid w-full max-w-[1000px] grid-cols-[repeat(auto-fill,224px)] justify-start gap-6">
                {visibleProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {sideCard && (
        <aside className="hidden w-[340px] shrink-0 flex-col gap-6 py-10 min-[900px]:flex">
          {sideCard}
        </aside>
      )}
    </div>
  );
}