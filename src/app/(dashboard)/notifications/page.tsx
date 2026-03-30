'use client';

import React, { useState } from 'react';
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
  X,
  BellOff,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from '@/hooks/use-notifications';
import type { NotificationType, Priority } from '@/types';

const typeIcons: Record<NotificationType, React.ElementType> = {
  TASK_OVERDUE: Clock,
  MILESTONE_AT_RISK: Target,
  BUDGET_ALERT: DollarSign,
  CHASE_REQUEST: Send,
  AI_INSIGHT: Brain,
  STATUS_UPDATE_DUE: FileText,
  ESCALATION: ArrowUpCircle,
};

const typeLabels: Record<NotificationType, string> = {
  TASK_OVERDUE: 'Task Overdue',
  MILESTONE_AT_RISK: 'Milestone at Risk',
  BUDGET_ALERT: 'Budget Alert',
  CHASE_REQUEST: 'Chase Request',
  AI_INSIGHT: 'AI Insight',
  STATUS_UPDATE_DUE: 'Status Update',
  ESCALATION: 'Escalation',
};

const severityColors: Record<Priority, string> = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-amber-500',
  LOW: 'bg-green-500',
};

const typeIconColors: Record<NotificationType, string> = {
  TASK_OVERDUE: 'text-red-400 bg-red-500/10',
  MILESTONE_AT_RISK: 'text-amber-400 bg-amber-500/10',
  BUDGET_ALERT: 'text-orange-400 bg-orange-500/10',
  CHASE_REQUEST: 'text-blue-400 bg-blue-500/10',
  AI_INSIGHT: 'text-purple-400 bg-purple-500/10',
  STATUS_UPDATE_DUE: 'text-cyan-400 bg-cyan-500/10',
  ESCALATION: 'text-red-400 bg-red-500/10',
};

const groupLabels = {
  today: 'Today',
  this_week: 'This Week',
  earlier: 'Earlier',
};

const allTypes: NotificationType[] = [
  'TASK_OVERDUE',
  'MILESTONE_AT_RISK',
  'BUDGET_ALERT',
  'CHASE_REQUEST',
  'AI_INSIGHT',
  'STATUS_UPDATE_DUE',
  'ESCALATION',
];

const allSeverities: Priority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

const allProjects = [
  'MyDigital ID Platform',
  'PDPA Compliance System',
  'E-Perolehan Upgrade',
];

export default function NotificationsPage() {
  const {
    grouped,
    unreadCount,
    filters,
    setFilters,
    markAsRead,
    markAllRead,
    snooze,
    dismiss,
    bulkMarkRead,
    bulkSnooze,
    bulkDismiss,
    timeAgo,
  } = useNotifications();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const all = [...grouped.today, ...grouped.this_week, ...grouped.earlier];
    setSelected(new Set(all.map((n) => n.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const handleBulkMarkRead = () => {
    bulkMarkRead(Array.from(selected));
    clearSelection();
  };

  const handleBulkSnooze = () => {
    bulkSnooze(Array.from(selected));
    clearSelection();
  };

  const handleBulkDismiss = () => {
    bulkDismiss(Array.from(selected));
    clearSelection();
  };

  const renderNotificationCard = (n: Notification) => {
    const Icon = typeIcons[n.type];
    const iconColor = typeIconColors[n.type];

    return (
      <div
        key={n.id}
        className={cn(
          'group relative flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:bg-secondary/30',
          !n.read && 'border-l-4 border-l-primary bg-primary/[0.02]'
        )}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected.has(n.id)}
          onChange={() => toggleSelect(n.id)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border bg-secondary accent-primary"
        />

        {/* Type icon */}
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            iconColor
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={n.actionUrl || '#'}
              onClick={() => markAsRead(n.id)}
              className="block"
            >
              <h3
                className={cn(
                  'text-sm leading-snug',
                  !n.read
                    ? 'font-semibold text-foreground'
                    : 'font-medium text-muted-foreground'
                )}
              >
                {n.title}
              </h3>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  severityColors[n.severity]
                )}
                title={n.severity}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {timeAgo(n.createdAt)}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {n.message}
          </p>
          <div className="mt-2 flex items-center gap-3">
            {n.projectName && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {n.projectName}
              </span>
            )}
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {typeLabels[n.type]}
            </span>
          </div>
        </div>

        {/* Quick actions (on hover) */}
        <div className="absolute right-3 top-3 hidden items-center gap-1 group-hover:flex">
          {!n.read && (
            <button
              onClick={() => markAsRead(n.id)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Mark as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => snooze(n.id)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Snooze"
          >
            <BellOff className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => dismiss(n.id)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  const renderGroup = (
    key: 'today' | 'this_week' | 'earlier',
    items: Notification[]
  ) => {
    if (items.length === 0) return null;
    return (
      <div key={key}>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {groupLabels[key]}
        </h3>
        <div className="space-y-2">{items.map(renderNotificationCard)}</div>
      </div>
    );
  };

  const hasAny =
    grouped.today.length + grouped.this_week.length + grouped.earlier.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors',
              showFilters
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value as NotificationType | 'ALL' })
              }
              className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-foreground"
            >
              <option value="ALL">All Types</option>
              {allTypes.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Project
            </label>
            <select
              value={filters.project}
              onChange={(e) =>
                setFilters({ ...filters, project: e.target.value })
              }
              className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-foreground"
            >
              <option value="ALL">All Projects</option>
              {allProjects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value as Priority | 'ALL' })
              }
              className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-foreground"
            >
              <option value="ALL">All Severities</option>
              {allSeverities.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium text-foreground">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkMarkRead}
              className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              Mark Read
            </button>
            <button
              onClick={handleBulkSnooze}
              className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Snooze
            </button>
            <button
              onClick={handleBulkDismiss}
              className="rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
            >
              Dismiss
            </button>
          </div>
          <button
            onClick={selectAll}
            className="ml-auto text-xs text-primary hover:underline"
          >
            Select All
          </button>
          <button
            onClick={clearSelection}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      {/* Notification groups */}
      {hasAny ? (
        <div className="space-y-8">
          {renderGroup('today', grouped.today)}
          {renderGroup('this_week', grouped.this_week)}
          {renderGroup('earlier', grouped.earlier)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-16">
          <Bell className="h-12 w-12 text-muted-foreground/30" />
          <h3 className="mt-4 text-sm font-medium text-muted-foreground">
            No notifications
          </h3>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {filters.type !== 'ALL' || filters.project !== 'ALL' || filters.severity !== 'ALL'
              ? 'Try adjusting your filters'
              : "You're all caught up!"}
          </p>
        </div>
      )}
    </div>
  );
}
