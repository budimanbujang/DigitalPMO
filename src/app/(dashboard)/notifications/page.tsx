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
  TASK_OVERDUE: 'text-red-600 bg-red-50',
  MILESTONE_AT_RISK: 'text-amber-600 bg-amber-50',
  BUDGET_ALERT: 'text-orange-600 bg-orange-50',
  CHASE_REQUEST: 'text-blue-600 bg-blue-50',
  AI_INSIGHT: 'text-[var(--ai-accent)] bg-violet-50',
  STATUS_UPDATE_DUE: 'text-cyan-600 bg-cyan-50',
  ESCALATION: 'text-red-600 bg-red-50',
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
          'group relative flex items-start gap-4 rounded-xl bg-[var(--surface-container-lowest)] p-4 transition-all hover:translate-y-[-1px]',
          !n.read && 'border-l-4 border-l-[var(--primary)]'
        )}
        style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected.has(n.id)}
          onChange={() => toggleSelect(n.id)}
          className="mt-1 h-4 w-4 shrink-0 rounded accent-[var(--primary)]"
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
                    ? 'font-semibold text-[var(--on-surface)]'
                    : 'font-medium text-[var(--outline)]'
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
              <span className="text-xs text-[var(--outline)] whitespace-nowrap">
                {timeAgo(n.createdAt)}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-[var(--on-surface-variant)] line-clamp-2">
            {n.message}
          </p>
          <div className="mt-2 flex items-center gap-3">
            {n.projectName && (
              <span className="inline-flex items-center rounded-full bg-[var(--surface-container-low)] px-2 py-0.5 text-[11px] font-medium text-[var(--on-surface-variant)]">
                {n.projectName}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-[var(--surface-container-low)] px-2 py-0.5 text-[11px] font-medium text-[var(--on-surface-variant)]">
              {typeLabels[n.type]}
            </span>
          </div>
        </div>

        {/* Quick actions (on hover) */}
        <div className="absolute right-3 top-3 hidden items-center gap-1 group-hover:flex">
          {!n.read && (
            <button
              onClick={() => markAsRead(n.id)}
              className="rounded-md p-1.5 text-[var(--outline)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]"
              title="Mark as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => snooze(n.id)}
            className="rounded-md p-1.5 text-[var(--outline)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]"
            title="Snooze"
          >
            <BellOff className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => dismiss(n.id)}
            className="rounded-md p-1.5 text-[var(--outline)] hover:bg-red-50 hover:text-red-600"
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
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--outline)]">
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
          <h1 className="text-2xl font-heading font-bold tracking-tight text-[var(--on-surface)]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              showFilters
                ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                : 'text-[var(--outline)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]'
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)]/10 px-3 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div
          className="flex flex-wrap items-center gap-3 rounded-xl bg-[var(--surface-container-lowest)] p-4"
          style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--outline)]">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value as NotificationType | 'ALL' })
              }
              className="rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-1.5 text-sm text-[var(--on-surface)]"
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
            <label className="mb-1 block text-xs font-medium text-[var(--outline)]">
              Project
            </label>
            <select
              value={filters.project}
              onChange={(e) =>
                setFilters({ ...filters, project: e.target.value })
              }
              className="rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-1.5 text-sm text-[var(--on-surface)]"
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
            <label className="mb-1 block text-xs font-medium text-[var(--outline)]">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value as Priority | 'ALL' })
              }
              className="rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-1.5 text-sm text-[var(--on-surface)]"
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
        <div className="flex items-center gap-3 rounded-xl bg-[var(--primary)]/5 px-4 py-3">
          <span className="text-sm font-medium text-[var(--on-surface)]">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkMarkRead}
              className="rounded-lg bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20"
            >
              Mark Read
            </button>
            <button
              onClick={handleBulkSnooze}
              className="rounded-lg bg-[var(--surface-container-low)] px-3 py-1.5 text-xs font-medium text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            >
              Snooze
            </button>
            <button
              onClick={handleBulkDismiss}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
            >
              Dismiss
            </button>
          </div>
          <button
            onClick={selectAll}
            className="ml-auto text-xs text-[var(--primary)] hover:underline"
          >
            Select All
          </button>
          <button
            onClick={clearSelection}
            className="text-xs text-[var(--outline)] hover:text-[var(--on-surface)]"
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
        <div
          className="flex flex-col items-center justify-center rounded-xl bg-[var(--surface-container-lowest)] py-16"
          style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <Bell className="h-12 w-12 text-[var(--outline)]/30" />
          <h3 className="mt-4 text-sm font-medium text-[var(--on-surface-variant)]">
            No notifications
          </h3>
          <p className="mt-1 text-xs text-[var(--outline)]">
            {filters.type !== 'ALL' || filters.project !== 'ALL' || filters.severity !== 'ALL'
              ? 'Try adjusting your filters'
              : "You're all caught up!"}
          </p>
        </div>
      )}
    </div>
  );
}
