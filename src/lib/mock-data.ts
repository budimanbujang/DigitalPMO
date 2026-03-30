// Mock data for the Portfolio Dashboard

export type RAGStatus = 'RED' | 'AMBER' | 'GREEN';
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'AT_RISK';
export type InsightSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type InsightType = 'RISK' | 'BUDGET' | 'SCHEDULE' | 'RESOURCE' | 'SCOPE' | 'QUALITY';
export type AlertType = 'OVERDUE' | 'BUDGET' | 'MILESTONE' | 'RISK' | 'APPROVAL';

export interface HeatmapScores {
  schedule: RAGStatus;
  budget: RAGStatus;
  scope: RAGStatus;
  risk: RAGStatus;
  team: RAGStatus;
}

export interface Milestone {
  name: string;
  dueDate: string;
  daysRemaining: number;
}

export interface MockProject {
  id: string;
  name: string;
  code: string;
  ragStatus: RAGStatus;
  status: ProjectStatus;
  percentComplete: number;
  budgetAllocated: number;
  budgetSpent: number;
  budgetForecast: number;
  nextMilestone: Milestone;
  overdueTasks: number;
  totalTasks: number;
  completedTasks: number;
  aiFlagged: boolean;
  heatmap: HeatmapScores;
  owner: string;
  startDate: string;
  endDate: string;
}

export interface AIInsight {
  id: string;
  projectId: string;
  projectName: string;
  severity: InsightSeverity;
  type: InsightType;
  title: string;
  summary: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface DashboardAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  projectId?: string;
  projectName?: string;
  timestamp: string;
  actionLabel?: string;
  actionHref?: string;
  dismissed: boolean;
}

export interface PortfolioHealthBreakdown {
  schedule: number;
  budget: number;
  scope: number;
  risk: number;
  team: number;
}

export interface BudgetDataPoint {
  name: string;
  allocated: number;
  spent: number;
  forecast: number;
}

// --- Portfolio Health ---

export const portfolioHealthScore = 72;

export const portfolioHealthBreakdown: PortfolioHealthBreakdown = {
  schedule: 68,
  budget: 75,
  scope: 80,
  risk: 62,
  team: 77,
};

// --- Projects ---

export const mockProjects: MockProject[] = [
  {
    id: 'proj-001',
    name: 'MyDigital Portal',
    code: 'MDP',
    ragStatus: 'GREEN',
    status: 'ACTIVE',
    percentComplete: 73,
    budgetAllocated: 4_500_000,
    budgetSpent: 3_100_000,
    budgetForecast: 4_200_000,
    nextMilestone: { name: 'UAT Sign-off', dueDate: '2026-04-18', daysRemaining: 19 },
    overdueTasks: 0,
    totalTasks: 124,
    completedTasks: 91,
    aiFlagged: false,
    heatmap: { schedule: 'GREEN', budget: 'GREEN', scope: 'GREEN', risk: 'GREEN', team: 'GREEN' },
    owner: 'Dato\u2019 Ahmad Razif',
    startDate: '2025-06-01',
    endDate: '2026-09-30',
  },
  {
    id: 'proj-002',
    name: 'JCorp ERP Migration',
    code: 'JEM',
    ragStatus: 'AMBER',
    status: 'ACTIVE',
    percentComplete: 45,
    budgetAllocated: 8_200_000,
    budgetSpent: 4_800_000,
    budgetForecast: 9_100_000,
    nextMilestone: { name: 'Data Migration Wave 2', dueDate: '2026-04-08', daysRemaining: 9 },
    overdueTasks: 4,
    totalTasks: 210,
    completedTasks: 95,
    aiFlagged: true,
    heatmap: { schedule: 'AMBER', budget: 'RED', scope: 'AMBER', risk: 'AMBER', team: 'GREEN' },
    owner: 'Puan Siti Nurhaliza',
    startDate: '2025-03-15',
    endDate: '2026-12-31',
  },
  {
    id: 'proj-003',
    name: 'Iskandar Smart City Hub',
    code: 'ISC',
    ragStatus: 'RED',
    status: 'AT_RISK',
    percentComplete: 28,
    budgetAllocated: 12_000_000,
    budgetSpent: 5_600_000,
    budgetForecast: 14_500_000,
    nextMilestone: { name: 'IoT Platform Integration', dueDate: '2026-04-02', daysRemaining: 3 },
    overdueTasks: 11,
    totalTasks: 340,
    completedTasks: 96,
    aiFlagged: true,
    heatmap: { schedule: 'RED', budget: 'RED', scope: 'AMBER', risk: 'RED', team: 'AMBER' },
    owner: 'Encik Mohd Faizal',
    startDate: '2025-01-10',
    endDate: '2027-06-30',
  },
  {
    id: 'proj-004',
    name: 'HR Transformation',
    code: 'HRT',
    ragStatus: 'GREEN',
    status: 'ACTIVE',
    percentComplete: 61,
    budgetAllocated: 2_800_000,
    budgetSpent: 1_600_000,
    budgetForecast: 2_700_000,
    nextMilestone: { name: 'Performance Module Go-Live', dueDate: '2026-04-25', daysRemaining: 26 },
    overdueTasks: 1,
    totalTasks: 89,
    completedTasks: 54,
    aiFlagged: false,
    heatmap: { schedule: 'GREEN', budget: 'GREEN', scope: 'GREEN', risk: 'AMBER', team: 'GREEN' },
    owner: 'Puan Farah Diyana',
    startDate: '2025-08-01',
    endDate: '2026-07-31',
  },
  {
    id: 'proj-005',
    name: 'Cybersecurity Uplift',
    code: 'CSU',
    ragStatus: 'AMBER',
    status: 'ACTIVE',
    percentComplete: 52,
    budgetAllocated: 3_500_000,
    budgetSpent: 2_100_000,
    budgetForecast: 3_800_000,
    nextMilestone: { name: 'SOC Deployment Phase 1', dueDate: '2026-04-12', daysRemaining: 13 },
    overdueTasks: 3,
    totalTasks: 156,
    completedTasks: 81,
    aiFlagged: true,
    heatmap: { schedule: 'AMBER', budget: 'AMBER', scope: 'GREEN', risk: 'AMBER', team: 'RED' },
    owner: 'Encik Tan Wei Ming',
    startDate: '2025-05-01',
    endDate: '2026-10-31',
  },
  {
    id: 'proj-006',
    name: 'Data Lake Initiative',
    code: 'DLI',
    ragStatus: 'GREEN',
    status: 'COMPLETED',
    percentComplete: 100,
    budgetAllocated: 5_000_000,
    budgetSpent: 4_750_000,
    budgetForecast: 4_750_000,
    nextMilestone: { name: 'Project Closure', dueDate: '2026-03-28', daysRemaining: -2 },
    overdueTasks: 0,
    totalTasks: 198,
    completedTasks: 198,
    aiFlagged: false,
    heatmap: { schedule: 'GREEN', budget: 'GREEN', scope: 'GREEN', risk: 'GREEN', team: 'GREEN' },
    owner: 'Dr. Lee Chong Wei',
    startDate: '2024-11-01',
    endDate: '2026-03-28',
  },
];

// --- AI Insights ---

export const mockInsights: AIInsight[] = [
  {
    id: 'ins-001',
    projectId: 'proj-003',
    projectName: 'Iskandar Smart City Hub',
    severity: 'CRITICAL',
    type: 'SCHEDULE',
    title: 'IoT Integration at risk of missing deadline',
    summary: 'Based on current velocity, the IoT Platform Integration milestone (due in 3 days) has only 62% of prerequisite tasks completed. Recommend immediate resource reallocation.',
    timestamp: '2026-03-30T08:15:00Z',
    acknowledged: false,
  },
  {
    id: 'ins-002',
    projectId: 'proj-002',
    projectName: 'JCorp ERP Migration',
    severity: 'HIGH',
    type: 'BUDGET',
    title: 'Budget forecast exceeds allocation by 11%',
    summary: 'Current spend trajectory projects RM 9.1M against RM 8.2M allocation. Primary overrun in data migration consultancy costs. Consider scope renegotiation.',
    timestamp: '2026-03-30T07:30:00Z',
    acknowledged: false,
  },
  {
    id: 'ins-003',
    projectId: 'proj-005',
    projectName: 'Cybersecurity Uplift',
    severity: 'HIGH',
    type: 'RESOURCE',
    title: 'Critical staffing gap in SOC team',
    summary: 'SOC Phase 1 requires 5 certified analysts but only 3 are onboarded. Recruitment pipeline shows 6-8 week lead time which conflicts with the April 12 deployment.',
    timestamp: '2026-03-29T16:45:00Z',
    acknowledged: false,
  },
  {
    id: 'ins-004',
    projectId: 'proj-003',
    projectName: 'Iskandar Smart City Hub',
    severity: 'CRITICAL',
    type: 'RISK',
    title: 'Vendor dependency creating single point of failure',
    summary: 'SensorTech Sdn Bhd is sole vendor for 3 critical IoT subsystems. Their recent financial disclosure shows declining revenue. Recommend contingency vendor assessment.',
    timestamp: '2026-03-29T14:20:00Z',
    acknowledged: false,
  },
  {
    id: 'ins-005',
    projectId: 'proj-001',
    projectName: 'MyDigital Portal',
    severity: 'MEDIUM',
    type: 'QUALITY',
    title: 'Test coverage below threshold',
    summary: 'Automated test coverage has dropped to 64% from the 80% target. Recent sprint commits in the authentication module have no corresponding test cases.',
    timestamp: '2026-03-29T11:00:00Z',
    acknowledged: true,
  },
  {
    id: 'ins-006',
    projectId: 'proj-004',
    projectName: 'HR Transformation',
    severity: 'LOW',
    type: 'SCOPE',
    title: 'Feature request backlog growing',
    summary: 'Unplanned feature requests have increased by 40% this sprint. While none are critical, the accumulation may affect the Performance Module timeline if not triaged.',
    timestamp: '2026-03-28T09:30:00Z',
    acknowledged: true,
  },
  {
    id: 'ins-007',
    projectId: 'proj-002',
    projectName: 'JCorp ERP Migration',
    severity: 'MEDIUM',
    type: 'SCHEDULE',
    title: 'Data cleansing tasks taking 2x estimated effort',
    summary: 'Historical data quality in the legacy HR module is worse than assessed. Data cleansing tasks are averaging 14 hours vs 7 hours estimated.',
    timestamp: '2026-03-28T08:15:00Z',
    acknowledged: false,
  },
  {
    id: 'ins-008',
    projectId: 'proj-005',
    projectName: 'Cybersecurity Uplift',
    severity: 'MEDIUM',
    type: 'RISK',
    title: 'New zero-day affects planned SIEM platform',
    summary: 'CVE-2026-1847 affects the selected SIEM platform. Vendor patch expected in 2 weeks. Recommend delaying SIEM configuration until patch is validated.',
    timestamp: '2026-03-27T15:00:00Z',
    acknowledged: false,
  },
];

// --- Alerts ---

export const mockAlerts: DashboardAlert[] = [
  {
    id: 'alert-001',
    type: 'OVERDUE',
    title: '11 overdue tasks',
    message: 'Iskandar Smart City Hub has 11 tasks past their due date, up from 7 last week.',
    projectId: 'proj-003',
    projectName: 'Iskandar Smart City Hub',
    timestamp: '2026-03-30T08:00:00Z',
    actionLabel: 'View Tasks',
    actionHref: '/projects/proj-003/tasks',
    dismissed: false,
  },
  {
    id: 'alert-002',
    type: 'BUDGET',
    title: 'Budget threshold exceeded',
    message: 'JCorp ERP Migration has spent 58.5% of budget with only 45% completion. Forecast overrun of RM 900K.',
    projectId: 'proj-002',
    projectName: 'JCorp ERP Migration',
    timestamp: '2026-03-30T07:00:00Z',
    actionLabel: 'Review Budget',
    actionHref: '/projects/proj-002/budget',
    dismissed: false,
  },
  {
    id: 'alert-003',
    type: 'MILESTONE',
    title: 'Milestone at risk',
    message: 'IoT Platform Integration due in 3 days with significant incomplete dependencies.',
    projectId: 'proj-003',
    projectName: 'Iskandar Smart City Hub',
    timestamp: '2026-03-29T18:00:00Z',
    actionLabel: 'View Milestone',
    actionHref: '/projects/proj-003/milestones',
    dismissed: false,
  },
  {
    id: 'alert-004',
    type: 'RISK',
    title: 'Vendor risk escalated',
    message: 'SensorTech vendor risk has been auto-escalated to HIGH based on financial analysis.',
    projectId: 'proj-003',
    projectName: 'Iskandar Smart City Hub',
    timestamp: '2026-03-29T14:30:00Z',
    actionLabel: 'View Risk',
    actionHref: '/projects/proj-003/risks',
    dismissed: false,
  },
  {
    id: 'alert-005',
    type: 'APPROVAL',
    title: 'Change request pending',
    message: 'CR-042: Additional data migration scope for JCorp ERP requires PMO approval. Submitted 3 days ago.',
    projectId: 'proj-002',
    projectName: 'JCorp ERP Migration',
    timestamp: '2026-03-27T10:00:00Z',
    actionLabel: 'Review CR',
    actionHref: '/projects/proj-002/changes',
    dismissed: false,
  },
];

// --- Budget Chart Data ---

export const budgetChartData: BudgetDataPoint[] = mockProjects
  .filter((p) => p.status !== 'COMPLETED')
  .map((p) => ({
    name: p.code,
    allocated: p.budgetAllocated,
    spent: p.budgetSpent,
    forecast: Math.max(0, p.budgetForecast - p.budgetSpent),
  }));

export const portfolioBudgetSummary = {
  totalAllocated: mockProjects.reduce((sum, p) => sum + p.budgetAllocated, 0),
  totalSpent: mockProjects.reduce((sum, p) => sum + p.budgetSpent, 0),
  totalForecast: mockProjects.reduce((sum, p) => sum + p.budgetForecast, 0),
};

// --- Helper: convert RAG status to numeric score for heatmap ---

export function ragToScore(rag: RAGStatus): number {
  switch (rag) {
    case 'GREEN': return 85;
    case 'AMBER': return 55;
    case 'RED': return 25;
  }
}
