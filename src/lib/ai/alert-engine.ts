import type { AlertRule, NotificationType, Priority } from '@/types';

// ---------------------------------------------------------------------------
// Default Alert Rules
// ---------------------------------------------------------------------------

export const DEFAULT_ALERT_RULES: AlertRule[] = [
  {
    id: 'rule-task-overdue-3',
    name: 'Task Overdue > 3 Days',
    condition: {
      metric: 'task_overdue_days',
      operator: 'gt',
      threshold: 3,
    },
    recipients: {
      roles: ['PROJECT_MANAGER'],
      escalateTo: ['PMO_LEAD'],
    },
    channels: ['in_app', 'email'],
    escalationWindowHours: 48,
    enabled: true,
  },
  {
    id: 'rule-task-overdue-7',
    name: 'Task Overdue > 7 Days (Critical)',
    condition: {
      metric: 'task_overdue_days',
      operator: 'gt',
      threshold: 7,
    },
    recipients: {
      roles: ['PROJECT_MANAGER', 'PMO_LEAD'],
      escalateTo: ['ADMIN'],
    },
    channels: ['in_app', 'email', 'slack'],
    escalationWindowHours: 24,
    enabled: true,
  },
  {
    id: 'rule-budget-80',
    name: 'Budget Utilization > 80%',
    condition: {
      metric: 'budget_utilization_pct',
      operator: 'gt',
      threshold: 80,
    },
    recipients: {
      roles: ['PROJECT_MANAGER', 'PMO_LEAD'],
    },
    channels: ['in_app', 'email'],
    escalationWindowHours: 72,
    enabled: true,
  },
  {
    id: 'rule-budget-95',
    name: 'Budget Utilization > 95% (Critical)',
    condition: {
      metric: 'budget_utilization_pct',
      operator: 'gt',
      threshold: 95,
    },
    recipients: {
      roles: ['PROJECT_MANAGER', 'PMO_LEAD', 'ADMIN'],
    },
    channels: ['in_app', 'email', 'slack'],
    escalationWindowHours: 24,
    enabled: true,
  },
  {
    id: 'rule-milestone-7',
    name: 'Milestone Due Within 7 Days',
    condition: {
      metric: 'milestone_days_remaining',
      operator: 'lt',
      threshold: 7,
    },
    recipients: {
      roles: ['PROJECT_MANAGER'],
    },
    channels: ['in_app'],
    escalationWindowHours: 168,
    enabled: true,
  },
  {
    id: 'rule-milestone-3',
    name: 'Milestone Due Within 3 Days (Urgent)',
    condition: {
      metric: 'milestone_days_remaining',
      operator: 'lt',
      threshold: 3,
    },
    recipients: {
      roles: ['PROJECT_MANAGER', 'PMO_LEAD'],
      escalateTo: ['ADMIN'],
    },
    channels: ['in_app', 'email'],
    escalationWindowHours: 24,
    enabled: true,
  },
  {
    id: 'rule-stagnant-5',
    name: 'Task Stagnant > 5 Days',
    condition: {
      metric: 'task_stagnant_days',
      operator: 'gt',
      threshold: 5,
    },
    recipients: {
      roles: ['PROJECT_MANAGER'],
    },
    channels: ['in_app'],
    escalationWindowHours: 72,
    enabled: true,
  },
  {
    id: 'rule-stagnant-10',
    name: 'Task Stagnant > 10 Days (Critical)',
    condition: {
      metric: 'task_stagnant_days',
      operator: 'gt',
      threshold: 10,
    },
    recipients: {
      roles: ['PROJECT_MANAGER', 'PMO_LEAD'],
    },
    channels: ['in_app', 'email'],
    escalationWindowHours: 24,
    enabled: true,
  },
  {
    id: 'rule-critical-risks',
    name: 'Critical Risk Count > 2',
    condition: {
      metric: 'risk_count_critical',
      operator: 'gt',
      threshold: 2,
    },
    recipients: {
      roles: ['PROJECT_MANAGER', 'PMO_LEAD'],
      escalateTo: ['ADMIN'],
    },
    channels: ['in_app', 'email'],
    escalationWindowHours: 48,
    enabled: true,
  },
  {
    id: 'rule-rag-red',
    name: 'Project RAG Status is RED',
    condition: {
      metric: 'project_rag_status',
      operator: 'eq',
      threshold: 'RED',
    },
    recipients: {
      roles: ['PMO_LEAD', 'ADMIN'],
    },
    channels: ['in_app', 'email', 'slack'],
    escalationWindowHours: 24,
    enabled: true,
  },
];

// ---------------------------------------------------------------------------
// Metric evaluation helpers
// ---------------------------------------------------------------------------

interface MetricValues {
  task_overdue_days?: number;
  budget_utilization_pct?: number;
  milestone_days_remaining?: number;
  task_stagnant_days?: number;
  risk_count_critical?: number;
  project_rag_status?: string;
}

function evaluateCondition(
  condition: AlertRule['condition'],
  metrics: MetricValues
): boolean {
  const value = metrics[condition.metric];
  if (value === undefined) return false;

  const threshold = condition.threshold;

  switch (condition.operator) {
    case 'gt':
      return typeof value === 'number' && typeof threshold === 'number' && value > threshold;
    case 'lt':
      return typeof value === 'number' && typeof threshold === 'number' && value < threshold;
    case 'gte':
      return typeof value === 'number' && typeof threshold === 'number' && value >= threshold;
    case 'lte':
      return typeof value === 'number' && typeof threshold === 'number' && value <= threshold;
    case 'eq':
      return String(value) === String(threshold);
    default:
      return false;
  }
}

function getSeverityForRule(rule: AlertRule): Priority {
  const { metric, threshold } = rule.condition;

  if (metric === 'project_rag_status' && threshold === 'RED') return 'CRITICAL';
  if (metric === 'risk_count_critical') return 'HIGH';
  if (metric === 'budget_utilization_pct' && typeof threshold === 'number' && threshold >= 95) return 'CRITICAL';
  if (metric === 'budget_utilization_pct') return 'HIGH';
  if (metric === 'task_overdue_days' && typeof threshold === 'number' && threshold >= 7) return 'HIGH';
  if (metric === 'milestone_days_remaining' && typeof threshold === 'number' && threshold <= 3) return 'HIGH';

  return 'MEDIUM';
}

function getNotificationType(metric: string): NotificationType {
  switch (metric) {
    case 'task_overdue_days':
      return 'TASK_OVERDUE';
    case 'budget_utilization_pct':
      return 'BUDGET_ALERT';
    case 'milestone_days_remaining':
      return 'MILESTONE_AT_RISK';
    case 'task_stagnant_days':
      return 'STATUS_UPDATE_DUE';
    case 'risk_count_critical':
      return 'AI_INSIGHT';
    case 'project_rag_status':
      return 'ESCALATION';
    default:
      return 'AI_INSIGHT';
  }
}

// ---------------------------------------------------------------------------
// Evaluate alert rules against metrics
// ---------------------------------------------------------------------------

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: Priority;
  projectId?: string;
  projectName?: string;
  ruleId: string;
  channels: ('in_app' | 'email' | 'slack')[];
  recipientRoles: string[];
  createdAt: string;
}

export function evaluateAlertRules(
  rules: AlertRule[],
  metrics: MetricValues,
  projectContext?: { id: string; name: string }
): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date().toISOString();

  for (const rule of rules) {
    if (!rule.enabled) continue;
    if (!evaluateCondition(rule.condition, metrics)) continue;

    const severity = getSeverityForRule(rule);
    const metricValue = metrics[rule.condition.metric];

    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: getNotificationType(rule.condition.metric),
      title: rule.name,
      message: buildAlertMessage(rule, metricValue, projectContext?.name),
      severity,
      projectId: projectContext?.id,
      projectName: projectContext?.name,
      ruleId: rule.id,
      channels: rule.channels,
      recipientRoles: rule.recipients.roles,
      createdAt: now,
    });
  }

  return notifications;
}

function buildAlertMessage(
  rule: AlertRule,
  value: string | number | undefined,
  projectName?: string
): string {
  const project = projectName ? ` in ${projectName}` : '';

  switch (rule.condition.metric) {
    case 'task_overdue_days':
      return `A task${project} is ${value} days overdue (threshold: ${rule.condition.threshold} days). Immediate attention required.`;
    case 'budget_utilization_pct':
      return `Budget utilization${project} has reached ${value}% (threshold: ${rule.condition.threshold}%). Review spending and forecast.`;
    case 'milestone_days_remaining':
      return `A milestone${project} is due in ${value} days (threshold: ${rule.condition.threshold} days). Ensure all blocking tasks are on track.`;
    case 'task_stagnant_days':
      return `A task${project} has had no activity for ${value} days (threshold: ${rule.condition.threshold} days). Follow up with assignee.`;
    case 'risk_count_critical':
      return `${value} critical risks detected${project} (threshold: ${rule.condition.threshold}). Risk review recommended.`;
    case 'project_rag_status':
      return `Project${project} RAG status is ${value}. Escalation triggered per alert rules.`;
    default:
      return `Alert rule "${rule.name}" triggered${project}. Value: ${value}, Threshold: ${rule.condition.threshold}.`;
  }
}

// ---------------------------------------------------------------------------
// Create notification helper
// ---------------------------------------------------------------------------

export function createNotification(params: {
  type: NotificationType;
  title: string;
  message: string;
  severity: Priority;
  projectId?: string;
  projectName?: string;
  channels?: ('in_app' | 'email' | 'slack')[];
}): Notification {
  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: params.type,
    title: params.title,
    message: params.message,
    severity: params.severity,
    projectId: params.projectId,
    projectName: params.projectName,
    ruleId: 'manual',
    channels: params.channels ?? ['in_app'],
    recipientRoles: [],
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Escalation Check
// ---------------------------------------------------------------------------

/**
 * Determines whether a notification should be escalated based on how long
 * ago it was created relative to the rule's escalation window.
 */
export function checkEscalation(
  notificationId: string,
  notifications: Notification[] = []
): boolean {
  const notification = notifications.find((n) => n.id === notificationId);
  if (!notification) return false;

  const rule = DEFAULT_ALERT_RULES.find((r) => r.id === notification.ruleId);
  if (!rule) return false;

  const created = new Date(notification.createdAt);
  const now = new Date();
  const hoursSinceCreation =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  return hoursSinceCreation >= rule.escalationWindowHours;
}
