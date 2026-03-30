import { NextRequest, NextResponse } from 'next/server';
import type { ChaseStatus, Priority } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockPendingChases = [
  {
    id: 'chase-001',
    taskId: 'task-004',
    taskTitle: 'Database schema migration scripts',
    projectId: 'proj-001',
    projectName: 'Cloud Migration Phase 2',
    recipientId: 'user-006',
    recipientName: 'Priya Sharma',
    status: 'PENDING' as ChaseStatus,
    priority: 'HIGH' as Priority,
    dueDate: '2026-03-20',
    daysSinceActivity: 12,
    escalationLevel: 1,
    chaseMessage: 'Hi Priya, the Database schema migration scripts task was due on March 20 and has had no activity for 12 days. Could you please provide a status update? This task is blocking the App Layer Migration milestone.',
    sentAt: '2026-03-28T09:00:00Z',
    expiresAt: '2026-04-01T09:00:00Z',
    milestoneName: 'App Layer Migration',
    milestoneDueDate: '2026-04-15',
    previousChases: [],
  },
  {
    id: 'chase-002',
    taskId: 'task-010',
    taskTitle: 'API gateway configuration',
    projectId: 'proj-002',
    projectName: 'ERP Integration',
    recipientId: 'user-008',
    recipientName: 'Alex Wong',
    status: 'PENDING' as ChaseStatus,
    priority: 'CRITICAL' as Priority,
    dueDate: '2026-03-25',
    daysSinceActivity: 8,
    escalationLevel: 2,
    chaseMessage: 'Hi Alex, this is a follow-up regarding the API gateway configuration task (due March 25). This is the second chase. The task is critical for the Data Migration Wave 1 milestone. Please respond with your status and any blockers.',
    sentAt: '2026-03-29T09:00:00Z',
    expiresAt: '2026-03-31T09:00:00Z',
    milestoneName: 'Data Migration Wave 1',
    milestoneDueDate: '2026-04-11',
    previousChases: [
      { sentAt: '2026-03-26T09:00:00Z', status: 'EXPIRED' as ChaseStatus },
    ],
  },
  {
    id: 'chase-003',
    taskId: 'task-015',
    taskTitle: 'Security audit remediation',
    projectId: 'proj-002',
    projectName: 'ERP Integration',
    recipientId: 'user-009',
    recipientName: 'Raj Patel',
    status: 'ESCALATED' as ChaseStatus,
    priority: 'CRITICAL' as Priority,
    dueDate: '2026-03-18',
    daysSinceActivity: 15,
    escalationLevel: 3,
    chaseMessage: 'ESCALATION: Security audit remediation task has been unresponsive for 15 days across 2 previous chase attempts. Escalating to project manager for intervention.',
    sentAt: '2026-03-30T06:00:00Z',
    expiresAt: '2026-04-02T06:00:00Z',
    milestoneName: 'Security Compliance',
    milestoneDueDate: '2026-04-08',
    previousChases: [
      { sentAt: '2026-03-22T09:00:00Z', status: 'EXPIRED' as ChaseStatus },
      { sentAt: '2026-03-26T09:00:00Z', status: 'EXPIRED' as ChaseStatus },
    ],
  },
];

// ── GET /api/chase/pending ────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status') as ChaseStatus | null;
    const escalationLevel = searchParams.get('escalationLevel');
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    // TODO: Replace with Prisma query
    // const chases = await prisma.chase.findMany({
    //   where: {
    //     status: status ?? { in: ['PENDING', 'ESCALATED'] },
    //     task: { projectId: projectId ?? undefined },
    //     escalationLevel: escalationLevel ? parseInt(escalationLevel) : undefined,
    //   },
    //   include: { task: { include: { project: true, assignee: true, milestone: true } } },
    //   orderBy: [{ escalationLevel: 'desc' }, { sentAt: 'desc' }],
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    let filtered = [...mockPendingChases];

    if (projectId) filtered = filtered.filter((c) => c.projectId === projectId);
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (escalationLevel) filtered = filtered.filter((c) => c.escalationLevel === parseInt(escalationLevel));

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        pendingCount: mockPendingChases.filter((c) => c.status === 'PENDING').length,
        escalatedCount: mockPendingChases.filter((c) => c.status === 'ESCALATED').length,
      },
    });
  } catch (error) {
    console.error('GET /api/chase/pending error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch pending chases' },
      { status: 500 }
    );
  }
}
