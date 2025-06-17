
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarProps } from './types';
import { useTheme } from '@/contexts/ThemeContext';

export const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  expandedMenus, 
  setExpandedMenus, 
  currentPage, 
  onPageChange, 
  filteredMenuItems 
}) => {
  const { theme } = useTheme();
  
  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      if (prev.includes(menuId)) {
        return prev.filter((id) => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  };

  const isActive = (page: string) => currentPage === page;

  const getSidebarClasses = () => {
    if (theme === 'dark-plus') {
      return "sidebar-bg";
    }
    return "bg-blue-600 dark:bg-gray-800 border-blue-700 dark:border-gray-700";
  };

  const getHeaderClasses = () => {
    if (theme === 'dark-plus') {
      return "sidebar-bg";
    }
    return "bg-blue-600 dark:bg-gray-800 border-blue-700 dark:border-gray-700";
  };

  const getTextClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-text";
    }
    return "text-white dark:text-white";
  };

  const getHoverClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-hover";
    }
    return "hover:bg-blue-700 dark:hover:bg-gray-700";
  };

  const getActiveClasses = () => {
    if (theme === 'dark-plus') {
      return "bg-white text-black";
    }
    return "bg-white text-blue-600 dark:bg-white dark:text-gray-800 font-medium";
  };

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-20 w-72 border-r transition-transform duration-300 ease-in-out flex flex-col",
        getSidebarClasses(),
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className={cn(
        "flex items-center justify-center h-16 border-b flex-shrink-0 px-3",
        getHeaderClasses()
      )}>
        <span className={cn("text-lg font-semibold text-center leading-tight", getTextClasses())}>
          Menu Principal
        </span>
      </div>
      <nav className={cn("flex-1 overflow-y-auto py-4", getSidebarClasses())}>
        <ul className="space-y-1 px-3">
          {filteredMenuItems.map((item) => (
            item.submenu ? (
              <li key={item.id}>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    getTextClasses(),
                    getHoverClasses(),
                    expandedMenus.includes(item.id) && (theme === 'dark-plus' ? "bg-gray-600" : "bg-blue-700 dark:bg-gray-700")
                  )}
                  aria-expanded={expandedMenus.includes(item.id)}
                >
                  <item.icon className={cn("w-5 h-5 mr-3 flex-shrink-0", getTextClasses())} />
                  <span className={cn("flex-1 text-left leading-tight break-words text-xs", getTextClasses())}>
                    {item.label}
                  </span>
                  <svg
                    className={cn(
                      "w-3 h-3 transition-transform duration-200 flex-shrink-0 ml-2",
                      expandedMenus.includes(item.id) ? "rotate-180" : ""
                    )}
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <ul
                  className={cn(
                    "mt-1 space-y-1 transition-all duration-200 ease-in-out overflow-hidden",
                    expandedMenus.includes(item.id) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id}>
                      <button
                        onClick={() => {
                          onPageChange(subItem.page);
                          if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={cn(
                          "flex items-center w-full px-3 py-2 ml-6 text-xs rounded-lg transition-colors duration-200",
                          getHoverClasses(),
                          isActive(subItem.page) 
                            ? getActiveClasses()
                            : getTextClasses()
                        )}
                      >
                        <span className="leading-tight break-words">{subItem.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onPageChange(item.page!);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    getHoverClasses(),
                    isActive(item.page!) 
                      ? getActiveClasses()
                      : getTextClasses()
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3 text-current flex-shrink-0" />
                  <span className="leading-tight break-words text-xs">{item.label}</span>
                </button>
              </li>
            )
          ))}
        </ul>
      </nav>
    </aside>
  );
};
