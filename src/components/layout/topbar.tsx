'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';

export function TopBar() {
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
        'sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/80 backdrop-blur-lg px-6 shadow-[0_1px_3px_rgba(26,28,30,0.04)] transition-all duration-300',
        sidebarOpen ? 'lg:pl-6' : 'lg:pl-6'
      )}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden rounded-md p-2 text-[#44474e] hover:bg-[#f3f3f6] hover:text-[#1a1c1e]"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search trigger */}
      <button className="flex flex-1 items-center gap-2 rounded-lg bg-[#f3f3f6] px-3 py-2 text-sm text-[#74777f] transition-colors hover:bg-[#e8e8ea] max-w-md">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search projects, tasks, people...</span>
        <kbd className="ml-auto hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#74777f] sm:inline-block">
          Cmd+K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-[#44474e] transition-colors hover:bg-[#f3f3f6] hover:text-[#1a1c1e]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#f3f3f6]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d6e3ff] text-[#001736]">
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
              <p className="text-sm font-medium text-[#1a1c1e]">
                {currentUser.name}
              </p>
              <p className="text-xs text-[#44474e]">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[#44474e] md:block" />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-white/90 backdrop-blur-lg p-1 shadow-[0_12px_40px_rgba(26,28,30,0.06)]">
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-medium text-[#1a1c1e]">
                  {currentUser.name}
                </p>
                <p className="text-xs text-[#44474e]">
                  {currentUser.email}
                </p>
              </div>
              <div className="h-px bg-[#c4c6d0]/15 mx-2 mb-1" />
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-[#44474e] transition-colors hover:bg-[#f3f3f6] hover:text-[#1a1c1e]">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50">
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
