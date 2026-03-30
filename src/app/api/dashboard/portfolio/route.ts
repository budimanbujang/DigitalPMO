import { NextRequest, NextResponse } from 'next/server';
import type { ProjectStatus, Priority, RAGStatus } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockPortfolioData = {
  healthScore: {
    overall: 68,
    schedule: 62,
    budget: 71,
    scope: 75,
    risk: 58,
    team: 70,
  },
  summary: {
    totalProjects: 4,
    activeProjects: 3,
    atRiskProjects: 1,
    completedThisQuarter: 0,
    totalTasks: 168,
    overdueTasks: 11,
    totalTeamMembers: 50,
    overAllocatedMembers: 3,
  },
  budgetSummary: {
    totalAllocated: 5200000,
    totalSpent: 2305000,
    totalCommitted: 450000,
    totalForecast: 5530000,
    forecastVariance: 330000,
    forecastVariancePercent: 6.3,
    currency: 'USD',
  },
  projects: [
    {
      id: 'proj-001',
      name: 'Cloud Migration Phase 2',
      status: 'IN_PROGRESS' as ProjectStatus,
      priority: 'HIGH' as Priority,
      ragStatus: 'AMBER' as RAGStatus,
      percentComplete: 62,
      budgetUtilization: 56.7,
      daysRemaining: 92,
      overdueTasks: 3,
      nextMilestone: { name: 'App Layer Migration', daysUntil: 16 },
      hasAIRiskFlag: true,
      managerId: 'user-001',
      managerName: 'Sarah Chen',
    },
    {
      id: 'proj-002',
      name: 'ERP Integration',
      status: 'AT_RISK' as ProjectStatus,
      priority: 'CRITICAL' as Priority,
      ragStatus: 'RED' as RAGStatus,
      percentComplete: 35,
      budgetUtilization: 44.0,
      daysRemaining: 154,
      overdueTasks: 8,
      nextMilestone: { name: 'Data Migration Wave 1', daysUntil: 12 },
      hasAIRiskFlag: true,
      managerId: 'user-002',
      managerName: 'James Rodriguez',
    },
    {
      id: 'proj-003',
      name: 'Customer Portal Redesign',
      status: 'IN_PROGRESS' as ProjectStatus,
      priority: 'MEDIUM' as Priority,
      ragStatus: 'GREEN' as RAGStatus,
      percentComplete: 78,
      budgetUtilization: 73.3,
      daysRemaining: 31,
      overdueTasks: 0,
      nextMilestone: { name: 'UAT & Launch', daysUntil: 25 },
      hasAIRiskFlag: false,
      managerId: 'user-003',
      managerName: 'Aisha Patel',
    },
    {
      id: 'proj-004',
      name: 'Data Analytics Platform',
      status: 'PLANNING' as ProjectStatus,
      priority: 'HIGH' as Priority,
      ragStatus: 'GREEN' as RAGStatus,
      percentComplete: 5,
      budgetUtilization: 2.8,
      daysRemaining: 276,
      overdueTasks: 0,
      nextMilestone: { name: 'Architecture Sign-off', daysUntil: 15 },
      hasAIRiskFlag: false,
      managerId: 'user-004',
      managerName: 'Tom Nakamura',
    },
  ],
  recentInsights: [
    {
      id: 'ins-001',
      type: 'TIMELINE_RISK',
      severity: 'CRITICAL' as Priority,
      title: 'ERP Integration timeline at critical risk',
      projectName: 'ERP Integration',
      createdAt: '2026-03-29T08:00:00Z',
    },
    {
      id: 'ins-002',
      type: 'BUDGET_DRIFT',
      severity: 'HIGH' as Priority,
      title: 'Portfolio budget forecast exceeds allocation by 6.3%',
      projectName: null,
      createdAt: '2026-03-28T14:00:00Z',
    },
  ],
  alerts: [
    {
      id: 'alert-001',
      type: 'TASK_OVERDUE',
      title: '8 overdue tasks in ERP Integration',
      severity: 'HIGH' as Priority,
      projectName: 'ERP Integration',
      createdAt: '2026-03-30T06:00:00Z',
    },
    {
      id: 'alert-002',
      type: 'MILESTONE_AT_RISK',
      title: 'App Layer Migration milestone at risk',
      severity: 'HIGH' as Priority,
      projectName: 'Cloud Migration Phase 2',
      createdAt: '2026-03-29T18:00:00Z',
    },
  ],
};

// ── GET /api/dashboard/portfolio ──────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with Prisma aggregation queries
    // const [projects, tasks, budgets, insights, alerts] = await Promise.all([
    //   prisma.project.findMany({ where: { status: { not: 'CANCELLED' } }, include: { manager: true } }),
    //   prisma.task.groupBy({ by: ['projectId', 'status'], _count: true }),
    //   prisma.projectBudget.findMany(),
    //   prisma.aiInsight.findMany({ where: { acknowledged: false }, orderBy: { createdAt: 'desc' }, take: 5 }),
    //   prisma.notification.findMany({ where: { dismissed: false }, orderBy: { createdAt: 'desc' }, take: 5 }),
    // ]);

    return NextResponse.json({ data: mockPortfolioData });
  } catch (error) {
    console.error('GET /api/dashboard/portfolio error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch portfolio dashboard data' },
      { status: 500 }
    );
  }
}
