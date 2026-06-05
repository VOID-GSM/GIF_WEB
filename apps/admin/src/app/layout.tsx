import { Providers } from "./providers";
import "./globals.css";
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

        <main className="pt-20">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
