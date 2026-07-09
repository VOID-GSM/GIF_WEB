"use client";
import { useState } from "react";

import { Header } from "@repo/ui";
import { Sidebar } from "@repo/ui";
import { NavbarProps } from "@repo/ui";
import { useGetScoreNotice } from "@repo/lib";

export default function Navbar({ navItems }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: notice } = useGetScoreNotice();
  const isRankPublished = notice?.isPublished ?? false;

  const filteredNavItems = navItems.filter((item) => {
    if (item.path !== "/rank") return true;
    return isRankPublished;
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
