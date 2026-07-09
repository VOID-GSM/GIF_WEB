"use client";

import { useRouter } from "next/navigation";

import { COOKIE_KEYS } from "@/shared/constants";
import { deleteCookie } from "@/shared/utils";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
    router.replace("/signin");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="h-[44px] w-full cursor-pointer rounded-[12px] bg-white text-[14px] font-medium text-gray-600 shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-colors hover:bg-gray-50"
    >
      로그아웃
    </button>
  );
}
