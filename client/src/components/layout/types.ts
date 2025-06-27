
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: string;
  children?: MenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: string;
  page: string;
}

export interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  expandedMenus: string[];
  setExpandedMenus: React.Dispatch<React.SetStateAction<string[]>>;
  currentPage: string;
  onPageChange: (page: string) => void;
  filteredMenuItems: MenuItem[];
}

export interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}
