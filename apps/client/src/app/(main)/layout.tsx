import { Navbar, CLIENT_NAV_ITEMS } from "@repo/ui";
import { Providers } from "../providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Navbar navItems={CLIENT_NAV_ITEMS} />
      <main className="pt-15">{children}</main>
    </Providers>
  );
}
