import "@fontsource/press-start-2p";
import "./globals.css";

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
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
