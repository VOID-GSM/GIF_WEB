"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "@repo/ui";

interface IntroNavItem {
  label: string;
  path: string;
}

// 각 항목은 /intro 하위의 개별 페이지로 이동한다.
const INTRO_NAV: IntroNavItem[] = [
  { label: "메인", path: "/intro" },
  { label: "아이디어페스티벌이란?", path: "/intro/about" },
  { label: "수상작 모음", path: "/intro/winners" },
  { label: "VOID", path: "/intro/void" },
];

interface IntroHeaderProps {
  /** 로그인 페이지 경로 */
  signinHref?: string;
}

export default function IntroHeader({
  signinHref = "/signin",
}: IntroHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogin = () => {
    router.push(signinHref);
  };

  return (
    <>
      <header className="fixed top-0 z-50 flex h-15 w-full items-center border-b border-gray-300 bg-white px-6 md:px-[42px]">
        <div className="flex w-full items-center justify-between">
          {/* 로고 → 메인 */}
          <button
            type="button"
            onClick={() => router.push("/intro")}
            className="flex cursor-pointer items-center transition hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="GIF"
              width={56}
              height={37}
              loading="eager"
              style={{ width: 56, height: 37 }}
            />
          </button>

          {/* 데스크톱 중앙 메뉴 */}
          <nav className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex">
            {INTRO_NAV.map(({ label, path }) => (
              <button
                key={path}
                type="button"
                onClick={() => router.push(path)}
                className={`pointer-events-auto flex h-15 cursor-pointer items-center whitespace-nowrap border-b-3 px-3 text-[14px] font-medium transition-colors lg:px-5 lg:text-[17px]
                  ${
                    pathname === path
                      ? "border-yellow-600"
                      : "border-transparent hover:border-yellow-600"
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* 데스크톱 로그아웃 + 모바일 햄버거 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogin}
              className="hidden cursor-pointer rounded-full border border-yellow-600 bg-yellow-50 px-5 py-1.5 text-[15px] font-bold text-gray-900 transition hover:bg-yellow-100 active:scale-95 md:inline-flex"
            >
              로그인
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="메뉴 열기"
            >
              <Menu className="h-8 w-8 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 오버레이 + 사이드바 (핸드폰 크기에서만 노출, 기존 Sidebar와 동일 디자인) */}
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
          {INTRO_NAV.map(({ label, path }) => (
            <button
              key={path}
              type="button"
              onClick={() => {
                router.push(path);
                setIsOpen(false);
              }}
              className={`mx-2 cursor-pointer rounded-lg px-4 py-3 text-left font-medium transition-all duration-200
                ${
                  pathname === path
                    ? "bg-yellow-100 text-yellow-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              handleLogin();
            }}
            className="mx-2 cursor-pointer rounded-lg border border-yellow-600 bg-yellow-50 px-4 py-3 text-left font-bold text-gray-900 transition-all duration-200 hover:bg-yellow-100"
          >
            로그인
          </button>
        </div>
      </div>
    </>
  );
}
