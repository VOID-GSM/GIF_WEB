"use client";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProps } from "@repo/ui";

export default function Sidebar({ onClose, isOpen, navItems }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      className={`fixed top-15 right-0 w-64 h-[calc(100vh-60px)] bg-white border-l border-gray-200 shadow-xl
        z-[100] md:hidden transition-all duration-300 ease-out
        ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className="flex flex-col gap-2 py-4">
        {navItems.map(({ label, path }) => {
          const isActive = pathname === path;

          return (
            <button
              key={path}
              onClick={() => {
                router.push(path);
                onClose();
              }}
              className={`mx-2 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 cursor-pointer
            ${
              isActive
                ? "bg-yellow-100 text-yellow-700"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
