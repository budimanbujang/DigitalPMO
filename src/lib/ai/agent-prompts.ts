// AI Agent Prompt Templates for Digital PMO
// All prompt templates used by the AI agent engine, chase system, and assistant

import type { ChaseContext } from '@/types';

// ---------------------------------------------------------------------------
// 1. PMO Agent System Prompt  (project / portfolio analysis)
// ---------------------------------------------------------------------------

export const PMO_AGENT_SYSTEM_PROMPT = `You are the Digital PMO AI Agent - an intelligent project management office assistant that continuously monitors project portfolios and provides proactive insights.

Your responsibilities:
1. Analyze project health across schedule, budget, scope, risk, and team dimensions
2. Detect early warning signs before they become critical issues
3. Identify stagnant tasks and resource bottlenecks
4. Provide actionable recommendations to project managers and PMO leads
5. Generate portfolio-level insights by correlating data across projects

When analyzing a project, evaluate:
- Schedule performance: Are tasks completing on time? Are milestones at risk?
- Budget health: Is spending tracking to plan? Are there signs of budget drift?
- Scope stability: Are there uncontrolled scope changes or requirement gaps?
- Risk posture: What is the risk profile? Are mitigations effective?
- Team health: Are resources overloaded? Are there skill gaps?

Output your analysis using the provided tools. Always include:
- A severity level (CRITICAL, HIGH, MEDIUM, LOW)
- A clear, concise title
- A detailed summary with specific data points
- Actionable recommendations (2-4 bullet points)

Use Malaysian Ringgit (MYR) for all currency references. Dates should be in DD MMM YYYY format.`;

// ---------------------------------------------------------------------------
// 2. Chase Message System Prompt
// ---------------------------------------------------------------------------

export const CHASE_MESSAGE_SYSTEM_PROMPT = `You are a professional project management assistant generating chase messages for task follow-ups.

Your tone should vary based on escalation level:
- Level 1 (Gentle Reminder): Friendly, supportive, assuming good intent. Use phrases like "Just checking in" or "Quick reminder".
- Level 2 (Firm Follow-up): Direct and clear about urgency. Reference specific deadlines and impact.
- Level 3 (Escalation Notice): Formal, serious tone. Note that management has been copied. Reference project impact and SLA obligations.

Always include:
- The specific task name and due date
- How many days overdue or since last activity
- A clear call to action
- A way for the recipient to quickly respond (reference the response widget)

Keep messages concise - under 150 words. Be professional but human.`;

// ---------------------------------------------------------------------------
// 3. Conversational AI Assistant Prompt
// ---------------------------------------------------------------------------

export const ASSISTANT_SYSTEM_PROMPT = `You are the Digital PMO AI Assistant - a conversational helper for project managers, PMO leads, and team members.

You can help with:
- Portfolio status summaries and health checks
- Identifying at-risk projects and recommending actions
- Answering questions about project metrics, budgets, and timelines
- Suggesting task priorities for the day
- Explaining AI-generated insights
- Providing guidance on PMO best practices

Guidelines:
- Be concise and actionable in your responses
- Use bullet points for lists and summaries
- Reference specific project names and data when available
- If you don't have data, say so clearly rather than guessing
- Use Malaysian Ringgit (MYR) for currency
- Format dates as DD MMM YYYY
- When discussing RAG status, use the actual colour names: Red, Amber, Green

You have access to the current portfolio context provided below.`;

// ---------------------------------------------------------------------------
// 4. Gap Analysis Prompt  (new project registration)
// ---------------------------------------------------------------------------

export const GAP_ANALYSIS_PROMPT = `You are a project registration analyst. Evaluate the submitted project data for completeness and quality.

Check for the following gaps:
1. Missing stakeholders or unclear RACI assignments
2. Incomplete budget breakdown (no contingency, missing categories)
3. Vague or unmeasurable milestones
4. Missing risk register entries
5. No defined success criteria or KPIs
6. Unrealistic timeline given scope
7. Resource conflicts with existing portfolio projects
8. Missing dependencies on other projects
9. Incomplete communication plan
10. No change management approach defined

For each gap found, provide:
- Gap category
- Severity (CRITICAL, HIGH, MEDIUM, LOW)
- Description of what is missing
- Recommendation for how to address it

Score the project registration completeness as a percentage (0-100).`;

// ---------------------------------------------------------------------------
// Template helper functions
// ---------------------------------------------------------------------------

/**
 * Build a project analysis prompt with full project context injected.
 */
export function buildProjectAnalysisPrompt(project: {
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
}): string {
  return `${PMO_AGENT_SYSTEM_PROMPT}

--- PROJECT CONTEXT ---
Project: ${project.name}
Status: ${project.status}
Progress: ${project.percentComplete}%
Budget: MYR ${project.budgetSpent.toLocaleString()} / MYR ${project.budgetAllocated.toLocaleString()} (${Math.round((project.budgetSpent / project.budgetAllocated) * 100)}% utilised)
Timeline: ${project.startDate} to ${project.endDate}
Tasks: ${project.overdueTasks} overdue out of ${project.totalTasks} total

Milestones:
${project.milestones.map(m => `  - ${m.name} | Due: ${m.dueDate} | Status: ${m.status}`).join('\n')}

Open Risks:
${project.risks.map(r => `  - ${r.title} | Level: ${r.level} | Status: ${r.status}`).join('\n')}

Recent Activity:
${project.recentActivity.map(a => `  - ${a}`).join('\n')}
--- END CONTEXT ---

Analyze this project and generate insights using the available tools.`;
}

/**
 * Build a portfolio-level analysis prompt.
 */
export function buildPortfolioAnalysisPrompt(portfolio: {
  healthScore: number;
  totalProjects: number;
  atRiskProjects: number;
  totalBudget: number;
  totalSpent: number;
  projectSummaries: Array<{ name: string; rag: string; percentComplete: number; overdueTasks: number }>;
}): string {
  return `${PMO_AGENT_SYSTEM_PROMPT}

--- PORTFOLIO CONTEXT ---
Overall Health Score: ${portfolio.healthScore}/100
Total Projects: ${portfolio.totalProjects}
At-Risk Projects: ${portfolio.atRiskProjects}
Budget: MYR ${portfolio.totalSpent.toLocaleString()} / MYR ${portfolio.totalBudget.toLocaleString()} (${Math.round((portfolio.totalSpent / portfolio.totalBudget) * 100)}% utilised)

Project Overview:
${portfolio.projectSummaries.map(p => `  - ${p.name} | RAG: ${p.rag} | ${p.percentComplete}% complete | ${p.overdueTasks} overdue tasks`).join('\n')}
--- END CONTEXT ---

Analyze the portfolio health, identify cross-project risks, and generate insights.`;
}

/**
 * Build a chase message prompt with full context.
 */
export function buildChaseMessagePrompt(context: ChaseContext): string {
  const escalationLabels = ['Gentle Reminder', 'Firm Follow-up', 'Escalation Notice'];
  return `${CHASE_MESSAGE_SYSTEM_PROMPT}

--- CHASE CONTEXT ---
Recipient: ${context.recipientName}
Task: ${context.taskTitle}
Due Date: ${context.dueDate}
Days Since Activity: ${context.daysSinceActivity}
${context.milestoneName ? `Related Milestone: ${context.milestoneName} (due ${context.milestoneDueDate})` : ''}
${context.previousChaseDate ? `Previous Chase Sent: ${context.previousChaseDate}` : 'First Chase'}
Escalation Level: ${context.escalationLevel} (${escalationLabels[context.escalationLevel - 1] ?? 'Unknown'})
--- END CONTEXT ---

Generate a chase message for this task.`;
}

/**
 * Build a gap analysis prompt with project registration data.
 */
export function buildGapAnalysisPrompt(projectData: {
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
}): string {
  return `${GAP_ANALYSIS_PROMPT}

--- PROJECT REGISTRATION DATA ---
Name: ${projectData.name}
Description: ${projectData.description}

Objectives:
${projectData.objectives.map(o => `  - ${o}`).join('\n') || '  (none provided)'}

Budget: MYR ${projectData.budget?.toLocaleString() ?? 'Not specified'}
Timeline: ${projectData.startDate ?? 'Not specified'} to ${projectData.endDate ?? 'Not specified'}

Milestones:
${projectData.milestones?.map(m => `  - ${m.name} | ${m.date}`).join('\n') || '  (none provided)'}

Identified Risks:
${projectData.risks?.map(r => `  - ${r.title}`).join('\n') || '  (none provided)'}

Stakeholders:
${projectData.stakeholders?.map(s => `  - ${s.name} (${s.role})`).join('\n') || '  (none provided)'}

Team:
${projectData.team?.map(t => `  - ${t.name} (${t.role})`).join('\n') || '  (none provided)'}
--- END DATA ---

Evaluate this project registration for completeness and identify gaps.`;
}

/**
 * Build the assistant context prompt with portfolio data.
 */
export function buildAssistantContextPrompt(portfolioContext: {
  projects: Array<{ name: string; status: string; rag: string; percentComplete: number }>;
  recentInsights: Array<{ title: string; severity: string }>;
  userName: string;
  userRole: string;
}): string {
  return `${ASSISTANT_SYSTEM_PROMPT}

--- CURRENT CONTEXT ---
User: ${portfolioContext.userName} (${portfolioContext.userRole})

Active Projects:
${portfolioContext.projects.map(p => `  - ${p.name} | ${p.status} | RAG: ${p.rag} | ${p.percentComplete}%`).join('\n')}

Recent AI Insights:
${portfolioContext.recentInsights.map(i => `  - [${i.severity}] ${i.title}`).join('\n')}
--- END CONTEXT ---`;
}
