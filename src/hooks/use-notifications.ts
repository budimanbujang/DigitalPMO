'use client';

import { useState, useMemo, useCallback } from 'react';
import type { NotificationType, Priority } from '@/types';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: Priority;
  projectId?: string;
  projectName?: string;
  actionUrl?: string;
  read: boolean;
  snoozed: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 7)}w ago`;
}

function getGroup(dateStr: string): 'today' | 'this_week' | 'earlier' {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDay === 0) return 'today';
  if (diffDay < 7) return 'this_week';
  return 'earlier';
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'ntf-001',
    type: 'TASK_OVERDUE',
    title: 'Task overdue: API Gateway Integration',
    message: 'Task assigned to Farid has been overdue for 3 days. No updates since last week.',
    severity: 'HIGH',
    projectId: 'prj-001',
    projectName: 'MyDigital ID Platform',
    actionUrl: '/projects/prj-001',
    read: false,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'ntf-002',
    type: 'AI_INSIGHT',
    title: 'Budget drift detected',
    message: 'AI analysis shows PDPA Compliance System is trending 12% over budget based on current burn rate.',
    severity: 'HIGH',
    projectId: 'prj-002',
    projectName: 'PDPA Compliance System',
    actionUrl: '/projects/prj-002',
    read: false,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'ntf-003',
    type: 'MILESTONE_AT_RISK',
    title: 'Milestone at risk: UAT Phase 1',
    message: 'UAT Phase 1 is due in 5 days but only 62% of prerequisite tasks are completed.',
    severity: 'CRITICAL',
    projectId: 'prj-001',
    projectName: 'MyDigital ID Platform',
    actionUrl: '/projects/prj-001',
    read: false,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'ntf-004',
    type: 'CHASE_REQUEST',
    title: 'Chase sent to Kavitha',
    message: 'Automated chase email sent regarding overdue deliverable: Security Audit Report.',
    severity: 'MEDIUM',
    projectId: 'prj-002',
    projectName: 'PDPA Compliance System',
    actionUrl: '/projects/prj-002',
    read: false,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'ntf-005',
    type: 'STATUS_UPDATE_DUE',
    title: 'Weekly status update due',
    message: 'E-Perolehan Upgrade project status update is due today. Last update was 8 days ago.',
    severity: 'MEDIUM',
    projectId: 'prj-003',
    projectName: 'E-Perolehan Upgrade',
    actionUrl: '/projects/prj-003',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'ntf-006',
    type: 'BUDGET_ALERT',
    title: 'Budget threshold exceeded',
    message: 'MyDigital ID Platform has exceeded 85% of allocated budget with 40% work remaining.',
    severity: 'HIGH',
    projectId: 'prj-001',
    projectName: 'MyDigital ID Platform',
    actionUrl: '/projects/prj-001',
    read: false,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'ntf-007',
    type: 'AI_INSIGHT',
    title: 'Resource conflict detected',
    message: 'Hafiz is assigned to 3 critical-path tasks across 2 projects with overlapping deadlines.',
    severity: 'HIGH',
    projectId: undefined,
    projectName: undefined,
    actionUrl: '/people',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'ntf-008',
    type: 'ESCALATION',
    title: 'Escalation: No response from vendor',
    message: 'Chase to CloudTech Solutions for server provisioning has been escalated after 48 hours of no response.',
    severity: 'CRITICAL',
    projectId: 'prj-003',
    projectName: 'E-Perolehan Upgrade',
    actionUrl: '/projects/prj-003',
    read: false,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'ntf-009',
    type: 'TASK_OVERDUE',
    title: 'Task overdue: Database Migration Script',
    message: 'Task assigned to Arjun is overdue by 2 days. Blocking downstream integration tasks.',
    severity: 'HIGH',
    projectId: 'prj-003',
    projectName: 'E-Perolehan Upgrade',
    actionUrl: '/projects/prj-003',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: 'ntf-010',
    type: 'CHASE_REQUEST',
    title: 'Chase sent to Siti',
    message: 'Reminder sent for pending approval on UI/UX design mockups.',
    severity: 'LOW',
    projectId: 'prj-001',
    projectName: 'MyDigital ID Platform',
    actionUrl: '/projects/prj-001',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'ntf-011',
    type: 'AI_INSIGHT',
    title: 'Stagnant task detected',
    message: 'Task "Compliance Documentation" in PDPA project has had no activity for 14 days.',
    severity: 'MEDIUM',
    projectId: 'prj-002',
    projectName: 'PDPA Compliance System',
    actionUrl: '/projects/prj-002',
    read: false,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'ntf-012',
    type: 'STATUS_UPDATE_DUE',
    title: 'Monthly report due',
    message: 'Portfolio-level monthly report is due in 2 days. 2 of 5 project updates are still pending.',
    severity: 'MEDIUM',
    projectId: undefined,
    projectName: undefined,
    actionUrl: '/dashboard',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: 'ntf-013',
    type: 'MILESTONE_AT_RISK',
    title: 'Milestone delayed: Go-Live Readiness',
    message: 'E-Perolehan Upgrade go-live milestone has been pushed back by 2 weeks due to pending vendor deliverables.',
    severity: 'CRITICAL',
    projectId: 'prj-003',
    projectName: 'E-Perolehan Upgrade',
    actionUrl: '/projects/prj-003',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: 'ntf-014',
    type: 'BUDGET_ALERT',
    title: 'Budget forecast updated',
    message: 'AI revised budget forecast for PDPA Compliance System. New EAC: RM 2.8M (was RM 2.5M).',
    severity: 'HIGH',
    projectId: 'prj-002',
    projectName: 'PDPA Compliance System',
    actionUrl: '/projects/prj-002',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
  },
  {
    id: 'ntf-015',
    type: 'ESCALATION',
    title: 'Escalation resolved: Siti responded',
    message: 'Previous escalation regarding UI/UX approvals has been resolved. Siti approved mockups.',
    severity: 'LOW',
    projectId: 'prj-001',
    projectName: 'MyDigital ID Platform',
    actionUrl: '/projects/prj-001',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(),
  },
  {
    id: 'ntf-016',
    type: 'AI_INSIGHT',
    title: 'Portfolio health improved',
    message: 'Overall portfolio health score improved from 64 to 72 this week. Schedule adherence up 8%.',
    severity: 'LOW',
    projectId: undefined,
    projectName: undefined,
    actionUrl: '/dashboard',
    read: true,
    snoozed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
  },
];

export interface NotificationFilters {
  type: NotificationType | 'ALL';
  project: string;
  severity: Priority | 'ALL';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filters, setFilters] = useState<NotificationFilters>({
    type: 'ALL',
    project: 'ALL',
    severity: 'ALL',
  });

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (n.snoozed) return false;
      if (filters.type !== 'ALL' && n.type !== filters.type) return false;
      if (filters.project !== 'ALL' && n.projectName !== filters.project) return false;
      if (filters.severity !== 'ALL' && n.severity !== filters.severity) return false;
      return true;
    });
  }, [notifications, filters]);

  const grouped = useMemo(() => {
    const groups: Record<'today' | 'this_week' | 'earlier', Notification[]> = {
      today: [],
      this_week: [],
      earlier: [],
    };
    for (const n of filtered) {
      groups[getGroup(n.createdAt)].push(n);
    }
    return groups;
  }, [filtered]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read && !n.snoozed).length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const snooze = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, snoozed: true } : n))
    );
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const bulkMarkRead = useCallback((ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n))
    );
  }, []);

  const bulkSnooze = useCallback((ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, snoozed: true } : n))
    );
  }, []);

  const bulkDismiss = useCallback((ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
  }, []);

  const latestUnread = useMemo(() => {
    return notifications.filter((n) => !n.read && !n.snoozed).slice(0, 5);
  }, [notifications]);

  return {
    notifications: filtered,
    grouped,
    unreadCount,
    latestUnread,
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
  };
}
