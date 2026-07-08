"use client";

import { useRouter } from "next/navigation";

import { AREA_LABELS, getAllowedScoreAreas } from "@/entities/score";
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

  const areas = getAllowedScoreAreas(myInfo.adminRole, myInfo.gradeHead);
  if (areas.length === 0) return null;

  return (
    <div className="mt-[30px] flex flex-col gap-3">
      {areas.map((area) => (
        <button
          key={area}
          type="button"
          onClick={() => router.push(`/score/${area}?projectId=${projectId}`)}
          className="w-full rounded-[10px] bg-yellow-600 py-3 text-center text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90 cursor-pointer"
        >
          {AREA_LABELS[area]} 점수 부여하기
        </button>
      ))}
    </div>
  );
}
