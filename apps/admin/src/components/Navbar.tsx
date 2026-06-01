"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "메인", path: "/" },
  { label: "양식", path: "/form" },
  { label: "등수", path: "/rank" },
  { label: "내 정보", path: "/mypage" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex sticky items-center h-20 px-[42px] top-0 w-full bg-white border-b border-gray-300">
        <button
          className="flex items-center transition hover:opacity-80"
          onClick={() => router.push("/")}
        >
          <Image src="/favicon.ico" alt="logo" width={75} height={50} />
        </button>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {NAV_ITEMS.map(({ label, path }) => (
            <button
              key={path}
              className={`h-full w-[200px] text-[24px] font-medium border-b-3 transition-colors cursor-pointer pointer-events-auto
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

      {/* Mobile Navbar */}
      <div className="lg:hidden flex flex-col w-40 sticky bg-white h-full border-r border-gray-300">
        <button
          className="flex items-center transition hover:opacity-80 p-4"
          onClick={() => router.push("/")}
        >
          <Image src="/favicon.ico" alt="logo" width={48} height={32} />
        </button>

        <div className="flex flex-col items-end justify-center ">
          {NAV_ITEMS.map(({ label, path }) => (
            <button
              key={path}
              className={`w-full p-4 text-left font-medium border-r-3 transition-colors cursor-pointer
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
    </div>
  );
}
