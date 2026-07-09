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

  // 소속 팀은 내 프로젝트(서버)에서 그대로 가져온다. 팀에서 빠지면 비워진다.
  const myProject = myProjects?.[0];
  const teamName = myProject?.teamName ?? "";

  // 역할은 프로젝트 멤버의 실제 role 에서 가져온다.
  // clientRole(가입 시 선택값)은 팀장을 양도해도 바뀌지 않으므로 사용하지 않는다.
  const { data: projectDetail } = useGetProject(myProject?.id ?? NaN);
  const myRole = projectDetail?.members.find(
    (m) => m.userId === data?.userId,
  )?.role;
  const role = teamName && myRole ? (CLIENT_ROLE_LABEL[myRole] ?? myRole) : "";

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
      {isLoading || isProjectsLoading ? (
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
        <MypageCard items={mypageInfoItems} onLogout={handleLogout} />
      )}
    </main>
  );
}
