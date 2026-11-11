import { NavItem } from "@repo/ui";

// labelKey 는 "nav" 네임스페이스의 번역 키다.
export const ADMIN_NAV_ITEMS: NavItem[] = [
  { labelKey: "main", path: "/" },
  { labelKey: "notice", path: "/notice" },
  { labelKey: "form", path: "/form" },
  { labelKey: "rank", path: "/rank" },
  { labelKey: "score", path: "/score" },
  { labelKey: "stats", path: "/stats" },
  { labelKey: "teachers", path: "/teachers" },
  { labelKey: "comments", path: "/comments" },
  { labelKey: "inquiry", path: "/inquiry" },
  { labelKey: "inquiryAdmin", path: "/inquiry/admin" },
];

export const CLIENT_NAV_ITEMS: NavItem[] = [
  { labelKey: "main", path: "/" },
  { labelKey: "notice", path: "/notice" },
  { labelKey: "form", path: "/form" },
  { labelKey: "rank", path: "/rank" },
  { labelKey: "retrospective", path: "/retrospective" },
  { labelKey: "inquiry", path: "/inquiry" },
  { labelKey: "assessment", path: "/assessment" },
  { labelKey: "thyn", path: "/thyn" },
  { labelKey: "mypage", path: "/mypage" },
];
