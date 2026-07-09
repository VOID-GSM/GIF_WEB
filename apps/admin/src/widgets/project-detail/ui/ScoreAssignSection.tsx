"use client";

import { useRouter } from "next/navigation";

import { AREA_LABELS, getAllowedAreas } from "@/entities/score";
import { useGetMyInfo } from "@/entities/mypage";

interface ScoreAssignSectionProps {
  projectId: number;
}

// 관리자 프로젝트 상세 하단 — 역할별(+학년부 부장) 채점 가능 영역마다 점수 부여 버튼을 띄운다.
// 버튼 클릭 시 해당 영역의 채점 페이지로 이동한다.
export default function ScoreAssignSection({
  projectId,
}: ScoreAssignSectionProps) {
  const router = useRouter();
  const { data: myInfo } = useGetMyInfo();

  // 역할 정보가 아직 없으면 버튼을 렌더하지 않는다.
  if (!myInfo?.adminRole) return null;

  const areas = getAllowedAreas(myInfo.adminRole, myInfo.gradeHead);
  if (areas.length === 0) return null;

  // 채점 영역이 2개일 때는 두 버튼을 가로로 나란히 배치한다.
  const isRow = areas.length === 2;

  return (
    <div className={`mt-[30px] flex gap-3 ${isRow ? "flex-row" : "flex-col"}`}>
      {areas.map((area) => (
        <button
          key={area}
          type="button"
          onClick={() => router.push(`/score/${area}?projectId=${projectId}`)}
          className={`${isRow ? "flex-1" : "w-full"} rounded-[10px] bg-yellow-600 py-3 text-center text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90 cursor-pointer`}
        >
          {AREA_LABELS[area]} 점수 부여하기
        </button>
      ))}
    </div>
  );
}
