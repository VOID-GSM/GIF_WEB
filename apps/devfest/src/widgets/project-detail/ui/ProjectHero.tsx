"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ProjectLogo } from "@repo/ui";

import { useLogoBg, type Project } from "@/entities/project";

interface ProjectHeroProps {
  project: Project;
}

// heroBg 색의 밝기로 텍스트 색(어둡게/밝게)을 자동 결정
function isLightColor(hex?: string) {
  if (!hex) return false;
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const [open, setOpen] = useState(false);
  // 시연 영상이 없고 사진으로 소개하는 프로젝트: 배너에 사진을 배치 (라이트박스 인덱스)
  const photos = project.photos ?? [];
  const hasPhotos = !project.demoVideoUrl && photos.length > 0;
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  // 영상 실제 비율에 맞춰 배너 비율을 조정. 로드 전 기본값(앱 영상은 세로 9:16)
  const [ratio, setRatio] = useState(
    project.videoFit === "contain" ? 9 / 16 : 16 / 9,
  );
  // contain: 세로형 앱 영상 등 전체 표시(좌우 여백) / cover(기본): 꽉 채우고 넘치는 하단 크롭
  const isContain = project.videoFit === "contain";
  // 배경색 밝기에 따라 텍스트/스크림 톤 자동 전환 (밝은 배경 → 어두운 글자)
  const isLightHero = isLightColor(project.heroBg);
  // 타이틀 옆 로고 썸네일 배경 — 로고 배경색에 맞춰 대비/잘림 방지
  const logoBg = useLogoBg(project.logo, project.logoBg);
  const domain = project.siteUrl
    ?.replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  // 영상 모달 열림 동안 스크롤 잠금 + Esc 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // 사진 라이트박스 열림 동안 스크롤 잠금 + Esc 닫기 / 좌우 키 이동
  useEffect(() => {
    if (activePhoto === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePhoto(null);
      if (e.key === "ArrowRight")
        setActivePhoto((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft")
        setActivePhoto((i) =>
          i === null ? i : (i - 1 + photos.length) % photos.length,
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activePhoto, photos.length]);

  // 사진 라이트박스 (사진 히어로에서 공용 사용)
  const photoLightbox = activePhoto !== null && photos[activePhoto] && (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={() => setActivePhoto(null)}
    >
      <button
        type="button"
        onClick={() => setActivePhoto(null)}
        aria-label="닫기"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[22px] text-white transition-colors hover:bg-white/20"
      >
        ✕
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhoto((i) =>
                i === null ? i : (i - 1 + photos.length) % photos.length,
              );
            }}
            aria-label="이전 사진"
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[22px] text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhoto((i) => (i === null ? i : (i + 1) % photos.length));
            }}
            aria-label="다음 사진"
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[22px] text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            ›
          </button>
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[activePhoto]}
        alt={`${project.name} 스크린샷 ${activePhoto + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-auto max-w-[92vw] rounded-[12px] bg-black object-contain shadow-2xl"
      />
    </div>
  );

  // ── 사진으로 소개하는 프로젝트: 정상 플로우 기반 반응형 히어로 ──
  // 세로형 스크린샷을 가로 스크롤 갤러리로 배치(모바일 스와이프), 아래에 타이틀.
  if (hasPhotos) {
    // 사진 배너는 밝은 배경이 기본. heroBg가 있으면 그 색과 밝기를 따른다.
    const light = project.heroBg ? isLightHero : true;
    return (
      <section
        style={
          project.heroBg
            ? ({ backgroundColor: project.heroBg } as CSSProperties)
            : undefined
        }
        className={`relative w-full ${
          project.heroBg ? "" : "bg-gradient-to-b from-gray-50 to-gray-100"
        }`}
      >
        {/* 상단: 뒤로가기 */}
        <div className="mx-auto max-w-[1200px] px-5 pt-5">
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors ${
              light
                ? "text-gray-600 hover:text-black"
                : "text-white/80 hover:text-white"
            }`}
          >
            ← 목록으로
          </Link>
        </div>

        {/* 스크린샷 갤러리 — 화면에 모두 들어오는 반응형 그리드(모바일 2열 / 데스크톱 4열).
            폰 비율 프레임 안에서 object-contain → 이미지가 잘리지 않고 전체 표시. */}
        <div className="mx-auto max-w-[1000px] px-5 py-8 md:py-10">
          <div
            className={`grid gap-4 sm:gap-5 ${
              photos.length >= 4
                ? "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3"
            }`}
          >
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => setActivePhoto(index)}
                aria-label={`${project.name} 스크린샷 ${index + 1} 크게 보기`}
                className="group flex aspect-[9/19] cursor-pointer items-center justify-center overflow-hidden rounded-[18px] bg-white/70 shadow-xl ring-1 ring-black/5 transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={`${project.name} 스크린샷 ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 타이틀 */}
        <div className="mx-auto max-w-[1200px] px-5 pb-10 md:pb-14">
          <div className="flex items-end gap-4">
            <div
              className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-white shadow-lg sm:block"
              style={logoBg ? { backgroundColor: logoBg } : undefined}
            >
              <ProjectLogo
                src={project.logo}
                alt=""
                className={`h-full w-full ${
                  project.logoFit === "cover"
                    ? "object-cover"
                    : "object-contain p-2.5"
                }`}
                fallbackClassName="h-full w-full object-contain p-2.5"
              />
            </div>
            <div>
              <h1
                className={`text-[clamp(1.6rem,5.5vw,4rem)] font-bold leading-[1.04] tracking-[-1px] ${
                  light ? "text-black" : "text-white"
                }`}
              >
                {project.name}
              </h1>
              <p
                className={`mt-1.5 text-[15px] font-medium ${
                  light ? "text-gray-600" : "text-white/75"
                }`}
              >
                팀 {project.teamName}
              </p>
            </div>
          </div>

          {project.siteUrl && (
            <a
              href={project.siteUrl}
              target="_blank"
              rel="noreferrer"
              className={`group mt-5 inline-flex items-center gap-2 rounded-full border py-1.5 pl-3 pr-2.5 text-[13px] font-medium backdrop-blur transition-colors duration-200 ${
                light
                  ? "border-black/10 bg-black/5 text-gray-800 hover:bg-black/10"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
              </svg>
              <span>{domain}</span>
            </a>
          )}
        </div>

        {photoLightbox}
      </section>
    );
  }

  return (
    <section
      style={
        {
          ...(isContain
            ? { "--r": String(ratio) }
            : { aspectRatio: String(ratio) }),
          ...(project.heroBg ? { backgroundColor: project.heroBg } : {}),
        } as CSSProperties
      }
      className={`relative w-full overflow-hidden ${
        project.heroBg ? "" : "bg-black"
      } ${
        isContain
          ? "aspect-[var(--r)] md:aspect-auto md:h-screen md:min-h-[420px]"
          : "min-h-[320px] max-h-screen"
      }`}
    >
      {/* 대형 시연영상 배너 — 클릭 시 크게 보기 */}
      {project.demoVideoUrl ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="시연영상 크게 보기"
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              if (v.videoWidth && v.videoHeight)
                setRatio(v.videoWidth / v.videoHeight);
            }}
            className={`absolute inset-0 h-full w-full ${
              isContain ? "object-contain" : "object-cover object-top"
            }`}
          >
            <source src={project.demoVideoUrl} type="video/mp4" />
          </video>
          {/* 재생/확대 어포던스 */}
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-80 backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-black/60 group-hover:opacity-100">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      ) : (
        // 영상 없는 프로젝트: 로고를 배너 가운데 정렬 (워드마크/그래픽 로고가 잘리지 않도록)
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white p-10 sm:p-16">
          <ProjectLogo
            src={project.logo}
            alt={project.name}
            className="max-h-[55%] max-w-[72%] object-contain"
            fallbackClassName="max-h-[55%] max-w-[72%] object-contain"
          />
        </div>
      )}

      {/* 가독성용 스크림 (클릭 통과) — 커스텀 배경색이 있으면 영상을 덮지 않도록 생략 */}
      {!project.heroBg && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />
      )}

      {/* 상단: 뒤로가기 */}
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="mx-auto max-w-[1200px] px-5 py-5">
          <Link
            href="/"
            className={`pointer-events-auto inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors ${
              isLightHero
                ? "text-gray-600 hover:text-black"
                : "text-white/80 hover:text-white"
            }`}
          >
            ← 목록으로
          </Link>
        </div>
      </div>

      {/* 타이틀 — 배너가 화면보다 길어도 항상 첫 화면 하단에 보이도록 고정 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1200px] px-5 pb-6 md:pb-14">
          <div className="flex items-end gap-4">
            <div
              className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-[16px] bg-white/95 shadow-lg sm:block"
              style={logoBg ? { backgroundColor: logoBg } : undefined}
            >
              <ProjectLogo
                src={project.logo}
                alt=""
                className={`h-full w-full ${
                  project.logoFit === "cover"
                    ? "object-cover"
                    : "object-contain p-2.5"
                }`}
                fallbackClassName="h-full w-full object-contain p-2.5"
              />
            </div>
            <div>
              <h1
                className={`text-[clamp(1.6rem,5.5vw,4rem)] font-bold leading-[1.04] tracking-[-1px] ${
                  isLightHero ? "text-black" : "text-white"
                }`}
              >
                {project.name}
              </h1>
              <p
                className={`mt-1.5 text-[15px] font-medium ${
                  isLightHero ? "text-gray-600" : "text-white/75"
                }`}
              >
                팀 {project.teamName}
              </p>
            </div>
          </div>

          {project.siteUrl && (
            <a
              href={project.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="group pointer-events-auto mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-3 pr-2.5 text-[13px] font-medium text-white backdrop-blur transition-colors duration-200 hover:bg-white/20"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
              </svg>
              <span>{domain}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* 시연영상 모달 */}
      {open && project.demoVideoUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="닫기"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[22px] text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>
          <video
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-auto max-w-[92vw] rounded-[12px] bg-black shadow-2xl"
          >
            <source src={project.demoVideoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </section>
  );
}
