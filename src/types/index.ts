// Re-export Prisma types and add custom types

export type UserRole = 'ADMIN' | 'PMO_LEAD' | 'PROJECT_MANAGER' | 'MEMBER' | 'STAKEHOLDER' | 'VIEWER';
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'AT_RISK' | 'DELAYED' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'COMPLETED' | 'CANCELLED';
export type MilestoneStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'AT_RISK';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskStatus = 'OPEN' | 'MITIGATING' | 'RESOLVED' | 'ACCEPTED';
export type InsightType = 'GAP_ANALYSIS' | 'BUDGET_DRIFT' | 'TIMELINE_RISK' | 'STAGNANT_TASK' | 'RESOURCE_CONFLICT' | 'DEPENDENCY_RISK' | 'MILESTONE_AT_RISK' | 'PORTFOLIO_HEALTH' | 'RECOMMENDATION';
export type NotificationType = 'TASK_OVERDUE' | 'MILESTONE_AT_RISK' | 'BUDGET_ALERT' | 'CHASE_REQUEST' | 'AI_INSIGHT' | 'STATUS_UPDATE_DUE' | 'ESCALATION';
export type ChaseStatus = 'PENDING' | 'RESPONDED' | 'ESCALATED' | 'EXPIRED';
export type RAGStatus = 'RED' | 'AMBER' | 'GREEN';

export interface PortfolioHealthScore {
  overall: number;
  schedule: number;
  budget: number;
  scope: number;
  risk: number;
  team: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: Priority;
  ragStatus: RAGStatus;
  percentComplete: number;
  budgetUtilization: number;
  daysRemaining: number;
  overdueTasks: number;
  nextMilestone?: {
    name: string;
    daysUntil: number;
  };
  hasAIRiskFlag: boolean;
  managerId: string;
  managerName: string;
}

export interface DashboardData {
  healthScore: PortfolioHealthScore;
  projects: ProjectSummary[];
  recentInsights: AIInsightData[];
  budgetSummary: {
    totalAllocated: number;
    totalSpent: number;
    totalForecast: number;
  };
  alerts: AlertData[];
}

export interface AIInsightData {
  id: string;
  type: InsightType;
  severity: Priority;
  title: string;
  summary: string;
  details: string;
  recommendations: string[];
  projectId?: string;
  projectName?: string;
  isPortfolioLevel: boolean;
  acknowledged: boolean;
  createdAt: string;
}

export interface AlertData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: Priority;
  projectId?: string;
  projectName?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface ChaseContext {
  recipientName: string;
  recipientId: string;
  taskId: string;
  taskTitle: string;
  dueDate: string;
  daysSinceActivity: number;
  milestoneName?: string;
  milestoneDueDate?: string;
  previousChaseDate?: string;
  escalationLevel: number;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: {
    metric: 'task_overdue_days' | 'budget_utilization_pct' | 'milestone_days_remaining'
           | 'task_stagnant_days' | 'risk_count_critical' | 'project_rag_status';
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    threshold: number | string;
  };
  recipients: {
    roles: UserRole[];
    specificUsers?: string[];
    escalateTo?: string[];
  };
  channels: ('in_app' | 'email' | 'slack')[];
  escalationWindowHours: number;
  enabled: boolean;
}
