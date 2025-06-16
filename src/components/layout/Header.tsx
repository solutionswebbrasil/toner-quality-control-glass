
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '../UserMenu';
import { ModeToggle } from '../ModeToggle';
import { Menu, X } from 'lucide-react';
import { HeaderProps } from './types';

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 w-full z-40">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <Button variant="ghost" className="lg:hidden" onClick={toggleSidebar}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
