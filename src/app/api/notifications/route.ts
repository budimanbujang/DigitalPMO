import { NextRequest, NextResponse } from 'next/server';
import type { NotificationType, Priority } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockNotifications = [
  {
    id: 'notif-001',
    type: 'TASK_OVERDUE' as NotificationType,
    title: 'Database schema migration scripts overdue',
    message: 'Task "Database schema migration scripts" in Cloud Migration was due March 20 and is now 10 days overdue.',
    severity: 'HIGH' as Priority,
    projectId: 'proj-001',
    projectName: 'Cloud Migration Phase 2',
    actionUrl: '/projects/proj-001/tasks?highlight=task-004',
    read: false,
    dismissed: false,
    recipientId: 'user-001',
    createdAt: '2026-03-30T06:00:00Z',
  },
  {
    id: 'notif-002',
    type: 'AI_INSIGHT' as NotificationType,
    title: 'New critical insight: ERP timeline risk',
    message: 'The AI agent has identified a critical timeline risk for ERP Integration. Review the insight for details and recommendations.',
    severity: 'CRITICAL' as Priority,
    projectId: 'proj-002',
    projectName: 'ERP Integration',
    actionUrl: '/insights?highlight=ins-001',
    read: false,
    dismissed: false,
    recipientId: 'user-001',
    createdAt: '2026-03-29T08:00:00Z',
  },
  {
    id: 'notif-003',
    type: 'MILESTONE_AT_RISK' as NotificationType,
    title: 'App Layer Migration milestone at risk',
    message: 'The App Layer Migration milestone (due April 15) has 10 incomplete tasks. Current velocity suggests a 2-week delay.',
    severity: 'HIGH' as Priority,
    projectId: 'proj-001',
    projectName: 'Cloud Migration Phase 2',
    actionUrl: '/projects/proj-001/milestones',
    read: false,
    dismissed: false,
    recipientId: 'user-001',
    createdAt: '2026-03-28T18:00:00Z',
  },
  {
    id: 'notif-004',
    type: 'BUDGET_ALERT' as NotificationType,
    title: 'ERP Integration budget forecast overrun',
    message: 'Budget forecast of $2.8M exceeds allocation of $2.5M by $300K (12%). Review budget breakdown.',
    severity: 'HIGH' as Priority,
    projectId: 'proj-002',
    projectName: 'ERP Integration',
    actionUrl: '/projects/proj-002/budget',
    read: true,
    dismissed: false,
    recipientId: 'user-001',
    createdAt: '2026-03-28T07:00:00Z',
  },
  {
    id: 'notif-005',
    type: 'CHASE_REQUEST' as NotificationType,
    title: 'Chase response received from Mike Johnson',
    message: 'Mike Johnson has responded to the automated chase for task "Update monitoring dashboards". He reports it will start next week.',
    severity: 'MEDIUM' as Priority,
    projectId: 'proj-001',
    projectName: 'Cloud Migration Phase 2',
    actionUrl: '/chase/pending',
    read: true,
    dismissed: false,
    recipientId: 'user-001',
    createdAt: '2026-03-27T14:00:00Z',
  },
  {
    id: 'notif-006',
    type: 'STATUS_UPDATE_DUE' as NotificationType,
    title: 'Weekly status update due tomorrow',
    message: 'Your weekly status update for Cloud Migration Phase 2 is due by end of day tomorrow.',
    severity: 'LOW' as Priority,
    projectId: 'proj-001',
    projectName: 'Cloud Migration Phase 2',
    actionUrl: '/projects/proj-001/status-updates/new',
    read: false,
    dismissed: false,
    recipientId: 'user-001',
    createdAt: '2026-03-27T09:00:00Z',
  },
];

// ── GET /api/notifications ────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as NotificationType | null;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    // TODO: Replace with Prisma query
    // const notifications = await prisma.notification.findMany({
    //   where: {
    //     recipientId: session.user.id,
    //     type: type ?? undefined,
    //     read: unreadOnly ? false : undefined,
    //     dismissed: false,
    //   },
    //   orderBy: { createdAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    let filtered = [...mockNotifications];

    if (type) filtered = filtered.filter((n) => n.type === type);
    if (unreadOnly) filtered = filtered.filter((n) => !n.read);

    const total = filtered.length;
    const unreadCount = mockNotifications.filter((n) => !n.read).length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), unreadCount },
    });
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
