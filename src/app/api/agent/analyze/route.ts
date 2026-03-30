import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { InsightType, Priority } from '@/types';

// ── PMO Agent System Prompt ───────────────────────────────────────────
const PMO_AGENT_SYSTEM_PROMPT = `You are the PMO AI Agent for JCorp's Agentic Digital PMO platform. Your role is to continuously analyze project portfolio data and generate actionable insights for PMO leadership.

## Your Responsibilities:
1. **Gap Analysis**: Identify gaps between planned and actual progress across schedule, budget, scope, and resources.
2. **Risk Detection**: Proactively identify emerging risks by analyzing trends in task completion rates, budget burn, team velocity, and external dependencies.
3. **Budget Monitoring**: Track budget utilization, forecast overruns, and flag projects exceeding threshold variances.
4. **Timeline Assessment**: Evaluate milestone achievability based on current velocity and dependency chains.
5. **Resource Optimization**: Detect over-allocation, under-utilization, and skill gaps across the portfolio.
6. **Stagnation Detection**: Flag tasks, decisions, or approvals that have been inactive beyond acceptable thresholds.
7. **Dependency Risk**: Identify cross-project dependencies that could cascade delays.
8. **Portfolio Health**: Generate portfolio-level health assessments and trend analysis.

## Output Format:
For each insight, provide:
- **type**: One of: GAP_ANALYSIS, BUDGET_DRIFT, TIMELINE_RISK, STAGNANT_TASK, RESOURCE_CONFLICT, DEPENDENCY_RISK, MILESTONE_AT_RISK, PORTFOLIO_HEALTH, RECOMMENDATION
- **severity**: CRITICAL, HIGH, MEDIUM, or LOW
- **title**: Concise headline (under 80 chars)
- **summary**: 1-2 sentence executive summary
- **details**: Detailed analysis with supporting data points
- **recommendations**: Array of 2-4 specific, actionable recommendations
- **projectId**: The project ID this insight relates to (null for portfolio-level)
- **isPortfolioLevel**: true if this is a cross-project or portfolio-wide insight

## Analysis Guidelines:
- Be specific with numbers and dates, not vague
- Reference actual project/task/milestone names and IDs
- Prioritize insights by business impact, not just technical severity
- Provide recommendations that are actionable within the PMO's authority
- Flag items requiring escalation to steering committee
- Consider Malaysian business context (JCorp is Johor Corporation)

Respond with a JSON array of insight objects.`;

// ── Types ─────────────────────────────────────────────────────────────
interface AnalyzeRequestBody {
  scope: 'project' | 'portfolio';
  projectId?: string;
  focusAreas?: InsightType[];
}

interface GeneratedInsight {
  type: InsightType;
  severity: Priority;
  title: string;
  summary: string;
  details: string;
  recommendations: string[];
  projectId: string | null;
  isPortfolioLevel: boolean;
}

// ── Mock portfolio context for the agent ──────────────────────────────
function buildAnalysisContext(scope: string, projectId?: string): string {
  // TODO: Replace with actual Prisma queries to build context
  // const projects = await prisma.project.findMany({
  //   include: { tasks: true, milestones: true, risks: true, budget: true },
  //   where: projectId ? { id: projectId } : undefined,
  // });

  if (scope === 'project' && projectId) {
    return JSON.stringify({
      project: {
        id: projectId,
        name: 'Cloud Migration Phase 2',
        status: 'IN_PROGRESS',
        percentComplete: 62,
        budget: { allocated: 1200000, spent: 680000, forecast: 1150000 },
        timeline: { start: '2025-11-01', end: '2026-06-30', daysRemaining: 92 },
        tasks: { total: 48, completed: 28, overdue: 3, blocked: 2 },
        milestones: [
          { name: 'Database Migration', status: 'COMPLETED', dueDate: '2026-02-28' },
          { name: 'App Layer Migration', status: 'IN_PROGRESS', dueDate: '2026-04-15', completionPct: 44 },
          { name: 'Monitoring & Cutover', status: 'NOT_STARTED', dueDate: '2026-06-15' },
        ],
        risks: [
          { title: 'Vendor delay on licensing', level: 'HIGH', status: 'OPEN' },
          { title: 'Data integrity during migration', level: 'MEDIUM', status: 'MITIGATING' },
        ],
        teamVelocity: { current: 14, planned: 18, trend: 'declining' },
      },
    });
  }

  return JSON.stringify({
    portfolio: {
      totalProjects: 4,
      activeProjects: 3,
      totalBudget: { allocated: 5200000, spent: 2305000, forecast: 5530000 },
      overallHealth: 68,
      projects: [
        { id: 'proj-001', name: 'Cloud Migration Phase 2', rag: 'AMBER', pctComplete: 62, overdueTasks: 3 },
        { id: 'proj-002', name: 'ERP Integration', rag: 'RED', pctComplete: 35, overdueTasks: 8 },
        { id: 'proj-003', name: 'Customer Portal Redesign', rag: 'GREEN', pctComplete: 78, overdueTasks: 0 },
        { id: 'proj-004', name: 'Data Analytics Platform', rag: 'GREEN', pctComplete: 5, overdueTasks: 0 },
      ],
      resourceUtilization: {
        overAllocated: 3,
        underUtilized: 2,
        totalTeamMembers: 50,
      },
    },
  });
}

// ── POST /api/agent/analyze ───────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequestBody = await request.json();

    if (!body.scope || !['project', 'portfolio'].includes(body.scope)) {
      return NextResponse.json(
        { data: null, error: 'Invalid scope. Must be "project" or "portfolio"' },
        { status: 400 }
      );
    }

    if (body.scope === 'project' && !body.projectId) {
      return NextResponse.json(
        { data: null, error: 'projectId is required when scope is "project"' },
        { status: 400 }
      );
    }

    const context = buildAnalysisContext(body.scope, body.projectId);

    // Log the analysis run
    const analysisLogId = `analysis-${Date.now()}`;
    const startTime = Date.now();

    // TODO: Check for ANTHROPIC_API_KEY and use real Claude API
    // const anthropic = new Anthropic();
    // const response = await anthropic.messages.create({
    //   model: 'claude-sonnet-4-20250514',
    //   max_tokens: 4096,
    //   system: PMO_AGENT_SYSTEM_PROMPT,
    //   messages: [
    //     {
    //       role: 'user',
    //       content: `Analyze the following ${body.scope} data and generate insights:\n\n${context}\n\n${
    //         body.focusAreas?.length
    //           ? `Focus especially on these areas: ${body.focusAreas.join(', ')}`
    //           : 'Provide a comprehensive analysis across all areas.'
    //       }`,
    //     },
    //   ],
    // });
    // const insightsText = response.content[0].type === 'text' ? response.content[0].text : '';
    // const insights: GeneratedInsight[] = JSON.parse(insightsText);

    // Mock response simulating what Claude would generate
    const mockGeneratedInsights: GeneratedInsight[] = body.scope === 'portfolio'
      ? [
          {
            type: 'BUDGET_DRIFT',
            severity: 'HIGH',
            title: 'Portfolio budget forecast exceeds allocation by 6.3%',
            summary: 'Combined project forecasts show a $330K overrun against total portfolio allocation of $5.2M.',
            details: 'ERP Integration is the primary contributor with a $300K forecast overrun driven by vendor cost increases. Cloud Migration adds $50K due to extended timeline. Customer Portal offsets partially at -$20K under budget.',
            recommendations: [
              'Convene portfolio budget review with finance by April 5',
              'Evaluate ERP scope reduction to absorb $200K of the overrun',
              'Request contingency release for remaining $130K from portfolio reserve',
            ],
            projectId: null,
            isPortfolioLevel: true,
          },
          {
            type: 'RESOURCE_CONFLICT',
            severity: 'HIGH',
            title: '3 team members allocated at 150%+ capacity',
            summary: 'Cross-project analysis identifies critical over-allocation that is likely degrading velocity across Cloud Migration and ERP Integration.',
            details: 'Mike Johnson (165%), Priya Sharma (155%), and Alex Wong (150%) are assigned to concurrent tasks across multiple projects. This correlates with the declining velocity trends observed in both Cloud Migration and ERP Integration over the past 3 sprints.',
            recommendations: [
              'Rebalance assignments: move 2 non-critical ERP tasks to available team members',
              'Defer lower-priority Cloud Migration monitoring tasks by 2 weeks',
              'Engage 2 contract developers for the April-June peak period',
            ],
            projectId: null,
            isPortfolioLevel: true,
          },
        ]
      : [
          {
            type: 'TIMELINE_RISK',
            severity: 'HIGH',
            title: 'App Layer Migration milestone at risk of 2-week delay',
            summary: 'Current velocity of 14 points/sprint against planned 18 puts the April 15 milestone at risk.',
            details: 'With 10 tasks remaining and current completion rate, the milestone is projected to complete around April 28-30. The auth service migration (task-002) is the critical bottleneck, requiring Cognito custom attribute handling not in original estimates.',
            recommendations: [
              'Assign additional developer to auth service migration immediately',
              'Negotiate April 15 milestone extension to April 22 with stakeholders',
              'Parallelize independent monitoring tasks to recover 1 week',
              'Escalate vendor licensing blocker to procurement leadership',
            ],
            projectId: body.projectId ?? null,
            isPortfolioLevel: false,
          },
        ];

    const durationMs = Date.now() - startTime;

    // TODO: Persist insights and log to database
    // await prisma.$transaction([
    //   ...mockGeneratedInsights.map(insight =>
    //     prisma.aiInsight.create({ data: { ...insight, analysisRunId: analysisLogId } })
    //   ),
    //   prisma.agentLog.create({
    //     data: {
    //       id: analysisLogId,
    //       scope: body.scope,
    //       projectId: body.projectId,
    //       insightsGenerated: mockGeneratedInsights.length,
    //       durationMs,
    //       status: 'COMPLETED',
    //     },
    //   }),
    // ]);

    const insights = mockGeneratedInsights.map((insight, idx) => ({
      ...insight,
      id: `ins-gen-${Date.now()}-${idx}`,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      data: {
        analysisId: analysisLogId,
        scope: body.scope,
        projectId: body.projectId ?? null,
        insights,
        meta: {
          insightsGenerated: insights.length,
          durationMs,
          model: 'claude-sonnet-4-20250514',
          timestamp: new Date().toISOString(),
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/agent/analyze error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to run analysis' },
      { status: 500 }
    );
  }
}
