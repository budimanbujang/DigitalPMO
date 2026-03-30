import { NextRequest, NextResponse } from 'next/server';
import type { MilestoneStatus } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockMilestones = [
  {
    id: 'ms-001',
    projectId: 'proj-001',
    name: 'Database Migration Complete',
    description: 'All databases migrated to Aurora with data integrity verified',
    status: 'COMPLETED' as MilestoneStatus,
    dueDate: '2026-02-28',
    completedAt: '2026-02-26T00:00:00Z',
    taskCount: 12,
    completedTaskCount: 12,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2026-02-26T00:00:00Z',
  },
  {
    id: 'ms-002',
    projectId: 'proj-001',
    name: 'App Layer Migration',
    description: 'All application services migrated to ECS/EKS',
    status: 'IN_PROGRESS' as MilestoneStatus,
    dueDate: '2026-04-15',
    completedAt: null,
    taskCount: 18,
    completedTaskCount: 8,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2026-03-28T00:00:00Z',
  },
  {
    id: 'ms-003',
    projectId: 'proj-001',
    name: 'Monitoring & Cutover',
    description: 'Full monitoring setup and final production cutover',
    status: 'NOT_STARTED' as MilestoneStatus,
    dueDate: '2026-06-15',
    completedAt: null,
    taskCount: 10,
    completedTaskCount: 0,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
  },
];

// ── GET /api/projects/[id]/milestones ──────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Replace with Prisma query
    // const milestones = await prisma.milestone.findMany({
    //   where: { projectId: id },
    //   include: { _count: { select: { tasks: true } } },
    //   orderBy: { dueDate: 'asc' },
    // });

    const data = mockMilestones.map((m) => ({ ...m, projectId: id }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error(`GET /api/projects/${params.id}/milestones error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

// ── POST /api/projects/[id]/milestones ─────────────────────────────────
interface CreateMilestoneBody {
  name: string;
  description?: string;
  dueDate: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: CreateMilestoneBody = await request.json();

    if (!body.name || !body.dueDate) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: name, dueDate' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const milestone = await prisma.milestone.create({
    //   data: { ...body, projectId: id, status: 'NOT_STARTED' },
    // });

    const newMilestone = {
      id: `ms-${Date.now()}`,
      projectId: id,
      name: body.name,
      description: body.description ?? '',
      status: 'NOT_STARTED' as MilestoneStatus,
      dueDate: body.dueDate,
      completedAt: null,
      taskCount: 0,
      completedTaskCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: newMilestone }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/projects/${params.id}/milestones error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to create milestone' },
      { status: 500 }
    );
  }
}
