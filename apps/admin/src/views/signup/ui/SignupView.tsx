"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetMyInfo } from "@/entities/mypage";
import { RoleSelect, type AdminRole } from "@/entities/signup";
import { PRIVILEGED_ADMIN_EMAIL } from "@/shared/constants";

export default function SignupView() {
  const router = useRouter();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [name, setName] = useState("");
  const [gradeHead, setGradeHead] = useState(false);

  // 회원가입은 첫 로그인(역할 미설정)인 사용자에게만 노출한다.
  // 이미 가입(adminRole 보유)했거나 회원가입이 면제된 계정이 /signup 에 접근하면 홈으로 돌려보낸다.
  const { data: myInfo, isLoading: isMyInfoLoading } = useGetMyInfo();
  const alreadySignedUp =
    !!myInfo?.adminRole || myInfo?.email === PRIVILEGED_ADMIN_EMAIL;

  useEffect(() => {
    if (alreadySignedUp) router.replace("/");
  }, [alreadySignedUp, router]);

  const trimmedName = name.trim();
  const isActive = adminRole !== null && trimmedName !== "";

  // 역할·이름을 약관 동의 페이지로 넘긴다. 실제 가입은 약관 동의 후 완료된다.
  const handleNext = () => {
    if (!adminRole || trimmedName === "") return;
    const params = new URLSearchParams({ role: adminRole, name: trimmedName });
    if (gradeHead) params.set("gradeHead", "true");
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해 주세요"
                className={`w-full h-7 px-[10px] rounded bg-white text-[12px] border outline-none transition-colors placeholder:text-gray-500 ${
                  name ? "border-black text-black" : "border-gray-500 text-gray-500"
                }`}
              />

              <RoleSelect value={adminRole} onChange={setAdminRole} />

              <label
                className={`flex items-center gap-2 text-[12px] cursor-pointer select-none transition-colors ${
                  gradeHead ? "text-black" : "text-gray-500"
                }`}
              >
                <input
                  type="checkbox"
                  checked={gradeHead}
                  onChange={(e) => setGradeHead(e.target.checked)}
                  className="w-4 h-4 accent-[#ffee30] cursor-pointer"
                />
                학년부 부장 선생님
              </label>
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
