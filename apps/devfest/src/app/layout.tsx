import "@fontsource/press-start-2p";
import "./globals.css";

import SiteHeader from "@/widgets/site-header/ui/SiteHeader";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="overflow-x-hidden">
        <Providers>
          <SiteHeader />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
