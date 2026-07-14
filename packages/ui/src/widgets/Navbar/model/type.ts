export interface NavItem {
  label: string;
  path: string;
}

export interface NavbarProps {
  navItems: NavItem[];
}

export interface SidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}
