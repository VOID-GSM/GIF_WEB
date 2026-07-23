"use client";

import { useState } from "react";

// 프로젝트 로고 미등록(빈 값) 또는 이미지 로드 실패 시 사용할 GIF 기본 로고
const FALLBACK_LOGO = "/dark.GIF.logo.png";

interface ProjectLogoProps {
  // 외부 API에서 내려오는 프로젝트 로고 URL (미등록이면 빈 값/undefined)
  src?: string | null;
  alt: string;
  // 실제 로고가 정상 표시될 때 적용할 클래스
  className?: string;
  // 기본 로고로 대체될 때 적용할 클래스 (없으면 className 재사용)
  fallbackClassName?: string;
}

// 프로젝트 로고 — 미등록이거나 로드에 실패한 팀은 GIF 기본 로고로 대체한다.
export default function ProjectLogo({
  src,
  alt,
  className,
  fallbackClassName,
}: ProjectLogoProps) {
  const [failed, setFailed] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // src 가 새 URL 로 바뀌면 이전 실패 상태를 초기화한다(안 그러면 계속 폴백 로고 표시).
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailed(false);
  }

  const isFallback = !src || failed;
  const resolvedSrc = isFallback ? FALLBACK_LOGO : src;

  return (
    // logo는 외부 API에서 내려오는 동적 URL이라 next/image 대신 img 사용
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      className={isFallback ? (fallbackClassName ?? className) : className}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
