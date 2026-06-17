import { Navbar, ADMIN_NAV_ITEMS } from "@repo/ui";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar navItems={ADMIN_NAV_ITEMS} />
      <main>{children}</main>
    </>
  );
}
