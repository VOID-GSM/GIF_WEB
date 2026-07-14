import { Navbar, CLIENT_NAV_ITEMS } from "@repo/ui";
import { Providers } from "../providers";
// 1. Next.js전용 Script 컴포넌트를 import 합니다.
import Script from "next/script";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
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

      <Navbar navItems={CLIENT_NAV_ITEMS} />
      <main className="md:pl-[220px]">{children}</main>
    </Providers>
  );
}
