"use client";

import { Navbar, ADMIN_NAV_ITEMS } from "@repo/ui";

import { useGetMyInfo } from "@/entities/mypage";
import { PRIVILEGED_ADMIN_EMAIL } from "@/shared/constants";

export default function AdminNavbar() {
  const { data: myInfo } = useGetMyInfo();
  const canManageInquiry = myInfo?.email === PRIVILEGED_ADMIN_EMAIL;

  const navItems = ADMIN_NAV_ITEMS.filter((item) => {
    if (item.path !== "/inquiry/admin") return true;
    return canManageInquiry;
  });

  return <Navbar navItems={navItems} />;
}
