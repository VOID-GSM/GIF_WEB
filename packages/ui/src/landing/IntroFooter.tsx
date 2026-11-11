import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const NAV = [
  { labelKey: "main", path: "/intro" },
  { labelKey: "winners", path: "/intro/winners" },
  { labelKey: "about", path: "/intro/about" },
  { labelKey: "void", path: "/intro/void" },
];

export default function IntroFooter() {
  const t = useTranslations("intro");
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
              {t("footer.description")}
            </p>
            <p className="mt-4 text-[13px] font-semibold text-gray-500">
              Made by Team VOID
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <p className="text-[13px] font-bold text-gray-900">{t("footer.shortcuts")}</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map(({ labelKey, path }) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="text-[14px] text-gray-500 transition hover:text-gray-900"
                  >
                    {t(`nav.${labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <p className="text-[13px] font-bold text-gray-900">{t("footer.contact")}</p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-gray-500">
              <li>
                <a
                  href="mailto:teamvoid0107@gmail.com"
                  className="transition hover:text-gray-900"
                >
                  teamvoid0107@gmail.com
                </a>
              </li>
              <li>{t("footer.school")}</li>
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
