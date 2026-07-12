import Link from "next/link";

// GIF 브랜드 헤더 — 네비게이션 없이 아이덴티티만 노출
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      {/* 상단 옐로우 브랜드 라인 — 높이에 영향 없도록 absolute */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-400" />
      <div className="mx-auto flex h-14 max-w-[1200px] items-center px-5">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/gif-logo.png" alt="GIF" className="h-7 w-auto" />
          <span className="hidden text-[13px] font-semibold tracking-[-0.2px] text-gray-500 sm:inline">
            GSM Idea Festival
          </span>
        </Link>
      </div>
    </header>
  );
}
