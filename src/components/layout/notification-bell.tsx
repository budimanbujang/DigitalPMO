'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Clock,
  AlertTriangle,
  Brain,
  Target,
  DollarSign,
  Send,
  ArrowUpCircle,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/use-notifications';
import type { NotificationType } from '@/types';

const typeIcons: Record<NotificationType, React.ElementType> = {
  TASK_OVERDUE: Clock,
  MILESTONE_AT_RISK: Target,
  BUDGET_ALERT: DollarSign,
  CHASE_REQUEST: Send,
  AI_INSIGHT: Brain,
  STATUS_UPDATE_DUE: FileText,
  ESCALATION: ArrowUpCircle,
};

const typeIconColors: Record<NotificationType, string> = {
  TASK_OVERDUE: 'text-red-400',
  MILESTONE_AT_RISK: 'text-amber-400',
  BUDGET_ALERT: 'text-orange-400',
  CHASE_REQUEST: 'text-blue-400',
  AI_INSIGHT: 'text-purple-400',
  STATUS_UPDATE_DUE: 'text-cyan-400',
  ESCALATION: 'text-red-400',
};

export function NotificationBell() {
  const { latestUnread, unreadCount, markAsRead, timeAgo } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rag-red text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-lg border border-border bg-[#0D1321] shadow-xl z-50">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {latestUnread.length > 0 ? (
              <div className="divide-y divide-border">
                {latestUnread.map((n) => {
                  const Icon = typeIcons[n.type];
                  const iconColor = typeIconColors[n.type];
                  return (
                    <Link
                      key={n.id}
                      href={n.actionUrl || '#'}
                      onClick={() => {
                        markAsRead(n.id);
                        setOpen(false);
                      }}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/30"
                    >
                      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconColor)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {n.message}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {n.projectName && (
                            <span className="text-[11px] text-muted-foreground/60">
                              {n.projectName}
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground/60">
                            {timeAgo(n.createdAt)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markAsRead(n.id);
                        }}
                        className="mt-1 shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        title="Mark as read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-xs text-muted-foreground">
                  No new notifications
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border p-2">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
