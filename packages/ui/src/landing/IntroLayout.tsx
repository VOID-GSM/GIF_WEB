import type { ReactNode } from "react";
import IntroHeader from "./IntroHeader";
import IntroFooter from "./IntroFooter";

interface IntroLayoutProps {
  children: ReactNode;
  /** 로그아웃 후 이동할 경로 */
  signinHref?: string;
  /** 공개 프로젝트 목록 경로 — 전달하면 메뉴에 "프로젝트 둘러보기"가 추가된다 */
  projectsHref?: string;
}

/**
 * /intro 하위 페이지 공통 레이아웃. 고정 헤더 + 콘텐츠 + 푸터를 감싼다.
 */
export default function IntroLayout({
  children,
  signinHref = "/signin",
  projectsHref,
}: IntroLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900">
      <IntroHeader signinHref={signinHref} projectsHref={projectsHref} />
      {children}
      <IntroFooter />
    </div>
  );
}
