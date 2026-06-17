"use client";
import { useEffect, useState } from "react";

import { Header } from "@repo/ui";
import { Sidebar } from "@repo/ui";
import { NavbarProps } from "@repo/ui";
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
    <div>
      <Header
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        navItems={filteredNavItems}
      />
      <div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/5 z-[90] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar
          navItems={filteredNavItems}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
