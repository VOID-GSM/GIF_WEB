import "@fontsource/press-start-2p";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";
import { ThemeScript } from "@repo/ui";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const GA_MEASUREMENT_ID = "G-HG4X4QW7L6";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeScript />
        {/* GA4 (gtag.js) */}
        <Script
          id="ga4-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="ga4-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </head>
      <body className="overflow-x-hidden">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
