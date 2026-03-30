import Anthropic from '@anthropic-ai/sdk';
import {
  buildProjectAnalysisPrompt,
  buildPortfolioAnalysisPrompt,
  buildGapAnalysisPrompt,
} from './agent-prompts';
import type { AIInsightData, Priority, InsightType } from '@/types';

// ---------------------------------------------------------------------------
// Anthropic Client
// ---------------------------------------------------------------------------

function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

// ---------------------------------------------------------------------------
// Claude Tool Definitions
// ---------------------------------------------------------------------------

const AGENT_TOOLS: Anthropic.Tool[] = [
  {
    name: 'create_insight',
    description:
      'Create a new AI insight for a project or portfolio. Use this to report findings from your analysis.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: [
            'GAP_ANALYSIS',
            'BUDGET_DRIFT',
            'TIMELINE_RISK',
            'STAGNANT_TASK',
            'RESOURCE_CONFLICT',
            'DEPENDENCY_RISK',
            'MILESTONE_AT_RISK',
            'PORTFOLIO_HEALTH',
            'RECOMMENDATION',
          ],
          description: 'The type of insight',
        },
        severity: {
          type: 'string',
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
          description: 'Severity level of the insight',
        },
        title: {
          type: 'string',
          description: 'A concise title for the insight (under 100 characters)',
        },
        summary: {
          type: 'string',
          description: 'A brief summary of the finding (1-2 sentences)',
        },
        details: {
          type: 'string',
          description: 'Detailed analysis with specific data points',
        },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
          description: '2-4 actionable recommendations',
        },
      },
      required: ['type', 'severity', 'title', 'summary', 'details', 'recommendations'],
    },
  },
  {
    name: 'create_alert',
    description:
      'Create a notification alert that requires attention from a project manager or PMO lead.',
    input_schema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: [
            'TASK_OVERDUE',
            'MILESTONE_AT_RISK',
            'BUDGET_ALERT',
            'CHASE_REQUEST',
            'AI_INSIGHT',
            'STATUS_UPDATE_DUE',
            'ESCALATION',
          ],
          description: 'Alert notification type',
        },
        title: {
          type: 'string',
          description: 'Alert title',
        },
        message: {
          type: 'string',
          description: 'Alert message with context',
        },
        severity: {
          type: 'string',
          enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
          description: 'Alert severity',
        },
      },
      required: ['type', 'title', 'message', 'severity'],
    },
  },
];

// ---------------------------------------------------------------------------
// Mock Insights (fallback when no API key)
// ---------------------------------------------------------------------------

function generateMockInsights(scope: string): AIInsightData[] {
  const now = new Date().toISOString();
  return [
    {
      id: `insight-mock-${Date.now()}-1`,
      type: 'BUDGET_DRIFT',
      severity: 'HIGH',
      title: `Budget drift detected in ${scope}`,
      summary: `Budget utilization is at 78% with only 55% of deliverables completed. Forecasted overrun of MYR 320,000.`,
      details: `Analysis of spending patterns shows accelerating burn rate over the last 4 weeks. Key cost drivers: additional vendor resources (MYR 180,000) and scope additions (MYR 140,000). Current trajectory projects total spend of MYR 4.82M against MYR 4.5M budget.`,
      recommendations: [
        'Conduct immediate scope review with project sponsor',
        'Negotiate vendor rate adjustment for remaining work packages',
        'Defer non-critical features to Phase 2',
        'Implement weekly budget tracking checkpoints',
      ],
      projectName: scope,
      isPortfolioLevel: false,
      acknowledged: false,
      createdAt: now,
    },
    {
      id: `insight-mock-${Date.now()}-2`,
      type: 'STAGNANT_TASK',
      severity: 'MEDIUM',
      title: `4 stagnant tasks detected in ${scope}`,
      summary: `Four tasks have had no activity for 7 or more days, potentially blocking downstream deliverables.`,
      details: `Stagnant tasks: API Integration (9 days), Database Migration (7 days), Security Audit (8 days), Documentation (12 days). Combined impact: potential 2-week delay to UAT milestone if not resolved within 5 days.`,
      recommendations: [
        'Initiate chase sequence for all stagnant task owners',
        'Review task dependencies and identify critical path impact',
        'Schedule stand-up with affected team members',
      ],
      projectName: scope,
      isPortfolioLevel: false,
      acknowledged: false,
      createdAt: now,
    },
    {
      id: `insight-mock-${Date.now()}-3`,
      type: 'MILESTONE_AT_RISK',
      severity: 'HIGH',
      title: `UAT milestone at risk - ${scope}`,
      summary: `The UAT Phase milestone due in 5 days has 3 incomplete blocking tasks.`,
      details: `Milestone: UAT Phase (due 04 Apr 2026). Blocking tasks: Integration Testing (70% complete), Data Validation (45% complete), Environment Setup (pending). Based on current velocity, estimated completion is 08 Apr 2026, a 4-day delay.`,
      recommendations: [
        'Allocate additional resources to blocking tasks',
        'Consider parallel execution of Data Validation and Environment Setup',
        'Prepare stakeholder communication for potential delay',
        'Identify minimum viable scope for on-time UAT entry',
      ],
      projectName: scope,
      isPortfolioLevel: false,
      acknowledged: false,
      createdAt: now,
    },
  ];
}

function generateMockPortfolioInsights(): AIInsightData[] {
  const now = new Date().toISOString();
  return [
    {
      id: `insight-mock-${Date.now()}-p1`,
      type: 'PORTFOLIO_HEALTH',
      severity: 'MEDIUM',
      title: 'Portfolio health declining - 3 projects need attention',
      summary: 'Overall portfolio health score dropped from 76 to 72 this week. Three projects showing negative trends.',
      details: 'Declining projects: E-Perolehan Revamp (RED, budget drift), MYDA Phase 2 (AMBER, resource conflicts), HRMIS Upgrade (AMBER, milestone risk). Combined impact: MYR 520K potential overrun and 2-3 week aggregate schedule risk.',
      recommendations: [
        'Schedule portfolio review with PMO Lead this week',
        'Prioritise E-Perolehan budget review as highest risk item',
        'Resolve cross-project resource conflicts for Ahmad Razif',
        'Implement weekly RAG status review cadence',
      ],
      isPortfolioLevel: true,
      acknowledged: false,
      createdAt: now,
    },
    {
      id: `insight-mock-${Date.now()}-p2`,
      type: 'RESOURCE_CONFLICT',
      severity: 'HIGH',
      title: 'Cross-project resource conflict detected',
      summary: 'Ahmad Razif is assigned to critical-path tasks in both MYDA Phase 2 and MyGov Portal with overlapping deadlines.',
      details: 'Conflicting assignments: MYDA Phase 2 Security Audit (due 31 Mar) and MyGov Portal API Gateway (due 02 Apr). Both are on the critical path. Combined effort: 14 days, available capacity: 5 days. One task must be reassigned or deferred.',
      recommendations: [
        'Reassign MyGov Portal API Gateway to available backend developer',
        'If no developer available, negotiate 1-week extension with MyGov stakeholders',
        'Review resource allocation model to prevent future conflicts',
      ],
      isPortfolioLevel: true,
      acknowledged: false,
      createdAt: now,
    },
  ];
}

// ---------------------------------------------------------------------------
// Extract tool results from Claude response
// ---------------------------------------------------------------------------

function extractInsightsFromResponse(
  response: Anthropic.Message,
  projectId?: string,
  projectName?: string,
  isPortfolio = false
): AIInsightData[] {
  const insights: AIInsightData[] = [];
  const now = new Date().toISOString();

  for (const block of response.content) {
    if (block.type === 'tool_use' && block.name === 'create_insight') {
      const input = block.input as Record<string, unknown>;
      insights.push({
        id: `insight-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: input.type as InsightType,
        severity: input.severity as Priority,
        title: input.title as string,
        summary: input.summary as string,
        details: input.details as string,
        recommendations: input.recommendations as string[],
        projectId,
        projectName: projectName ?? (input.projectName as string | undefined),
        isPortfolioLevel: isPortfolio,
        acknowledged: false,
        createdAt: now,
      });
    }
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function runProjectAnalysis(project: {
  id: string;
  name: string;
  status: string;
  percentComplete: number;
  budgetAllocated: number;
  budgetSpent: number;
  startDate: string;
  endDate: string;
  overdueTasks: number;
  totalTasks: number;
  milestones: Array<{ name: string; dueDate: string; status: string }>;
  risks: Array<{ title: string; level: string; status: string }>;
  recentActivity: string[];
}): Promise<AIInsightData[]> {
  const client = getClient();
  if (!client) {
    return generateMockInsights(project.name);
  }

  try {
    const prompt = buildProjectAnalysisPrompt(project);
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      tools: AGENT_TOOLS,
      messages: [{ role: 'user', content: prompt }],
    });

    const insights = extractInsightsFromResponse(response, project.id, project.name);
    return insights.length > 0 ? insights : generateMockInsights(project.name);
  } catch {
    return generateMockInsights(project.name);
  }
}

export async function runPortfolioAnalysis(portfolio: {
  healthScore: number;
  totalProjects: number;
  atRiskProjects: number;
  totalBudget: number;
  totalSpent: number;
  projectSummaries: Array<{
    name: string;
    rag: string;
    percentComplete: number;
    overdueTasks: number;
  }>;
}): Promise<AIInsightData[]> {
  const client = getClient();
  if (!client) {
    return generateMockPortfolioInsights();
  }

  try {
    const prompt = buildPortfolioAnalysisPrompt(portfolio);
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      tools: AGENT_TOOLS,
      messages: [{ role: 'user', content: prompt }],
    });

    const insights = extractInsightsFromResponse(response, undefined, undefined, true);
    return insights.length > 0 ? insights : generateMockPortfolioInsights();
  } catch {
    return generateMockPortfolioInsights();
  }
}

export async function detectStagnantTasks(tasks: Array<{
  id: string;
  title: string;
  assignee: string;
  lastActivityDate: string;
  projectName: string;
}>): Promise<AIInsightData[]> {
  const stagnantThresholdDays = 7;
  const now = new Date();
  const stagnant = tasks.filter((t) => {
    const lastActivity = new Date(t.lastActivityDate);
    const daysSince = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= stagnantThresholdDays;
  });

  if (stagnant.length === 0) return [];

  const insight: AIInsightData = {
    id: `insight-stagnant-${Date.now()}`,
    type: 'STAGNANT_TASK',
    severity: stagnant.length >= 5 ? 'HIGH' : 'MEDIUM',
    title: `${stagnant.length} stagnant tasks detected`,
    summary: `${stagnant.length} tasks have had no activity for ${stagnantThresholdDays}+ days.`,
    details: stagnant
      .map((t) => {
        const days = Math.floor(
          (now.getTime() - new Date(t.lastActivityDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        return `${t.title} (${t.projectName}) - ${days} days, assigned to ${t.assignee}`;
      })
      .join('\n'),
    recommendations: [
      'Initiate chase sequences for all stagnant task owners',
      'Review if tasks are still relevant or should be re-scoped',
      'Check for blockers that may not have been formally reported',
    ],
    isPortfolioLevel: true,
    acknowledged: false,
    createdAt: now.toISOString(),
  };

  return [insight];
}

export async function analyzeBudgetHealth(projects: Array<{
  id: string;
  name: string;
  budgetAllocated: number;
  budgetSpent: number;
  percentComplete: number;
}>): Promise<AIInsightData[]> {
  const insights: AIInsightData[] = [];
  const now = new Date().toISOString();

  for (const project of projects) {
    const budgetUtilization =
      project.budgetAllocated > 0
        ? (project.budgetSpent / project.budgetAllocated) * 100
        : 0;
    const drift = budgetUtilization - project.percentComplete;

    if (drift > 15) {
      insights.push({
        id: `insight-budget-${Date.now()}-${project.id}`,
        type: 'BUDGET_DRIFT',
        severity: drift > 25 ? 'CRITICAL' : 'HIGH',
        title: `Budget drift of ${Math.round(drift)}% in ${project.name}`,
        summary: `Budget utilization (${Math.round(budgetUtilization)}%) is significantly ahead of completion (${project.percentComplete}%).`,
        details: `Budget: MYR ${project.budgetSpent.toLocaleString()} spent of MYR ${project.budgetAllocated.toLocaleString()} (${Math.round(budgetUtilization)}%). Completion: ${project.percentComplete}%. Drift: ${Math.round(drift)} percentage points. Projected overrun: MYR ${Math.round(project.budgetAllocated * (drift / 100)).toLocaleString()}.`,
        recommendations: [
          'Review spending breakdown with project manager',
          'Identify top cost drivers and assess necessity',
          'Consider scope adjustment to align with budget',
          'Implement tighter change control for remaining work',
        ],
        projectId: project.id,
        projectName: project.name,
        isPortfolioLevel: false,
        acknowledged: false,
        createdAt: now,
      });
    }
  }

  return insights;
}

export async function assessMilestoneRisk(milestones: Array<{
  id: string;
  name: string;
  dueDate: string;
  status: string;
  projectName: string;
  blockingTasksCount: number;
}>): Promise<AIInsightData[]> {
  const insights: AIInsightData[] = [];
  const now = new Date();

  for (const ms of milestones) {
    if (ms.status === 'COMPLETED') continue;
    const dueDate = new Date(ms.dueDate);
    const daysUntil = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil <= 7 && ms.blockingTasksCount > 0) {
      insights.push({
        id: `insight-ms-${Date.now()}-${ms.id}`,
        type: 'MILESTONE_AT_RISK',
        severity: daysUntil <= 3 ? 'CRITICAL' : 'HIGH',
        title: `Milestone "${ms.name}" at risk - ${ms.projectName}`,
        summary: `Due in ${daysUntil} days with ${ms.blockingTasksCount} blocking tasks remaining.`,
        details: `Milestone: ${ms.name}. Due: ${ms.dueDate}. Days remaining: ${daysUntil}. Blocking tasks: ${ms.blockingTasksCount}. Project: ${ms.projectName}.`,
        recommendations: [
          'Prioritise blocking tasks and allocate additional resources',
          'Consider parallel execution where possible',
          'Prepare stakeholder communication for potential delay',
          'Identify minimum viable scope for on-time delivery',
        ],
        projectName: ms.projectName,
        isPortfolioLevel: false,
        acknowledged: false,
        createdAt: now.toISOString(),
      });
    }
  }

  return insights;
}

export async function runGapAnalysis(projectData: {
  name: string;
  description: string;
  objectives: string[];
  budget: number;
  startDate: string;
  endDate: string;
  milestones: Array<{ name: string; date: string }>;
  risks: Array<{ title: string }>;
  stakeholders: Array<{ name: string; role: string }>;
  team: Array<{ name: string; role: string }>;
}): Promise<{ insights: AIInsightData[]; completenessScore: number }> {
  const client = getClient();

  if (!client) {
    // Heuristic-based fallback
    let score = 100;
    const gaps: string[] = [];

    if (!projectData.objectives?.length) { score -= 15; gaps.push('No objectives defined'); }
    if (!projectData.budget) { score -= 10; gaps.push('No budget specified'); }
    if (!projectData.milestones?.length) { score -= 15; gaps.push('No milestones defined'); }
    if (!projectData.risks?.length) { score -= 10; gaps.push('No risks identified'); }
    if (!projectData.stakeholders?.length) { score -= 15; gaps.push('No stakeholders listed'); }
    if (!projectData.team?.length) { score -= 10; gaps.push('No team members assigned'); }
    if ((projectData.milestones?.length ?? 0) < 3) { score -= 5; gaps.push('Fewer than 3 milestones'); }
    if ((projectData.risks?.length ?? 0) < 3) { score -= 5; gaps.push('Fewer than 3 risks identified'); }

    const insight: AIInsightData = {
      id: `insight-gap-${Date.now()}`,
      type: 'GAP_ANALYSIS',
      severity: score < 50 ? 'CRITICAL' : score < 70 ? 'HIGH' : 'MEDIUM',
      title: `Project registration ${score}% complete - ${gaps.length} gaps found`,
      summary: `Analysis of "${projectData.name}" registration found ${gaps.length} gaps that should be addressed.`,
      details: gaps.map((g, i) => `${i + 1}. ${g}`).join('\n'),
      recommendations: [
        'Address all critical gaps before project approval',
        'Ensure at least 3-5 milestones with measurable criteria',
        'Complete risk register with mitigation strategies',
        'Define RACI matrix for all stakeholders',
      ],
      projectName: projectData.name,
      isPortfolioLevel: false,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    };

    return { insights: [insight], completenessScore: Math.max(0, score) };
  }

  try {
    const prompt = buildGapAnalysisPrompt(projectData);
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      tools: AGENT_TOOLS,
      messages: [{ role: 'user', content: prompt }],
    });

    const insights = extractInsightsFromResponse(response, undefined, projectData.name);
    // Extract score from text blocks if present
    let score = 65;
    for (const block of response.content) {
      if (block.type === 'text') {
        const match = block.text.match(/(\d{1,3})%/);
        if (match) score = parseInt(match[1], 10);
      }
    }

    return { insights, completenessScore: score };
  } catch {
    return { insights: [], completenessScore: 50 };
  }
}
