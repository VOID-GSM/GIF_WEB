import "@fontsource/press-start-2p";
import "./globals.css";
import { Providers } from "./providers";
// 1. Next.js 전용 Script 컴포넌트를 가져옵니다.
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 2. GTM 스크립트 추가 */}
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
      </head>
      <body className="overflow-x-hidden">
        {/* 3. GTM (noscript) 추가 */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NHGV58D6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
