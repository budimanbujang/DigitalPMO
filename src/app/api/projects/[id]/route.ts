import { NextRequest, NextResponse } from 'next/server';
import type { ProjectStatus, Priority, RAGStatus } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockProjectDetail = {
  id: 'proj-001',
  name: 'Cloud Migration Phase 2',
  description: 'Migrate remaining on-prem services to AWS including database tier, application layer, and monitoring infrastructure.',
  status: 'IN_PROGRESS' as ProjectStatus,
  priority: 'HIGH' as Priority,
  ragStatus: 'AMBER' as RAGStatus,
  percentComplete: 62,
  startDate: '2025-11-01',
  targetEndDate: '2026-06-30',
  budgetAllocated: 1200000,
  budgetSpent: 680000,
  budgetForecast: 1150000,
  managerId: 'user-001',
  managerName: 'Sarah Chen',
  teamSize: 14,
  overdueTasks: 3,
  totalTasks: 48,
  completedTasks: 28,
  createdAt: '2025-10-15T00:00:00Z',
  updatedAt: '2026-03-28T00:00:00Z',
  team: [
    { id: 'user-001', name: 'Sarah Chen', role: 'PROJECT_MANAGER', avatar: null },
    { id: 'user-005', name: 'Mike Johnson', role: 'MEMBER', avatar: null },
    { id: 'user-006', name: 'Priya Sharma', role: 'MEMBER', avatar: null },
  ],
  recentMilestones: [
    { id: 'ms-001', name: 'Database Migration Complete', status: 'COMPLETED', dueDate: '2026-02-28' },
    { id: 'ms-002', name: 'App Layer Migration', status: 'IN_PROGRESS', dueDate: '2026-04-15' },
  ],
  topRisks: [
    { id: 'risk-001', title: 'Vendor delay on licensing', level: 'HIGH', status: 'OPEN' },
    { id: 'risk-002', title: 'Data integrity during migration', level: 'MEDIUM', status: 'MITIGATING' },
  ],
};

// ── GET /api/projects/[id] ─────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Replace with Prisma query
    // const project = await prisma.project.findUnique({
    //   where: { id },
    //   include: { manager: true, team: true, milestones: true, risks: true },
    // });

    if (id !== mockProjectDetail.id && !id.startsWith('proj-')) {
      return NextResponse.json(
        { data: null, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { ...mockProjectDetail, id } });
  } catch (error) {
    console.error(`GET /api/projects/${params.id} error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// ── PATCH /api/projects/[id] ───────────────────────────────────────────
interface UpdateProjectBody {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  ragStatus?: RAGStatus;
  targetEndDate?: string;
  budgetAllocated?: number;
  budgetForecast?: number;
  managerId?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateProjectBody = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { data: null, error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma update
    // const project = await prisma.project.update({
    //   where: { id },
    //   data: { ...body, updatedAt: new Date() },
    // });

    const updated = {
      ...mockProjectDetail,
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PATCH /api/projects/${params.id} error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// ── DELETE /api/projects/[id] (archive, not hard-delete) ───────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Replace with Prisma soft-delete / archive
    // const project = await prisma.project.update({
    //   where: { id },
    //   data: { status: 'CANCELLED', archivedAt: new Date() },
    // });

    return NextResponse.json({
      data: { id, status: 'CANCELLED', archivedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error(`DELETE /api/projects/${params.id} error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to archive project' },
      { status: 500 }
    );
  }
}
