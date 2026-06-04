"use client";

import Image from "next/image";
import { useState } from "react";

import { PositionSelect, type Position } from "@/entities/signup";

export default function SignupView() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const isActive = selectedPosition !== null;

  const handleNext = () => {
    if (!isActive) return;
    // TODO: API 연동
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
          <PositionSelect value={selectedPosition} onChange={setSelectedPosition} />

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
    </main>
  );
}
