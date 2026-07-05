"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu } from "@repo/ui";

interface IntroNavItem {
  label: string;
  href: string;
}

// 랜딩 섹션으로 스크롤 이동하는 앵커 메뉴.
const INTRO_NAV: IntroNavItem[] = [
  { label: "기능", href: "#features" },
  { label: "수상작", href: "#winners" },
  { label: "아이디어 페스티벌", href: "#about" },
  { label: "VOID", href: "#team" },
];

interface IntroHeaderProps {
  /** 로그아웃 후 이동할 경로 */
  signinHref?: string;
}

export default function IntroHeader({
  signinHref = "/signin",
}: IntroHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // 두 앱 모두 access_token 쿠키를 사용한다 (COOKIE_KEYS.ACCESS_TOKEN).
    document.cookie = "access_token=; path=/; max-age=0";
    router.replace(signinHref);
    router.refresh();
  };

  return (
    <>
      <header className="fixed top-0 z-50 flex h-15 w-full items-center border-b border-gray-300 bg-white px-6 md:px-[42px]">
        <div className="flex w-full items-center justify-between">
          {/* 로고 → 최상단으로 */}
          <a
            href="#top"
            className="flex items-center transition hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="GIF"
              width={56}
              height={37}
              loading="eager"
              style={{ width: 56, height: 37 }}
            />
          </a>

          {/* 데스크톱 중앙 메뉴 */}
          <nav className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
            {INTRO_NAV.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="pointer-events-auto flex h-15 items-center border-b-3 border-transparent px-5 text-[18px] font-medium transition-colors hover:border-yellow-600 max-lg:px-3 max-lg:text-[16px]"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* 데스크톱 로그아웃 + 모바일 햄버거 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-full border border-gray-300 px-4 py-1.5 text-[15px] font-medium text-gray-600 transition hover:border-yellow-600 hover:text-orange-700 md:inline-flex"
            >
              로그아웃
            </button>
            <button
              type="button"
              className="flex items-center justify-center md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="메뉴 열기"
            >
              <Menu className="h-8 w-8 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 오버레이 + 사이드바 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/5 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed right-0 top-15 z-[100] h-[calc(100vh-60px)] w-64 border-l border-gray-200 bg-white shadow-xl transition-all duration-300 ease-out md:hidden
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <div className="flex flex-col gap-2 py-4">
          {INTRO_NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="mx-2 rounded-lg px-4 py-3 text-left font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100"
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="mx-2 rounded-lg px-4 py-3 text-left font-medium text-orange-700 transition-all duration-200 hover:bg-yellow-100"
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}
