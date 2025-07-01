
export interface HeaderProps {
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export interface SidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  expandedMenus?: string[];
  setExpandedMenus?: (menus: string[]) => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  filteredMenuItems?: any[];
}
