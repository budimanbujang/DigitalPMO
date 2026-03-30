'use client';

import React from 'react';
import {
  LayoutDashboard, ListTodo, Milestone, Wallet, ShieldAlert,
  GanttChart, Users, Sparkles, FileText,
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'milestones', label: 'Milestones', icon: Milestone },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'risks', label: 'Risks', icon: ShieldAlert },
  { id: 'timeline', label: 'Timeline', icon: GanttChart },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'documents', label: 'Documents', icon: FileText },
] as const;

interface ProjectTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <div className="overflow-x-auto" style={{ borderBottom: '1px solid var(--surface-container-high)' }}>
      <nav className="flex gap-1 min-w-max" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap"
              style={{
                fontFamily: 'Inter, sans-serif',
                borderBottomColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'var(--on-surface)' : 'var(--outline)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--on-surface)';
                  e.currentTarget.style.borderBottomColor = 'var(--surface-container-high)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--outline)';
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }
              }}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
