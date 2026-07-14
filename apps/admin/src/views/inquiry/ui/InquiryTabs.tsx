"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "문의하기", href: "/inquiry" },
  { label: "내 문의 내역", href: "/inquiry/my" },
];

export default function InquiryTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-2.5 flex items-center gap-1 border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/inquiry"
            ? pathname === "/inquiry"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative px-3 py-2.5 text-[14px] font-medium transition-colors ${
              isActive
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="animate-tab-underline absolute inset-x-0 -bottom-px h-[2px] origin-center rounded-full bg-yellow-600" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
