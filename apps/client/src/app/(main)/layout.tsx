import { Navbar, CLIENT_NAV_ITEMS } from "@repo/ui";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar navItems={CLIENT_NAV_ITEMS} />
      <main className="pt-20">{children}</main>
    </>
  );
}
