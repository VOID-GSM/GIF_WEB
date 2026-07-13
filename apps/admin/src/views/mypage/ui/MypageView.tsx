"use client";

import { MypageCard } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useGetMyInfo } from "@/entities/mypage/";
import { COOKIE_KEYS } from "@/shared/constants";
import { deleteCookie } from "@/shared/utils";

const ADMIN_ROLE_LABEL: Record<string, string> = {
  GENERAL_TEACHER: "보통 교과",
  MAJOR_TEACHER: "전공 교과",
  MASTER: "아이디어 페스티벌 담당",
};

export default function MypageView() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyInfo();

  // 교과 역할과 학년부 부장 여부를 함께 표시한다. (예: "전공 교과 · 학년부 부장")
  const roleParts = [
    data?.adminRole
      ? (ADMIN_ROLE_LABEL[data.adminRole] ?? data.adminRole)
      : null,
    data?.gradeHead ? "학년부 부장" : null,
  ].filter(Boolean);
  const role = roleParts.length > 0 ? roleParts.join(" · ") : "-";

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
        <div className="flex w-full max-w-[440px] flex-col items-center gap-5">
          <MypageCard
            items={mypageInfoItems}
            onLogout={handleLogout}
            nameSuffix="선생님"
          />
          <button
            type="button"
            onClick={() => router.push("/inquiry")}
            className="cursor-pointer text-[14px] font-medium text-gray-400 underline-offset-4 transition-colors hover:text-gray-600 hover:underline"
          >
            문의하기
          </button>
        </div>
      )}
    </main>
  );
}
