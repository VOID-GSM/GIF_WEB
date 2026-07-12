"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetRank, useGetScoreNotice } from "@repo/lib";

import GradeSelector from "../components/GradeSelector/GradeSelector";
import type { Grade } from "../components/GradeSelector/GradeSelector";
import RankBoard from "../components/Rank/RankBoard";
import RankSkeleton from "../components/Rank/RankSkeleton";

interface RankViewProps {
  grade?: Grade;
  onGradeChange?: (grade: Grade) => void;
}

export default function RankView({
  grade: propGrade,
  onGradeChange,
}: RankViewProps) {
  const [localGrade, setLocalGrade] = useState<Grade>(1);
  const grade = propGrade ?? localGrade;
  const setGrade = onGradeChange ?? setLocalGrade;
  const router = useRouter();
  const { data: notice, isPending: isNoticePending } = useGetScoreNotice();
  const { data, isPending, isError } = useGetRank({ grade });

  useEffect(() => {
    if (notice && !notice.isPublished) {
      router.replace("/");
    }
  }, [notice, router]);

  if (isNoticePending || (notice && !notice.isPublished)) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="flex w-full justify-center pt-10 md:pt-14">
        <GradeSelector grade={grade} onGradeChange={setGrade} />
      </div>

      <section className="mx-auto w-full max-w-6xl px-3 pt-16 pb-16 sm:px-6 sm:pt-20 md:px-12 md:pt-24 md:pb-24">
        {isPending ? (
          <RankSkeleton />
        ) : isError ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-center text-gray-500">
              등수 정보를 불러오지 못했습니다
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-center text-gray-500">
              아직 등수를 공지하지 않았습니다
            </p>
          </div>
        ) : (
          <RankBoard items={data} />
        )}
      </section>
    </div>
  );
}
