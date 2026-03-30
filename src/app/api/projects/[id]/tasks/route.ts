import { NextRequest, NextResponse } from 'next/server';
import type { TaskStatus, Priority } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockTasks = [
  {
    id: 'task-001',
    projectId: 'proj-001',
    title: 'Configure AWS VPC peering',
    description: 'Set up VPC peering between production and staging environments',
    status: 'COMPLETED' as TaskStatus,
    priority: 'HIGH' as Priority,
    assigneeId: 'user-005',
    assigneeName: 'Mike Johnson',
    dueDate: '2026-03-15',
    completedAt: '2026-03-14T16:30:00Z',
    milestoneId: 'ms-001',
    estimatedHours: 16,
    actualHours: 14,
    tags: ['infrastructure', 'aws'],
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-03-14T16:30:00Z',
  },
  {
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
    estimatedHours: 40,
    actualHours: 22,
    tags: ['auth', 'migration'],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-28T00:00:00Z',
  },
  {
    id: 'task-003',
    projectId: 'proj-001',
    title: 'Update monitoring dashboards',
    description: 'Reconfigure CloudWatch and Grafana dashboards for new infra',
    status: 'TODO' as TaskStatus,
    priority: 'MEDIUM' as Priority,
    assigneeId: 'user-005',
    assigneeName: 'Mike Johnson',
    dueDate: '2026-04-15',
    completedAt: null,
    milestoneId: 'ms-002',
    estimatedHours: 24,
    actualHours: 0,
    tags: ['monitoring'],
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'task-004',
    projectId: 'proj-001',
    title: 'Database schema migration scripts',
    description: 'Write and test migration scripts for PostgreSQL to Aurora',
    status: 'BLOCKED' as TaskStatus,
    priority: 'HIGH' as Priority,
    assigneeId: 'user-006',
    assigneeName: 'Priya Sharma',
    dueDate: '2026-03-20',
    completedAt: null,
    milestoneId: 'ms-002',
    estimatedHours: 32,
    actualHours: 10,
    tags: ['database', 'migration'],
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-18T00:00:00Z',
  },
];

// ── GET /api/projects/[id]/tasks ───────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as TaskStatus | null;
    const priority = searchParams.get('priority') as Priority | null;
    const assigneeId = searchParams.get('assigneeId');
    const milestoneId = searchParams.get('milestoneId');
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);

    // TODO: Replace with Prisma query
    // const tasks = await prisma.task.findMany({
    //   where: { projectId: id, status, priority, assigneeId, milestoneId },
    //   include: { assignee: true, milestone: true },
    //   orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    let filtered = mockTasks.map((t) => ({ ...t, projectId: id }));

    if (status) filtered = filtered.filter((t) => t.status === status);
    if (priority) filtered = filtered.filter((t) => t.priority === priority);
    if (assigneeId) filtered = filtered.filter((t) => t.assigneeId === assigneeId);
    if (milestoneId) filtered = filtered.filter((t) => t.milestoneId === milestoneId);

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error(`GET /api/projects/${params.id}/tasks error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// ── POST /api/projects/[id]/tasks ──────────────────────────────────────
interface CreateTaskBody {
  title: string;
  description?: string;
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  milestoneId?: string;
  estimatedHours?: number;
  tags?: string[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: CreateTaskBody = await request.json();

    if (!body.title || !body.priority || !body.assigneeId || !body.dueDate) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: title, priority, assigneeId, dueDate' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const task = await prisma.task.create({
    //   data: { ...body, projectId: id, status: 'TODO' },
    // });

    const newTask = {
      id: `task-${Date.now()}`,
      projectId: id,
      title: body.title,
      description: body.description ?? '',
      status: 'TODO' as TaskStatus,
      priority: body.priority,
      assigneeId: body.assigneeId,
      assigneeName: 'Assigned User',
      dueDate: body.dueDate,
      completedAt: null,
      milestoneId: body.milestoneId ?? null,
      estimatedHours: body.estimatedHours ?? 0,
      actualHours: 0,
      tags: body.tags ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: newTask }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/projects/${params.id}/tasks error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
