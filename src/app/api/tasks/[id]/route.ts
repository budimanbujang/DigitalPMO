import { NextRequest, NextResponse } from 'next/server';
import type { TaskStatus, Priority } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockTask = {
  id: 'task-002',
  projectId: 'proj-001',
  title: 'Migrate user authentication service',
  description: 'Move auth service to ECS with Cognito integration',
  status: 'IN_PROGRESS' as TaskStatus,
  priority: 'CRITICAL' as Priority,
  assigneeId: 'user-006',
  assigneeName: 'Priya Sharma',
  dueDate: '2026-04-01',
  completedAt: null,
  milestoneId: 'ms-002',
  milestoneName: 'App Layer Migration',
  estimatedHours: 40,
  actualHours: 22,
  tags: ['auth', 'migration'],
  dependencies: ['task-001'],
  blockedBy: [],
  comments: [
    {
      id: 'cmt-001',
      authorId: 'user-006',
      authorName: 'Priya Sharma',
      content: 'Cognito integration is more complex than anticipated. Need to handle custom attributes migration.',
      createdAt: '2026-03-25T10:00:00Z',
    },
  ],
  activityLog: [
    { action: 'status_changed', from: 'TODO', to: 'IN_PROGRESS', userId: 'user-006', timestamp: '2026-03-01T09:00:00Z' },
    { action: 'created', userId: 'user-001', timestamp: '2026-02-01T00:00:00Z' },
  ],
  createdAt: '2026-02-01T00:00:00Z',
  updatedAt: '2026-03-28T00:00:00Z',
};

// ── PATCH /api/tasks/[id] ─────────────────────────────────────────────
interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  dueDate?: string;
  milestoneId?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateTaskBody = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { data: null, error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // Validate status transitions
    if (body.status) {
      const validTransitions: Record<TaskStatus, TaskStatus[]> = {
        TODO: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['BLOCKED', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'],
        BLOCKED: ['IN_PROGRESS', 'CANCELLED'],
        IN_REVIEW: ['IN_PROGRESS', 'COMPLETED'],
        COMPLETED: ['IN_PROGRESS'], // allow re-open
        CANCELLED: ['TODO'],
      };
      const currentStatus = mockTask.status;
      if (!validTransitions[currentStatus]?.includes(body.status)) {
        return NextResponse.json(
          { data: null, error: `Invalid status transition from ${currentStatus} to ${body.status}` },
          { status: 400 }
        );
      }
    }

    // TODO: Replace with Prisma update
    // const task = await prisma.task.update({
    //   where: { id },
    //   data: {
    //     ...body,
    //     completedAt: body.status === 'COMPLETED' ? new Date() : undefined,
    //     updatedAt: new Date(),
    //   },
    //   include: { assignee: true, milestone: true },
    // });

    const updated = {
      ...mockTask,
      id,
      ...body,
      completedAt: body.status === 'COMPLETED' ? new Date().toISOString() : mockTask.completedAt,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PATCH /api/tasks/${params.id} error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
