import { NextRequest, NextResponse } from 'next/server';
import type { MilestoneStatus } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockMilestone = {
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
};

// ── PATCH /api/milestones/[id] ────────────────────────────────────────
interface UpdateMilestoneBody {
  name?: string;
  description?: string;
  status?: MilestoneStatus;
  dueDate?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateMilestoneBody = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { data: null, error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma update
    // const milestone = await prisma.milestone.update({
    //   where: { id },
    //   data: {
    //     ...body,
    //     completedAt: body.status === 'COMPLETED' ? new Date() : undefined,
    //     updatedAt: new Date(),
    //   },
    // });

    const updated = {
      ...mockMilestone,
      id,
      ...body,
      completedAt: body.status === 'COMPLETED' ? new Date().toISOString() : mockMilestone.completedAt,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PATCH /api/milestones/${params.id} error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to update milestone' },
      { status: 500 }
    );
  }
}
