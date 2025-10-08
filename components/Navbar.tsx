import React from 'react';
import { Page } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { JournalIcon } from './icons/JournalIcon';
import { ChatIcon } from './icons/ChatIcon';

interface NavbarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-primary';
  const inactiveClasses = 'text-gray-400 hover:text-primary';

  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ activePage, onPageChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-lg border-t border-slate-700 flex justify-around items-center md:hidden">
      <NavItem
        icon={<HomeIcon className="w-6 h-6 mb-1" />}
        label="Home"
        isActive={activePage === 'dashboard'}
        onClick={() => onPageChange('dashboard')}
      />
      <NavItem
        icon={<ChecklistIcon className="w-6 h-6 mb-1" />}
        label="Tasks"
        isActive={activePage === 'tasks'}
        onClick={() => onPageChange('tasks')}
      />
      <NavItem
        icon={<JournalIcon className="w-6 h-6 mb-1" />}
        label="Journal"
        isActive={activePage === 'journal'}
        onClick={() => onPageChange('journal')}
      />
      <NavItem
        icon={<ChatIcon className="w-6 h-6 mb-1" />}
        label="Chat"
        isActive={activePage === 'chat'}
        onClick={() => onPageChange('chat')}
      />
    </nav>
  );
};