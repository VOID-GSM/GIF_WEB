import "@fontsource/press-start-2p";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar, CLIENT_NAV_ITEMS } from "@repo/ui";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="overflow-x-hidden">
        <Providers>
          <Navbar navItems={CLIENT_NAV_ITEMS} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
