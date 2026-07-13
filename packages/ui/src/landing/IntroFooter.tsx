import Image from "next/image";
import Link from "next/link";

const NAV = [
  { label: "메인", path: "/intro" },
  { label: "수상작 모음", path: "/intro/winners" },
  { label: "아이디어페스티벌이란?", path: "/intro/about" },
  { label: "VOID", path: "/intro/void" },
];

export default function IntroFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-100 text-gray-600">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 브랜드 소개 */}
          <div className="lg:col-span-2">
            <Image
              src="/logo.png"
              alt="GIF"
              width={72}
              height={48}
              className="h-auto w-[64px]"
            />
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-gray-500">
              광주소프트웨어마이스터고 아이디어 페스티벌의 팀 구성부터 자료 제출,
              평가, 점수 집계까지 전 과정을 하나로 통합한 운영 플랫폼이에요.
            </p>
            <p className="mt-4 text-[13px] font-semibold text-gray-500">
              Made by Team VOID
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <p className="text-[13px] font-bold text-gray-900">바로가기</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="text-[14px] text-gray-500 transition hover:text-gray-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <p className="text-[13px] font-bold text-gray-900">문의</p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-gray-500">
              <li>
                <a
                  href="mailto:teamvoid0107@gmail.com"
                  className="transition hover:text-gray-900"
                >
                  teamvoid0107@gmail.com
                </a>
              </li>
              <li>광주소프트웨어마이스터고등학교</li>
            </ul>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-[13px] text-gray-400">
          <p>© 2026 Team VOID. Gwangju Software Meister High School.</p>
        </div>
      </div>
    </footer>
  );
}
