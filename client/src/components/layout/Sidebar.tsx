
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarProps } from './types';
import { Shield, User } from 'lucide-react';

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
    <aside className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-center border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">SGQ PRO</span>
            <span className="text-xs text-blue-100">Sistema de Qualidade</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {filteredMenuItems.map((item) => 
            item.submenu ? (
              <div key={item.id}>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={cn(
                    "group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 shadow-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white hover:shadow-md hover:scale-102",
                    expandedMenus.includes(item.id) && "bg-slate-100 dark:bg-slate-700/50"
                  )}
                  aria-expanded={expandedMenus.includes(item.id)}
                >
                  <item.icon className="mr-3 h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                  <span className="flex-1 text-left truncate font-medium">{item.label}</span>
                  <svg
                    className={cn(
                      "ml-2 h-4 w-4 transition-transform duration-200 text-slate-500 dark:text-slate-400",
                      expandedMenus.includes(item.id) && "rotate-90"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {expandedMenus.includes(item.id) && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => onPageChange(subItem.page)}
                        className={cn(
                          "flex items-center w-full px-3 py-2 text-sm rounded-lg transition-all duration-200",
                          isActive(subItem.page)
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-white"
                        )}
                      >
                        <subItem.icon className="mr-3 h-4 w-4" />
                        <span className="truncate">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.id}
                onClick={() => onPageChange(item.page)}
                className={cn(
                  "group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 shadow-sm",
                  isActive(item.page)
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white hover:shadow-md hover:scale-102"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-all duration-200",
                    isActive(item.page)
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  )}
                />
                <span className="truncate font-medium">{item.label}</span>
                {isActive(item.page) && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white/30" />
                )}
              </button>
            )
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50 mt-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Administrador do Sistema
              </p>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              v2.0 • SGQ Professional
            </span>
          </div>
        </div>
      </nav>
    </aside>
  );
};
