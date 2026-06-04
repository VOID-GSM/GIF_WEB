"use client";

import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  PositionSelect,
  usePatchClientInfo,
  type ClientRole,
} from "@/entities/signup";

export default function SignupView() {
  const router = useRouter();
  const [clientRole, setClientRole] = useState<ClientRole | null>(null);
  const { mutate, isPending } = usePatchClientInfo();

  const isActive = clientRole !== null;

  const handleNext = () => {
    if (!clientRole) return;
    mutate(
      { clientRole },
      { onSuccess: () => router.replace("/") },
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="bg-white rounded-[20px] shadow-new px-[25px] py-[30px] flex flex-col gap-[30px] items-center">
        <Image
          src="/gif-logo.png"
          alt="GIF"
          width={83}
          height={55}
          className="object-contain"
        />

        <div className="flex flex-col gap-[10px] w-[250px]">
          <PositionSelect value={clientRole} onChange={setClientRole} />

          <button
            type="button"
            onClick={handleNext}
            disabled={!isActive || isPending}
            className={`w-full h-7 rounded text-[12px] text-white transition-colors ${
              isActive && !isPending
                ? "bg-[#ffee30] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>
      </div>
    </main>
  );
}
