"use client";

import { MypageCard } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useGetMyInfo, useUpdateAdminInfo } from "@/entities/mypage/";
import { COOKIE_KEYS } from "@/shared/constants";
import { deleteCookie } from "@/shared/utils";

const ADMIN_ROLE_LABEL: Record<string, string> = {
  GRADE_HEAD: "학년부 부장",
  GENERAL_TEACHER: "보통 교과",
  MAJOR_TEACHER: "전공 교과",
  MASTER: "아이디어 페스티벌 담당",
};

const ADMIN_ROLE_VALUE: Record<string, string> = {
  "학년부 부장": "GRADE_HEAD",
  "보통 교과": "GENERAL_TEACHER",
  "전공 교과": "MAJOR_TEACHER",
  "아이디어 페스티벌 담당": "MASTER",
};

export default function MypageView() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyInfo();
  const { mutate: updateInfo } = useUpdateAdminInfo();

  const role = data?.adminRole
    ? (ADMIN_ROLE_LABEL[data.adminRole] ?? data.adminRole)
    : "-";

  const mypageInfoItems = [
    {
      key: "name",
      label: "이름",
      value: data?.name ?? "-",
      type: "readonly" as const,
    },
    {
      key: "adminRole",
      label: "역할",
      value: role,
      type: "dropdown" as const,
      dropdownOptions: [
        "학년부 부장",
        "보통 교과",
        "전공 교과",
        "아이디어 페스티벌 담당",
      ],
    },
    {
      key: "adminTeam",
      label: "담당 팀",
      value: data?.adminTeam ?? "",
      placeholder: "담당하는 팀이 없습니다",
      type: "input" as const,
    },
  ];

  const handleLogout = () => {
    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    router.replace("/signin");
    router.refresh();
  };

  const handleEdit = (updatedValues: Record<string, string>) => {
    updateInfo({
      adminRole:
        ADMIN_ROLE_VALUE[updatedValues["adminRole"]] ??
        updatedValues["adminRole"],
      adminTeam: updatedValues["adminTeam"] || undefined,
    });
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-background p-4">
      {isLoading ? (
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
        <MypageCard
          items={mypageInfoItems}
          onLogout={handleLogout}
          onEdit={handleEdit}
        />
      )}
    </main>
  );
}
