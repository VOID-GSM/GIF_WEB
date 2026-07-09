"use client";

import { useGetMyInfo } from "@/entities/mypage";
import { useGetMyProject } from "@/entities/project";

const CLIENT_ROLE_LABEL: Record<string, string> = {
  LEADER: "팀장",
  MEMBER: "팀원",
};

export default function ProfileSummaryCard() {
  const { data, isLoading, isError } = useGetMyInfo();
  const { data: myProjects, isLoading: isProjectsLoading } = useGetMyProject();

  const teamName = myProjects?.[0]?.teamName ?? "";
  const role =
    teamName && data?.clientRole
      ? (CLIENT_ROLE_LABEL[data.clientRole] ?? data.clientRole)
      : "-";

  const loading = isLoading || isProjectsLoading;

  return (
    <section className="w-full rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <span className="text-[13px] font-medium text-gray-400">내 프로필</span>

      {loading ? (
        <p className="mt-4 text-[14px] text-gray-500">불러오는 중...</p>
      ) : isError ? (
        <p className="mt-4 text-[14px] text-red-500">
          프로필 정보를 불러오지 못했습니다.
        </p>
      ) : (
        <>
          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.5px] text-gray-900">
            {data?.name ?? "-"}
          </h2>

          <dl className="mt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-[14px] text-gray-400">역할</dt>
              <dd className="text-[14px] font-medium text-gray-700">
                {role}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[14px] text-gray-400">소속 팀</dt>
              <dd className="text-[14px] font-medium text-gray-700">
                {teamName || "-"}
              </dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
