
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '../UserMenu';
import { ModeToggle } from '../ModeToggle';
import { Menu, X } from 'lucide-react';
import { HeaderProps } from './types';
import { cn } from '@/lib/utils';

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-blue-600 dark:bg-gray-800 border-b border-blue-700 dark:border-gray-700 fixed top-0 left-0 right-0 z-30 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="lg:hidden p-2 text-white hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        {/* Desktop menu button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="hidden lg:flex p-2 text-white hover:bg-blue-700 dark:text-white dark:hover:bg-gray-700"
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
