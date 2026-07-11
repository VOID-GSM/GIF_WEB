"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProps } from "@repo/ui";
import { removeCookieValue } from "@repo/lib";

export default function Sidebar({ navItems, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeCookieValue("access_token");
    onClose();
    router.replace("/signin");
    router.refresh();
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-[100] flex h-screen w-[220px] flex-col gap-1 border-r border-gray-200 bg-white px-4 py-6
        transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <button
        className="mb-6 flex items-center px-2 transition hover:opacity-80 cursor-pointer"
        onClick={() => {
          router.push("/");
          onClose();
        }}
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={56}
          height={37}
          loading="eager"
          style={{ width: 56, height: 37 }}
        />
      </button>

      {navItems.map(({ label, path }) => {
        const isActive = pathname === path;

        return (
          <div key={path} className="mx-2 border-b border-gray-100">
            <button
              onClick={() => {
                router.push(path);
                onClose();
              }}
              className={`w-full cursor-pointer rounded-lg px-4 py-3 text-left text-[16px] font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-yellow-100 text-yellow-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleLogout}
        className="mx-2 mt-2 cursor-pointer rounded-lg px-4 py-3 text-left text-[16px] font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-100 md:hidden"
      >
        로그아웃
      </button>
    </nav>
  );
}
