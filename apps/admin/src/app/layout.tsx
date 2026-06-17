import "@fontsource/press-start-2p";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar, ADMIN_NAV_ITEMS } from "@repo/ui";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="overflow-x-hidden">
        <Navbar navItems={ADMIN_NAV_ITEMS} />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
