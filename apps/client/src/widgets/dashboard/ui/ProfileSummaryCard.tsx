"use client";

import { useTranslations } from "next-intl";
import { Logout } from "@repo/ui";
import { useGetMyInfo } from "@/entities/mypage";
import { useGetMyProject, useGetProject } from "@/entities/project";
import { useLogout } from "@/features/logout";

const CLIENT_ROLES = ["LEADER", "MEMBER"];

export default function ProfileSummaryCard() {
  const t = useTranslations("dashboard.profile");
  const handleLogout = useLogout();
  const { data, isLoading, isError } = useGetMyInfo();
  const { data: myProjects, isLoading: isProjectsLoading } = useGetMyProject();
  const projectId = data?.projectId || myProjects?.[0]?.id;
  const hasProjectId = Number.isFinite(projectId);
  const { data: projectDetail, isLoading: isProjectDetailLoading } =
    useGetProject(projectId ?? NaN);

  // 소속 팀과 역할은 프로젝트 상세의 최신 멤버 정보를 우선 사용한다.
  const teamName = projectDetail?.teamName ?? myProjects?.[0]?.teamName ?? "";

  const currentProjectRole = projectDetail?.members.find(
    (member) => member.userId === data?.userId,
  )?.role;
  const displayRole = currentProjectRole ?? data?.clientRole;
  const role = displayRole
    ? CLIENT_ROLES.includes(displayRole)
      ? t(`role.${displayRole}`)
      : displayRole
    : "-";

  const loading =
    isLoading || isProjectsLoading || (hasProjectId && isProjectDetailLoading);


  return (
    <section className="w-full rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <span className="text-[13px] font-medium text-gray-400">{t("myProfile")}</span>

      {loading ? (
        <p className="mt-4 text-[14px] text-gray-500">{t("loading")}</p>
      ) : isError ? (
        <p className="mt-4 text-[14px] text-red-500">
          {t("loadError")}
        </p>
      ) : (
        <>
          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.5px] text-gray-900">
            {data?.name ?? "-"}
          </h2>

          <dl className="mt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-[14px] text-gray-400">{t("role.label")}</dt>
              <dd className="text-[14px] font-medium text-gray-700">
                {role}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[14px] text-gray-400">{t("team")}</dt>
              <dd className="text-[14px] font-medium text-gray-700">
                {teamName || "-"}
              </dd>
            </div>
          </dl>
        </>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="mt-5 flex h-[40px] w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-gray-100 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700"
      >
        <Logout className="h-[13px] w-[16px]" aria-hidden="true" />
        {t("logout")}
      </button>
    </section>
  );
}
