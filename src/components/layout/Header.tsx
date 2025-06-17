
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '../UserMenu';
import { ModeToggle } from '../ModeToggle';
import { Menu, X } from 'lucide-react';
import { HeaderProps } from './types';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  const { theme } = useTheme();

  const getHeaderClasses = () => {
    if (theme === 'dark-plus') {
      return "header-bg";
    }
    return "bg-blue-600 dark:bg-gray-800 border-blue-700 dark:border-gray-700";
  };

  const getButtonClasses = () => {
    if (theme === 'dark-plus') {
      return "text-white dark-plus-hover";
    }
    return "text-white hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700";
  };

  return (
    <header className={cn("border-b fixed top-0 left-0 right-0 z-30 h-16", getHeaderClasses())}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="sm"
          className={cn("lg:hidden p-2", getButtonClasses())}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        {/* Desktop spacing - show button on desktop too for better UX */}
        <Button 
          variant="ghost" 
          size="sm"
          className={cn("hidden lg:flex p-2", getButtonClasses())}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        {/* Right side items */}
        <div className="flex items-center space-x-4 ml-auto">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
