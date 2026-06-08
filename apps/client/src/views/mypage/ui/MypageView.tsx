"use client";

import { MypageCard } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useGetMyInfo, useUpdateClientInfo } from "@/entities/mypage";
import { COOKIE_KEYS } from "@/shared/constants";
import { deleteCookie } from "@/shared/utils";

const CLIENT_ROLE_LABEL: Record<string, string> = {
  LEADER: "팀장",
  MEMBER: "팀원",
};

const CLIENT_ROLE_VALUE: Record<string, string> = {
  팀장: "LEADER",
  팀원: "MEMBER",
};

export default function MypageView() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyInfo();
  const { mutate: updateInfo } = useUpdateClientInfo();

  const role = data?.clientRole
    ? (CLIENT_ROLE_LABEL[data.clientRole] ?? data.clientRole)
    : "-";

  const mypageInfoItems = [
    { label: "이름", value: data?.name ?? "-", type: "readonly" as const },
    {
      label: "역할",
      value: role,
      type: "dropdown" as const,
      dropdownOptions: ["팀장", "팀원"],
    },
    {
      label: "소속 팀",
      value: data?.clientTeam ?? "-",
      type: "readonly" as const,
    },
  ];

  const handleLogout = () => {
    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    router.replace("/signin");
    router.refresh();
  };

  const handleEdit = (updatedValues: Record<string, string>) => {
    updateInfo({
      clientRole:
        CLIENT_ROLE_VALUE[updatedValues["역할"]] ?? updatedValues["역할"],
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
