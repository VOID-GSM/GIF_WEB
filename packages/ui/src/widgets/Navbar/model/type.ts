export interface NavItem {
  label: string;
  path: string;
}

export interface NavbarProps {
  navItems: NavItem[];
}

export interface HeaderProps {
  onClick: () => void;
  navItems: NavItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
}
