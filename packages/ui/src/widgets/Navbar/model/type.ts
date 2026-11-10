export interface NavItem {
  label: string;
  path: string;
}

export interface NavbarProps {
  navItems: NavItem[];
  // 비로그인 상태 — 알림·푸시를 끄고 로그아웃 대신 로그인 버튼을 노출한다.
  isGuest?: boolean;
  // 로고를 눌렀을 때 이동할 경로 (기본 "/")
  homePath?: string;
}

export interface SidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  isGuest?: boolean;
  homePath?: string;
}
