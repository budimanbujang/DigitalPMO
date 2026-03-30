'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, Moon, LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/layout/theme-provider';
import { useAppStore } from '@/stores/app-store';

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, toggleSidebar, sidebarOpen } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 px-6 transition-all duration-300',
        'bg-[var(--surface-container-lowest)]/80 backdrop-blur-lg shadow-[0_1px_3px_rgba(26,28,30,0.04)]',
        'dark:bg-[var(--surface-container-low)]/80 dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]',
        sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'
      )}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden rounded-md p-2 text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)]"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search trigger */}
      <button className="flex flex-1 items-center gap-2 rounded-lg bg-[var(--surface-container-low)] px-3 py-2 text-sm text-[var(--outline)] transition-colors hover:bg-[var(--surface-container-high)] max-w-md">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search projects, tasks, people...</span>
        <kbd className="ml-auto hidden rounded bg-[var(--surface-container-lowest)] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--outline)] sm:inline-block">
          Cmd+K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-container-low)]"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-container-low)]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--status-red)] text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--surface-container-low)]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-fixed)] text-[var(--primary)]">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-[var(--on-surface)]">
                {currentUser.name}
              </p>
              <p className="text-xs text-[var(--on-surface-variant)]">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[var(--on-surface-variant)] md:block" />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg p-1 glass shadow-[0_12px_40px_rgba(26,28,30,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-medium text-[var(--on-surface)]">
                  {currentUser.name}
                </p>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  {currentUser.email}
                </p>
              </div>
              <div className="h-px bg-[var(--outline-variant)] mx-2 mb-1 opacity-30" />
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--on-surface-variant)] transition-colors hover:bg-[var(--surface-container-low)]">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--status-red)] transition-colors hover:bg-[var(--surface-container-low)]">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
