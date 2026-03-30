import { NextRequest, NextResponse } from 'next/server';
import type { InsightType, Priority } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockInsights = [
  {
    id: 'ins-001',
    type: 'TIMELINE_RISK' as InsightType,
    severity: 'CRITICAL' as Priority,
    title: 'ERP Integration timeline at critical risk',
    summary: 'Based on current velocity, the ERP Integration project will miss its August deadline by approximately 6 weeks.',
    details: 'Analysis of task completion rates over the last 4 sprints shows a declining velocity trend. The team completed an average of 12 story points per sprint versus the planned 20. At this rate, the remaining 180 story points would require 15 more sprints (30 weeks) against the planned 10 sprints (20 weeks).',
    recommendations: [
      'Increase team capacity by onboarding 2 additional senior developers',
      'Descope non-critical integrations to Phase 2',
      'Conduct daily standup escalation reviews for blocked items',
    ],
    projectId: 'proj-002',
    projectName: 'ERP Integration',
    isPortfolioLevel: false,
    acknowledged: false,
    createdAt: '2026-03-29T08:00:00Z',
  },
  {
    id: 'ins-002',
    type: 'BUDGET_DRIFT' as InsightType,
    severity: 'HIGH' as Priority,
    title: 'Portfolio budget forecast exceeds allocation by 8.3%',
    summary: 'Aggregated budget forecasts across all active projects show a combined overrun of $312K against total portfolio allocation.',
    details: 'Primary contributors: ERP Integration (+$300K, vendor cost overrun), Cloud Migration (+$50K, extended timeline), offset by Customer Portal (-$20K, under budget) and Data Analytics (-$18K, not yet ramped).',
    recommendations: [
      'Initiate portfolio-level budget review with finance committee',
      'Evaluate ERP Integration scope reduction options',
      'Consider timeline compression for Cloud Migration to reduce burn rate',
    ],
    projectId: null,
    projectName: null,
    isPortfolioLevel: true,
    acknowledged: false,
    createdAt: '2026-03-28T14:00:00Z',
  },
  {
    id: 'ins-003',
    type: 'STAGNANT_TASK' as InsightType,
    severity: 'MEDIUM' as Priority,
    title: '4 tasks stagnant for 10+ days in Cloud Migration',
    summary: 'Database schema migration scripts and 3 related tasks have had no activity updates for over 10 days.',
    details: 'Tasks task-004, task-007, task-008, and task-009 are in BLOCKED or IN_PROGRESS status with no status changes, comments, or hour logging since March 18. These tasks are on the critical path for milestone ms-002 (App Layer Migration, due April 15).',
    recommendations: [
      'Schedule immediate check-in with task assignees',
      'Trigger automated chase sequence for task-004 (highest priority)',
      'Review and resolve blocking dependencies',
    ],
    projectId: 'proj-001',
    projectName: 'Cloud Migration Phase 2',
    isPortfolioLevel: false,
    acknowledged: false,
    createdAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 'ins-004',
    type: 'RESOURCE_CONFLICT' as InsightType,
    severity: 'HIGH' as Priority,
    title: 'Resource over-allocation detected for 3 team members',
    summary: 'Mike Johnson, Priya Sharma, and Alex Wong are each assigned 150%+ capacity across multiple projects.',
    details: 'Cross-project analysis shows these team members are assigned to tasks totaling more than 60 hours per week. This is likely contributing to the velocity decline in both Cloud Migration and ERP Integration projects.',
    recommendations: [
      'Rebalance task assignments across available team members',
      'Defer lower-priority tasks to next sprint',
      'Consider hiring contractors for the April-June peak period',
    ],
    projectId: null,
    projectName: null,
    isPortfolioLevel: true,
    acknowledged: true,
    createdAt: '2026-03-27T09:00:00Z',
  },
  {
    id: 'ins-005',
    type: 'MILESTONE_AT_RISK' as InsightType,
    severity: 'HIGH' as Priority,
    title: 'Customer Portal launch milestone at risk',
    summary: 'The April 30 launch milestone has 7 incomplete tasks with only 31 days remaining. Current completion rate insufficient.',
    details: 'Of the 7 remaining tasks, 3 are in TODO status and have not been started. The remaining 4 are in progress but behind their individual schedules. Historical data shows these task types typically take 2x their estimates.',
    recommendations: [
      'Prioritize the 3 unstarted tasks immediately',
      'Assign additional QA resources for parallel testing',
      'Prepare stakeholder communication about potential 2-week delay',
    ],
    projectId: 'proj-003',
    projectName: 'Customer Portal Redesign',
    isPortfolioLevel: false,
    acknowledged: false,
    createdAt: '2026-03-26T16:00:00Z',
  },
];

// ── GET /api/insights ─────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const type = searchParams.get('type') as InsightType | null;
    const severity = searchParams.get('severity') as Priority | null;
    const portfolioOnly = searchParams.get('portfolioOnly') === 'true';
    const acknowledged = searchParams.get('acknowledged');
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    // TODO: Replace with Prisma query
    // const insights = await prisma.aiInsight.findMany({
    //   where: {
    //     projectId: portfolioOnly ? null : projectId ?? undefined,
    //     type,
    //     severity,
    //     isPortfolioLevel: portfolioOnly || undefined,
    //     acknowledged: acknowledged !== null ? acknowledged === 'true' : undefined,
    //   },
    //   orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    let filtered = [...mockInsights];

    if (projectId) filtered = filtered.filter((i) => i.projectId === projectId);
    if (type) filtered = filtered.filter((i) => i.type === type);
    if (severity) filtered = filtered.filter((i) => i.severity === severity);
    if (portfolioOnly) filtered = filtered.filter((i) => i.isPortfolioLevel);
    if (acknowledged !== null && acknowledged !== undefined) {
      filtered = filtered.filter((i) => i.acknowledged === (acknowledged === 'true'));
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/insights error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
