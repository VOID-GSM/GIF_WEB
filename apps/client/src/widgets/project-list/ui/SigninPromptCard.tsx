"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buildSigninPath } from "@/shared/utils";

// 비로그인 사용자에게 보이는 로그인 안내 카드 — 로그인 후 지금 페이지로 돌아온다.
export default function SigninPromptCard() {
  const pathname = usePathname();

  return (
    <section className="w-full rounded-xl bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
      <span className="text-[13px] font-medium text-gray-400">로그인</span>
      <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.5px] text-gray-900">
        GIF에 참여해 보세요
      </h2>
      <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
        재학생은 DataGSM으로 로그인해 팀 프로젝트를 관리하고, 외부 방문객은
        Google 계정으로 좋아요·댓글에 참여할 수 있어요.
      </p>
      <Link
        href={buildSigninPath(pathname)}
        className="mt-5 flex h-[40px] w-full items-center justify-center rounded-[10px] border border-yellow-600 bg-yellow-50 text-[13px] font-bold text-gray-900 transition-colors hover:bg-yellow-100"
      >
        로그인하기
      </Link>
    </section>
  );
}
