"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "메인", path: "/" },
  { label: "양식", path: "/form" },
  { label: "등수", path: "/rank" },
  { label: "점수", path: "/score" },
  { label: "내 정보", path: "/mypage" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="relative sticky top-0 w-full bg-white border-b border-gray-300">
      <div className="relative flex items-center h-20 px-[42px]">
        <button
          className="flex items-center transition hover:opacity-80"
          onClick={() => router.push("/")}
        >
          <Image src="/favicon.ico" alt="logo" width={75} height={50} />
        </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {NAV_ITEMS.map(({ label, path }) => (
          <button
            key={path}
            className={`h-full w-[200px] text-[24px] font-medium border-b-3 transition-colors cursor-pointer
              ${
                pathname === path
                  ? "border-yellow-600"
                  : "border-transparent hover:border-yellow-600"
              }`}
            onClick={() => router.push(path)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
