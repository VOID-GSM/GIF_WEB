"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ADMIN_TERMS,
  TermsAgreement,
  usePostAdminInfo,
  type AdminRole,
} from "@/entities/signup";

export default function TermsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending } = usePostAdminInfo();
  const [agreed, setAgreed] = useState(false);

  const adminRole = searchParams.get("role") as AdminRole | null;
  const adminTeam = searchParams.get("team")?.trim() ?? "";

  // 역할 정보 없이 약관 페이지에 직접 접근하면 회원가입으로 돌려보낸다.
  useEffect(() => {
    if (!adminRole) router.replace("/signup");
  }, [adminRole, router]);

  const handleSubmit = () => {
    if (!adminRole || !agreed) return;
    mutate(
      // 담당 팀이 비어있으면 필드를 생략 (빈 문자열 전송 시 400 방지)
      { adminRole, ...(adminTeam ? { adminTeam } : {}) },
      {
        onSuccess: () => router.replace("/"),
        onError: () => toast.error("회원가입에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };

  if (!adminRole) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="bg-white rounded-[20px] shadow-new px-[30px] py-[30px] w-full max-w-[560px]">
        <div className="flex flex-col gap-[30px] items-center w-full">
          <Image
            src="/gif-logo.png"
            alt="GIF"
            width={83}
            height={55}
            className="object-contain"
          />

          <div className="flex flex-col gap-5 w-full">
            <TermsAgreement
              terms={ADMIN_TERMS}
              onRequiredAgreedChange={setAgreed}
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!agreed || isPending}
              className={`w-full h-7 rounded text-[12px] text-white transition-colors ${
                agreed && !isPending
                  ? "bg-[#ffee30] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
