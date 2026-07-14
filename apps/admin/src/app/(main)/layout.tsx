import AdminNavbar from "@/widgets/navbar/ui/AdminNavbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <main className="md:pl-[220px]">{children}</main>
    </>
  );
}
