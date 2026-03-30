import { NextRequest, NextResponse } from 'next/server';
import type { RAGStatus } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockStatusUpdates = [
  {
    id: 'su-001',
    projectId: 'proj-001',
    authorId: 'user-001',
    authorName: 'Sarah Chen',
    ragStatus: 'AMBER' as RAGStatus,
    summary: 'Database migration completed on schedule. App layer migration underway but facing auth service complexity. Vendor licensing risk flagged.',
    accomplishments: [
      'Completed Aurora migration for all 12 databases',
      'Set up CI/CD pipeline for ECS deployments',
      'Onboarded 2 new team members',
    ],
    plannedActivities: [
      'Complete auth service migration by April 1',
      'Begin monitoring dashboard reconfiguration',
      'Conduct vendor risk review meeting',
    ],
    blockers: [
      'AWS license procurement pending finance approval',
      'Database schema migration scripts blocked by legacy constraint discovery',
    ],
    periodStart: '2026-03-18',
    periodEnd: '2026-03-28',
    createdAt: '2026-03-28T14:00:00Z',
  },
  {
    id: 'su-002',
    projectId: 'proj-001',
    authorId: 'user-001',
    authorName: 'Sarah Chen',
    ragStatus: 'GREEN' as RAGStatus,
    summary: 'Good progress on database migration. All staging environments validated. Team velocity stable.',
    accomplishments: [
      'Migrated 8 of 12 databases to Aurora',
      'Completed load testing on migrated services',
    ],
    plannedActivities: [
      'Complete remaining 4 database migrations',
      'Begin application layer migration planning',
    ],
    blockers: [],
    periodStart: '2026-03-04',
    periodEnd: '2026-03-17',
    createdAt: '2026-03-17T16:00:00Z',
  },
];

// ── GET /api/projects/[id]/status-updates ─────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    // TODO: Replace with Prisma query
    // const updates = await prisma.statusUpdate.findMany({
    //   where: { projectId: id },
    //   include: { author: true },
    //   orderBy: { createdAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    const data = mockStatusUpdates.map((u) => ({ ...u, projectId: id }));
    const total = data.length;
    const paginated = data.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error(`GET /api/projects/${params.id}/status-updates error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch status updates' },
      { status: 500 }
    );
  }
}

// ── POST /api/projects/[id]/status-updates ────────────────────────────
interface CreateStatusUpdateBody {
  ragStatus: RAGStatus;
  summary: string;
  accomplishments?: string[];
  plannedActivities?: string[];
  blockers?: string[];
  periodStart: string;
  periodEnd: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: CreateStatusUpdateBody = await request.json();

    if (!body.ragStatus || !body.summary || !body.periodStart || !body.periodEnd) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: ragStatus, summary, periodStart, periodEnd' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create + update project RAG status
    // const [update, _project] = await prisma.$transaction([
    //   prisma.statusUpdate.create({ data: { ...body, projectId: id, authorId: session.user.id } }),
    //   prisma.project.update({ where: { id }, data: { ragStatus: body.ragStatus } }),
    // ]);

    const newUpdate = {
      id: `su-${Date.now()}`,
      projectId: id,
      authorId: 'user-001', // TODO: Get from session
      authorName: 'Current User',
      ragStatus: body.ragStatus,
      summary: body.summary,
      accomplishments: body.accomplishments ?? [],
      plannedActivities: body.plannedActivities ?? [],
      blockers: body.blockers ?? [],
      periodStart: body.periodStart,
      periodEnd: body.periodEnd,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: newUpdate }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/projects/${params.id}/status-updates error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to create status update' },
      { status: 500 }
    );
  }
}
