import Anthropic from '@anthropic-ai/sdk';
import { buildChaseMessagePrompt } from './agent-prompts';
import type { ChaseContext, ChaseStatus } from '@/types';

// ---------------------------------------------------------------------------
// Anthropic Client
// ---------------------------------------------------------------------------

function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChaseMessage {
  id: string;
  taskId: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  body: string;
  escalationLevel: number;
  status: ChaseStatus;
  sentAt: string;
  respondedAt?: string;
}

export interface ChaseResponse {
  chaseId: string;
  taskId: string;
  responderId: string;
  status: 'on_track' | 'blocked' | 'need_help' | 'reassign';
  newDate?: string;
  blockerDescription?: string;
  helpDescription?: string;
  reassignTo?: string;
  notes?: string;
  respondedAt: string;
}

export interface EscalationConfig {
  level: number;
  daysOverdue: number;
  tone: 'gentle' | 'firm' | 'escalation';
  notifyRoles: string[];
  label: string;
}

// ---------------------------------------------------------------------------
// Escalation Ladder
// ---------------------------------------------------------------------------

const ESCALATION_LADDER: EscalationConfig[] = [
  {
    level: 1,
    daysOverdue: 1,
    tone: 'gentle',
    notifyRoles: ['assignee'],
    label: 'Gentle Reminder',
  },
  {
    level: 2,
    daysOverdue: 3,
    tone: 'firm',
    notifyRoles: ['assignee', 'project_manager'],
    label: 'Firm Follow-up',
  },
  {
    level: 3,
    daysOverdue: 5,
    tone: 'escalation',
    notifyRoles: ['assignee', 'project_manager', 'pmo_lead'],
    label: 'PM Escalation',
  },
  {
    level: 4,
    daysOverdue: 7,
    tone: 'escalation',
    notifyRoles: ['assignee', 'project_manager', 'pmo_lead', 'steering_committee'],
    label: 'PMO Lead Escalation',
  },
];

export function getEscalationLevel(daysOverdue: number): EscalationConfig {
  // Return the highest applicable escalation level
  const applicable = ESCALATION_LADDER.filter((e) => daysOverdue >= e.daysOverdue);
  return applicable.length > 0
    ? applicable[applicable.length - 1]
    : ESCALATION_LADDER[0];
}

// ---------------------------------------------------------------------------
// Generate Chase Message
// ---------------------------------------------------------------------------

function generateMockChaseMessage(context: ChaseContext): string {
  const level = context.escalationLevel;

  if (level === 1) {
    return `Hi ${context.recipientName},

Just checking in on the "${context.taskTitle}" task which was due on ${context.dueDate}. It has been ${context.daysSinceActivity} days since the last activity.

Could you provide a quick status update? If you are facing any blockers, please let us know so we can help.

You can respond directly using the quick response widget below.

Thank you!
PMO AI Agent`;
  }

  if (level === 2) {
    return `Hi ${context.recipientName},

This is a follow-up regarding the "${context.taskTitle}" task. This task is now ${context.daysSinceActivity} days past its due date of ${context.dueDate}.${context.milestoneName ? ` This task is blocking the "${context.milestoneName}" milestone (due ${context.milestoneDueDate}).` : ''}

We need an immediate status update. Please use the response widget to indicate your current status:
- On track with a new completion date
- Blocked (describe the blocker)
- Need help (describe what you need)
- Request reassignment

Your project manager has been copied on this message.

Regards,
PMO AI Agent`;
  }

  // Level 3+
  return `Dear ${context.recipientName},

ESCALATION NOTICE: The "${context.taskTitle}" task is now ${context.daysSinceActivity} days overdue (original due date: ${context.dueDate}).${context.milestoneName ? ` This is directly impacting the "${context.milestoneName}" milestone scheduled for ${context.milestoneDueDate}.` : ''}

${context.previousChaseDate ? `Previous follow-up was sent on ${context.previousChaseDate} with no response.` : ''} This matter has been escalated to the PMO Lead.

Immediate action is required. Please respond within 24 hours using the response widget, or contact your project manager directly.

This notice has been sent to: PM, PMO Lead${level >= 4 ? ', Steering Committee' : ''}.

Regards,
PMO AI Agent`;
}

export async function generateChaseMessage(
  context: ChaseContext
): Promise<string> {
  const client = getClient();
  if (!client) {
    return generateMockChaseMessage(context);
  }

  try {
    const prompt = buildChaseMessagePrompt(context);
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    for (const block of response.content) {
      if (block.type === 'text') {
        return block.text;
      }
    }

    return generateMockChaseMessage(context);
  } catch {
    return generateMockChaseMessage(context);
  }
}

// ---------------------------------------------------------------------------
// Process Chase Response
// ---------------------------------------------------------------------------

export async function processChaseResponse(
  response: ChaseResponse
): Promise<{
  action: string;
  notifications: Array<{ recipientRole: string; message: string }>;
}> {
  const notifications: Array<{ recipientRole: string; message: string }> = [];

  switch (response.status) {
    case 'on_track':
      notifications.push({
        recipientRole: 'project_manager',
        message: `${response.responderId} has responded to chase for task ${response.taskId}. Status: On track. ${response.newDate ? `New expected date: ${response.newDate}` : ''}`,
      });
      return { action: 'update_task_status', notifications };

    case 'blocked':
      notifications.push({
        recipientRole: 'project_manager',
        message: `BLOCKER REPORTED: ${response.responderId} reports task ${response.taskId} is blocked. Reason: ${response.blockerDescription ?? 'Not specified'}`,
      });
      notifications.push({
        recipientRole: 'assignee',
        message: `Your blocker report for task ${response.taskId} has been forwarded to the project manager.`,
      });
      return { action: 'create_blocker_ticket', notifications };

    case 'need_help':
      notifications.push({
        recipientRole: 'project_manager',
        message: `HELP REQUESTED: ${response.responderId} needs assistance with task ${response.taskId}. Details: ${response.helpDescription ?? 'Not specified'}`,
      });
      return { action: 'flag_for_pm_review', notifications };

    case 'reassign':
      notifications.push({
        recipientRole: 'project_manager',
        message: `REASSIGNMENT REQUESTED: ${response.responderId} has requested reassignment of task ${response.taskId}. Suggested assignee: ${response.reassignTo ?? 'Not specified'}`,
      });
      return { action: 'request_reassignment', notifications };

    default:
      return { action: 'no_action', notifications };
  }
}

// ---------------------------------------------------------------------------
// Escalation
// ---------------------------------------------------------------------------

export function escalateChase(
  currentLevel: number,
  context: ChaseContext
): {
  newLevel: number;
  escalationConfig: EscalationConfig;
  shouldEscalate: boolean;
} {
  const nextLevel = Math.min(currentLevel + 1, ESCALATION_LADDER.length);
  const config = ESCALATION_LADDER[nextLevel - 1];
  const shouldEscalate = context.daysSinceActivity >= config.daysOverdue;

  return {
    newLevel: nextLevel,
    escalationConfig: config,
    shouldEscalate,
  };
}

// ---------------------------------------------------------------------------
// Chase Trigger Checks
// ---------------------------------------------------------------------------

export function checkOverdueTasks(tasks: Array<{
  id: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  status: string;
  projectName: string;
  lastChaseDate?: string;
}>): ChaseContext[] {
  const now = new Date();
  const contexts: ChaseContext[] = [];

  for (const task of tasks) {
    if (task.status === 'COMPLETED' || task.status === 'CANCELLED') continue;

    const due = new Date(task.dueDate);
    if (due >= now) continue;

    const daysOverdue = Math.floor(
      (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );
    const escalation = getEscalationLevel(daysOverdue);

    contexts.push({
      recipientName: task.assigneeName,
      recipientId: task.assigneeId,
      taskId: task.id,
      taskTitle: task.title,
      dueDate: task.dueDate,
      daysSinceActivity: daysOverdue,
      previousChaseDate: task.lastChaseDate,
      escalationLevel: escalation.level,
    });
  }

  return contexts;
}

export function checkStagnantTasks(tasks: Array<{
  id: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  lastActivityDate: string;
  projectName: string;
  lastChaseDate?: string;
}>, stagnantDays = 7): ChaseContext[] {
  const now = new Date();
  const contexts: ChaseContext[] = [];

  for (const task of tasks) {
    const lastActivity = new Date(task.lastActivityDate);
    const daysSince = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince < stagnantDays) continue;

    contexts.push({
      recipientName: task.assigneeName,
      recipientId: task.assigneeId,
      taskId: task.id,
      taskTitle: task.title,
      dueDate: task.dueDate,
      daysSinceActivity: daysSince,
      previousChaseDate: task.lastChaseDate,
      escalationLevel: 1,
    });
  }

  return contexts;
}

export function checkMissingStatusUpdates(projects: Array<{
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  lastStatusUpdateDate: string;
}>, thresholdDays = 5): ChaseContext[] {
  const now = new Date();
  const contexts: ChaseContext[] = [];

  for (const project of projects) {
    const lastUpdate = new Date(project.lastStatusUpdateDate);
    const daysSince = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince < thresholdDays) continue;

    contexts.push({
      recipientName: project.managerName,
      recipientId: project.managerId,
      taskId: project.id,
      taskTitle: `Status Update - ${project.name}`,
      dueDate: project.lastStatusUpdateDate,
      daysSinceActivity: daysSince,
      escalationLevel: daysSince >= 10 ? 2 : 1,
    });
  }

  return contexts;
}

// ---------------------------------------------------------------------------
// Get Pending Chases for a User
// ---------------------------------------------------------------------------

export function getPendingChases(
  userId: string,
  chases: ChaseMessage[] = []
): ChaseMessage[] {
  return chases.filter(
    (c) => c.recipientId === userId && c.status === 'PENDING'
  );
}
