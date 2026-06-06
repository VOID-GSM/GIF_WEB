"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "@repo/ui";
import { HeaderProps } from "@repo/ui";

export default function Header({ onClick, navItems }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex fixed z-50 items-center h-20 px-[42px] gap-2 top-0 w-full bg-white border-b border-gray-300">
      <div className="flex items-center justify-between w-full">
        <button
          className="flex items-center transition hover:opacity-80 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src="/logo.png" alt="logo" width={75} height={50} />
        </button>
        <div>
          <button
            className="md:hidden flex items-center justify-center cursor-pointer"
            onClick={onClick}
          >
            <Menu className="w-10 h-10 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="hidden absolute inset-0 md:flex items-center justify-center pointer-events-none">
        {navItems.map(({ label, path }) => (
          <button
            key={path}
            className={`h-full w-[200px] max-[1300px]:w-[160px] max-lg:w-[110px] text-[24px] font-medium border-b-3 transition-colors cursor-pointer pointer-events-auto
              ${
                pathname === path
                  ? "border-yellow-600"
                  : "border-transparent hover:border-yellow-600"
              }`}
            onClick={() => router.push(path)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
