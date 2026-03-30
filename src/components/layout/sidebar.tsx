'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bell,
  Settings,
  Bot,
  CircuitBoard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/people', label: 'People', icon: Users },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/agent', label: 'Agent Logs', icon: Bot },
];

const recentProjects = [
  { id: 'prj-001', name: 'MyDigital ID Platform' },
  { id: 'prj-002', name: 'PDPA Compliance System' },
  { id: 'prj-003', name: 'E-Perolehan Upgrade' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen flex-col bg-white shadow-[4px_0_24px_rgba(26,28,30,0.04)] transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16',
          'max-lg:translate-x-0',
          !sidebarOpen && 'max-lg:-translate-x-full lg:w-16'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d6e3ff]">
            <CircuitBoard className="h-5 w-5 text-[#001736]" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-heading font-semibold text-[#001736]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Digital PMO
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#d6e3ff] text-[#001736]'
                    : 'text-[#44474e] hover:bg-[#f3f3f6] hover:text-[#1a1c1e]'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            );
          })}

          {/* Project Quick Switcher */}
          {sidebarOpen && (
            <div className="mt-6 px-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#74777f]">
                Recent Projects
              </p>
              <div className="space-y-1">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[#44474e] transition-colors hover:bg-[#f3f3f6] hover:text-[#1a1c1e]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Agent Status */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            {sidebarOpen && (
              <span className="text-xs font-medium text-[#44474e]">
                Agent Active
              </span>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex h-10 items-center justify-center text-[#44474e] transition-colors hover:bg-[#f3f3f6] hover:text-[#1a1c1e]"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </aside>
    </>
  );
}
