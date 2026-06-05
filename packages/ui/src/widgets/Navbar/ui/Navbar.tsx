"use client";
import { useState } from "react";
import { Header } from "@repo/ui";
import { Sidebar } from "@repo/ui";
import { NavbarProps } from "@repo/ui";

export default function Navbar({ navItems }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div>
      <Header
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        navItems={navItems}
      />
      <div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/5 z-[90] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar
          navItems={navItems}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
