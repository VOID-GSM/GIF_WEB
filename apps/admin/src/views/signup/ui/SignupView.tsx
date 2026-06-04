"use client";

import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { RoleSelect, type AdminRole } from "@/entities/signup";

export default function SignupView() {
  const router = useRouter();
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [adminTeam, setAdminTeam] = useState("");

  const isActive = adminRole !== null;

  // TODO: DataGSM에 admin role 추가되면 usePatchAdminInfo로 API 연동 복구
  // mutate({ adminRole, adminTeam }, { onSuccess: () => router.replace("/") })
  const handleNext = () => {
    if (!adminRole) return;
    router.replace("/");
  };

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
