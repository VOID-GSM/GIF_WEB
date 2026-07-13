"use client";

import { MypageCard } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useGetMyInfo } from "@/entities/mypage";
import { useGetMyProject, useGetProject } from "@/entities/project";
import { COOKIE_KEYS } from "@/shared/constants";
import { deleteCookie } from "@/shared/utils";

const CLIENT_ROLE_LABEL: Record<string, string> = {
  LEADER: "팀장",
  MEMBER: "팀원",
};

export default function MypageView() {
  const router = useRouter();
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
    ? (CLIENT_ROLE_LABEL[displayRole] ?? displayRole)
    : "";

  const mypageInfoItems = [
    {
      key: "name",
      label: "이름",
      value: data?.name ?? "-",
      type: "readonly" as const,
    },
    {
      key: "clientRole",
      label: "역할",
      value: role,
      placeholder: "-",
      type: "readonly" as const,
    },
    {
      key: "clientTeam",
      label: "소속 팀",
      value: teamName,
      placeholder: "소속된 팀이 없습니다",
      type: "readonly" as const,
    },
  ];

  const handleLogout = () => {
    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    router.replace("/signin");
    router.refresh();
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-background p-4">
      {isLoading ||
      isProjectsLoading ||
      (hasProjectId && isProjectDetailLoading) ? (
        <p className="text-[16px] font-medium text-gray-600">불러오는 중</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-[16px] font-medium text-red-500">
            프로필 정보를 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="h-10 rounded-[32px] bg-black px-6 text-[14px] font-semibold text-white"
          >
            로그인으로 이동
          </button>
        </div>
      ) : (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-5">
          <MypageCard items={mypageInfoItems} onLogout={handleLogout} />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/inquiry")}
              className="cursor-pointer text-[14px] font-medium text-gray-400 underline-offset-4 transition-colors hover:text-gray-600 hover:underline"
            >
              문의하기
            </button>
            <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
            <button
              type="button"
              onClick={() => router.push("/inquiry/my")}
              className="cursor-pointer text-[14px] font-medium text-gray-400 underline-offset-4 transition-colors hover:text-gray-600 hover:underline"
            >
              내 문의 내역
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
