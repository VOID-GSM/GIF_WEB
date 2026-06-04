import { Providers } from "./providers";
import "./globals.css";
import { Navbar } from "@repo/ui";
import { CLIENT_NAV_ITEMS } from "../shared/constants/nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="overflow-x-hidden h-screen">
        <Navbar navItems={CLIENT_NAV_ITEMS} />

        <main className="pt-20">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
