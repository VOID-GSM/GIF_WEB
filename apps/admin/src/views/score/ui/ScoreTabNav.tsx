"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "점수 부여", href: "/score" },
  { label: "점수 합계", href: "/score/collection" },
] as const;

export default function ScoreTabNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/score/collection") return pathname.startsWith("/score/collection");
    if (href === "/score") return pathname === "/score" || (pathname.startsWith("/score/") && !pathname.startsWith("/score/collection"));
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="flex gap-6 w-full">
      {TABS.map(({ label, href }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`relative pb-1 text-xl sm:text-2xl font-bold whitespace-nowrap transition-colors ${
              active ? "text-black" : "text-gray-400"
            }`}
          >
            {label}
            {active && (
              // 라우트 이동마다 새로 마운트되므로 CSS 애니메이션이 매번 자동 재생된다.
              <span className="animate-tab-underline absolute inset-x-0 bottom-0 h-0.5 origin-center bg-yellow-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
