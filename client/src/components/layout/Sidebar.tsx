
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { menuItems, MenuItem } from './menuItems';

interface SubMenuItem {
  id: string;
  label: string;
  icon?: any;
}

interface SidebarProps {
  isOpen: boolean;
  onNavigateTo: (pageId: string) => void;
  currentPage: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigateTo, currentPage }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const IconComponent = item.icon;
    const isActive = currentPage === item.id;

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleItem(item.id);
            } else {
              onNavigateTo(item.id);
            }
          }}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors",
            isActive 
              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <div className="flex items-center gap-3">
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {isOpen && <span className="text-sm">{item.label}</span>}
          </div>
          {hasSubItems && isOpen && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {hasSubItems && isExpanded && isOpen && (
          <div className="ml-4 mt-1 border-l border-slate-200 dark:border-slate-700">
            {item.subItems?.map((subItem: SubMenuItem) => {
              const SubIconComponent = subItem.icon;
              const isSubActive = currentPage === subItem.id;
              
              return (
                <button
                  key={subItem.id}
                  onClick={() => onNavigateTo(subItem.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 ml-4 text-left rounded-lg transition-colors text-sm",
                    isSubActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {SubIconComponent && <SubIconComponent className="w-3 h-3" />}
                  <span>{subItem.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 overflow-y-auto h-full">
        <nav className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </nav>
      </div>
    </div>
  );
};
