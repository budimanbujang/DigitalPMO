import { NextRequest, NextResponse } from 'next/server';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockAgentLogs = [
  {
    id: 'analysis-001',
    scope: 'portfolio',
    projectId: null,
    status: 'COMPLETED',
    insightsGenerated: 4,
    durationMs: 3200,
    model: 'claude-sonnet-4-20250514',
    triggeredBy: 'SCHEDULED',
    triggeredByUserId: null,
    startedAt: '2026-03-30T06:00:00Z',
    completedAt: '2026-03-30T06:00:03Z',
  },
  {
    id: 'analysis-002',
    scope: 'project',
    projectId: 'proj-002',
    status: 'COMPLETED',
    insightsGenerated: 3,
    durationMs: 2800,
    model: 'claude-sonnet-4-20250514',
    triggeredBy: 'MANUAL',
    triggeredByUserId: 'user-001',
    startedAt: '2026-03-29T14:30:00Z',
    completedAt: '2026-03-29T14:30:02Z',
  },
  {
    id: 'analysis-003',
    scope: 'portfolio',
    projectId: null,
    status: 'COMPLETED',
    insightsGenerated: 5,
    durationMs: 4100,
    model: 'claude-sonnet-4-20250514',
    triggeredBy: 'SCHEDULED',
    triggeredByUserId: null,
    startedAt: '2026-03-29T06:00:00Z',
    completedAt: '2026-03-29T06:00:04Z',
  },
  {
    id: 'analysis-004',
    scope: 'project',
    projectId: 'proj-001',
    status: 'FAILED',
    insightsGenerated: 0,
    durationMs: 1500,
    model: 'claude-sonnet-4-20250514',
    triggeredBy: 'MANUAL',
    triggeredByUserId: 'user-003',
    error: 'Rate limit exceeded. Retry after 60 seconds.',
    startedAt: '2026-03-28T16:45:00Z',
    completedAt: '2026-03-28T16:45:01Z',
  },
];

// ── GET /api/agent/logs ───────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    // TODO: Replace with Prisma query
    // const logs = await prisma.agentLog.findMany({
    //   where: { scope, projectId, status },
    //   orderBy: { startedAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    let filtered = [...mockAgentLogs];

    if (scope) filtered = filtered.filter((l) => l.scope === scope);
    if (projectId) filtered = filtered.filter((l) => l.projectId === projectId);
    if (status) filtered = filtered.filter((l) => l.status === status);

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/agent/logs error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch agent logs' },
      { status: 500 }
    );
  }
}
