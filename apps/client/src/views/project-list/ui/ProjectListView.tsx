"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useGetMyProject } from "@/entities/project";
import type { ClientRole } from "@/entities/signup";
import { COOKIE_KEYS } from "@/shared/constants";
import { getCookie } from "@/shared/utils";
import ProjectBrowse from "@/widgets/project-list/ui/ProjectBrowse";
import ProjectListEmpty from "@/widgets/project-list/ui/ProjectListEmpty";

export default function ProjectListView() {
  const t = useTranslations("project.list");
  const router = useRouter();
  const role = (getCookie(COOKIE_KEYS.CLIENT_ROLE) as ClientRole) ?? "MEMBER";
  const { data: myProjects, isPending, isError } = useGetMyProject();

  // 아직 참여(생성)한 프로젝트가 없으면 빈 상태, 있으면 메인 브라우즈 화면
  if (isPending || isError || !myProjects || myProjects.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
        {isPending ? (
          <p className="py-20 text-center text-gray-500">{t("loading")}</p>
        ) : isError ? (
          <p className="py-20 text-center text-gray-500">
            {t("infoLoadError")}
          </p>
        ) : (
          <ProjectListEmpty
            role={role}
            onCreateProject={() => router.push("/projects/create")}
          />
        )}
      </div>
    );
  }

  return <ProjectBrowse />;
}
