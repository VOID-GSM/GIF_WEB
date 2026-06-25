"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetMyInfo } from "@/entities/mypage";
import { RoleSelect, type AdminRole } from "@/entities/signup";

export default function SignupView() {
  const router = useRouter();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [adminTeam, setAdminTeam] = useState("");

  // 회원가입은 첫 로그인(역할 미설정)인 사용자에게만 노출한다.
  // 이미 가입(adminRole 보유)한 사용자가 /signup 에 접근하면 홈으로 돌려보낸다.
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  const alreadySignedUp = !!myInfo?.adminRole;

  useEffect(() => {
    if (alreadySignedUp) router.replace("/");
  }, [alreadySignedUp, router]);

  const isActive = adminRole !== null;

  // 역할(및 담당 팀)을 약관 동의 페이지로 넘긴다. 실제 가입은 약관 동의 후 완료된다.
  const handleNext = () => {
    if (!adminRole) return;
    const team = adminTeam.trim();
    const params = new URLSearchParams({ role: adminRole });
    if (team) params.set("team", team);
    router.push(`/signup/terms?${params.toString()}`);
  };

  // 로딩 중이거나 이미 가입한 사용자는 폼을 그리지 않는다(폼 깜빡임 방지).
  if (isMyInfoLoading || alreadySignedUp) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-gray-600">불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="bg-white rounded-[20px] shadow-new px-[25px] py-[30px]">
        <div className="flex flex-col gap-[30px] items-center w-[250px]">
          <Image
            src="/gif-logo.png"
            alt="GIF"
            width={83}
            height={55}
            className="object-contain"
          />

          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-[10px] w-full">
              <RoleSelect value={adminRole} onChange={setAdminRole} />

              <input
                type="text"
                value={adminTeam}
                onChange={(e) => setAdminTeam(e.target.value)}
                placeholder="담당 팀을 입력해주세요(없을 시 작성 X)"
                className={`w-full h-7 px-[10px] rounded bg-white text-[12px] border outline-none transition-colors placeholder:text-gray-500 ${
                  adminTeam
                    ? "border-black text-black"
                    : "border-gray-500 text-gray-500"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isActive}
              className={`w-full h-7 rounded text-[12px] text-white transition-colors ${
                isActive
                  ? "bg-[#ffee30] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
