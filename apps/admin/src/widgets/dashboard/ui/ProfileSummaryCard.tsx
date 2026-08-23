"use client";

import { useRouter } from "next/navigation";
import { Logout } from "@repo/ui";
import { useGetMyInfo } from "@/entities/mypage";
import { COOKIE_KEYS, PRIVILEGED_ADMIN_EMAIL } from "@/shared/constants";
import { deleteCookie } from "@/shared/utils";

const ADMIN_ROLE_LABEL: Record<string, string> = {
  GENERAL_TEACHER: "보통 교과",
  MAJOR_TEACHER: "전공 교과",
  MASTER: "아이디어 페스티벌 담당",
};

export default function ProfileSummaryCard() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMyInfo();
  const isPrivilegedAdmin = data?.email === PRIVILEGED_ADMIN_EMAIL;

  // 교과 역할과 학년부 부장 여부를 함께 표시한다. (예: "전공 교과 · 학년부 부장")
  const roleParts = [
    data?.adminRole
      ? (ADMIN_ROLE_LABEL[data.adminRole] ?? data.adminRole)
      : null,
    data?.gradeHead ? "학년부 부장" : null,
  ].filter(Boolean);
  const role = roleParts.length > 0 ? roleParts.join(" · ") : "-";

  const handleLogout = () => {
    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    router.replace("/signin");
    router.refresh();
  };

  return (
    <section className="w-full rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <span className="text-[13px] font-medium text-gray-400">내 프로필</span>

      {isLoading ? (
        <p className="mt-4 text-[14px] text-gray-500">불러오는 중...</p>
      ) : isError ? (
        <p className="mt-4 text-[14px] text-red-500">
          프로필 정보를 불러오지 못했습니다.
        </p>
      ) : (
        <>
          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.5px] text-gray-900">
            {data?.name ?? "-"}
            <span className="ml-1 text-[14px] font-medium text-gray-400">
              {isPrivilegedAdmin ? "관리자" : "선생님"}
            </span>
          </h2>

          <dl className="mt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-[14px] text-gray-400">역할</dt>
              <dd className="text-[14px] font-medium text-gray-700">
                {role}
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
        로그아웃
      </button>
    </section>
  );
}
