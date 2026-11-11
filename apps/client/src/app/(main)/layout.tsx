import { cookies } from "next/headers";

import { Navbar, CLIENT_NAV_ITEMS, type NavItem } from "@repo/ui";

import { AuthSessionProvider, isAccountType } from "@/entities/auth";
import { COOKIE_KEYS, PUBLIC_HOME_PATH } from "@/shared/constants";

// 1. Next.js전용 Script 컴포넌트를 import 합니다.
import Script from "next/script";

// 비로그인 사용자는 공개 프로젝트 목록만 이용한다.
const PUBLIC_NAV_ITEMS: NavItem[] = [
  { labelKey: "projects", path: PUBLIC_HOME_PATH },
];

// 외부 사용자(Google 로그인)는 공개 목록에 더해 역량검사·Thyn 꾸미기를 이용한다.
const EXTERNAL_NAV_ITEMS: NavItem[] = [
  ...PUBLIC_NAV_ITEMS,
  { labelKey: "assessment", path: "/assessment" },
  { labelKey: "thyn", path: "/thyn" },
];

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 공개 페이지(프로젝트 목록·상세)도 이 레이아웃을 쓰므로 로그인 상태에 따라 메뉴를 나눈다.
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has(COOKIE_KEYS.ACCESS_TOKEN);
  const rawAccountType = cookieStore.get(COOKIE_KEYS.ACCOUNT_TYPE)?.value;
  const accountType = isAccountType(rawAccountType) ? rawAccountType : null;
  const isExternal = isLoggedIn && accountType === "EXTERNAL";
  const isPublicOnly = !isLoggedIn || isExternal;
  const navItems = !isLoggedIn
    ? PUBLIC_NAV_ITEMS
    : isExternal
      ? EXTERNAL_NAV_ITEMS
      : CLIENT_NAV_ITEMS;

  // QueryClient·Toaster 등 Providers는 루트 레이아웃에서 한 번만 렌더링한다.
  return (
    <AuthSessionProvider isLoggedIn={isLoggedIn} accountType={accountType}>
      {/* 2. Google Tag Manager 스크립트 추가 */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NHGV58D6');
          `,
        }}
      />

      {/* 3. Google Tag Manager (noscript) 추가 */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-NHGV58D6"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <Navbar
        navItems={navItems}
        isGuest={!isLoggedIn}
        homePath={isPublicOnly ? PUBLIC_HOME_PATH : "/"}
        showLanguageToggle
      />
      <main className="md:pl-[220px]">{children}</main>
    </AuthSessionProvider>
  );
}
