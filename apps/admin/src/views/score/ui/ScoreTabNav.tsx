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
      {TABS.map(({ label, href }) =>
        isActive(href) ? (
          <span
            key={href}
            className="text-xl sm:text-2xl font-bold pb-1 border-b-2 border-yellow-600 whitespace-nowrap"
          >
            {label}
          </span>
        ) : (
          <Link
            key={href}
            href={href}
            className="text-xl sm:text-2xl font-bold pb-1 text-gray-400 whitespace-nowrap"
          >
            {label}
          </Link>
        ),
      )}
    </nav>
  );
}
