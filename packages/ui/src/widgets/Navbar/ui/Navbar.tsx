"use client";
import { useEffect, useState } from "react";

import { Sidebar } from "@repo/ui";
import { NavbarProps } from "@repo/ui";
import { Menu } from "@repo/ui";
import { getCookieValue } from "@repo/lib";

export default function Navbar({ navItems }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRankPublished, setIsRankPublished] = useState<boolean | null>(null);

  useEffect(() => {
    setIsRankPublished(getCookieValue("rank_announced") === "1");
  }, []);

  const filteredNavItems = navItems.filter((item) => {
    if (item.path !== "/rank") return true;
    return isRankPublished === true;
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 cursor-pointer md:hidden"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/5 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        navItems={filteredNavItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
