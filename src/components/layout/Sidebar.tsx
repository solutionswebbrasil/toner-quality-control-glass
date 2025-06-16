
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
        "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform transform-translate-x-0 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-semibold dark:text-white">Menu Principal</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {filteredMenuItems.map((item) => (
            item.submenu ? (
              <li key={item.id} className="mb-1">
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={cn(
                    "flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                    expandedMenus.includes(item.id) ? "bg-gray-100 dark:bg-gray-700" : ""
                  )}
                  aria-controls={`dropdown-${item.id}`}
                  data-collapse-toggle={`dropdown-${item.id}`}
                >
                  <item.icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3 text-left">{item.label}</span>
                  <svg
                    className={cn(
                      "w-3 h-3 ml-auto",
                      expandedMenus.includes(item.id) ? "rotate-180" : ""
                    )}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
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
                  id={`dropdown-${item.id}`}
                  className={cn(
                    "py-2 space-y-2",
                    !expandedMenus.includes(item.id) ? "hidden" : ""
                  )}
                >
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id}>
                      <a
                        href="#"
                        onClick={() => {
                          onPageChange(subItem.page);
                          if (sidebarOpen) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={cn(
                          "flex items-center w-full p-2 pl-11 text-sm font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                          isActive(subItem.page) ? "bg-gray-100 dark:bg-gray-700" : ""
                        )}
                      >
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id} className="mb-1">
                <a
                  href="#"
                  onClick={() => {
                    onPageChange(item.page!);
                    if (sidebarOpen) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={cn(
                    "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                    isActive(item.page!) ? "bg-gray-100 dark:bg-gray-700" : ""
                  )}
                >
                  <item.icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3">{item.label}</span>
                </a>
              </li>
            )
          ))}
        </ul>
      </nav>
    </aside>
  );
};
