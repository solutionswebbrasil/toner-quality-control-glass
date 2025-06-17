
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarProps } from './types';

export const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  expandedMenus, 
  setExpandedMenus, 
  currentPage, 
  onPageChange, 
  filteredMenuItems 
}) => {
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

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-20 w-72 bg-blue-600 dark:bg-gray-800 border-r border-blue-700 dark:border-gray-700 transition-transform duration-300 ease-in-out flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-blue-700 dark:border-gray-700 flex-shrink-0 px-3">
        <span className="text-lg font-semibold text-center leading-tight text-white dark:text-white">
          Menu Principal
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {filteredMenuItems.map((item) => (
            item.submenu ? (
              <li key={item.id}>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-white hover:bg-blue-700 dark:hover:bg-gray-700",
                    expandedMenus.includes(item.id) && "bg-blue-700 dark:bg-gray-700"
                  )}
                  aria-expanded={expandedMenus.includes(item.id)}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0 text-white" />
                  <span className="flex-1 text-left leading-tight break-words text-xs text-white">
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
                          "flex items-center w-full px-3 py-2 ml-6 text-xs rounded-lg transition-colors duration-200 hover:bg-blue-700 dark:hover:bg-gray-700",
                          isActive(subItem.page) 
                            ? "bg-blue-500 text-white font-medium"
                            : "text-white"
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
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-blue-700 dark:hover:bg-gray-700",
                    isActive(item.page!) 
                      ? "bg-white text-blue-600 dark:bg-white dark:text-gray-800 font-medium"
                      : "text-white"
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
