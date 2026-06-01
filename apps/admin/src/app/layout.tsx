import { Providers } from "./providers";
import "./globals.css";
import { Navbar } from "../components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
