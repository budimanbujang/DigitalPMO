import { NextRequest, NextResponse } from 'next/server';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockWorkload = [
  {
    id: 'user-001',
    name: 'Sarah Chen',
    role: 'PROJECT_MANAGER',
    email: 'sarah.chen@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 38,
    utilizationPercent: 95,
    status: 'optimal' as const,
    projects: [
      { projectId: 'proj-001', projectName: 'Cloud Migration Phase 2', role: 'PM', hoursPerWeek: 30 },
      { projectId: 'proj-004', projectName: 'Data Analytics Platform', role: 'Advisor', hoursPerWeek: 8 },
    ],
    activeTasks: 5,
    overdueTasks: 0,
  },
  {
    id: 'user-005',
    name: 'Mike Johnson',
    role: 'MEMBER',
    email: 'mike.johnson@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 66,
    utilizationPercent: 165,
    status: 'over-allocated' as const,
    projects: [
      { projectId: 'proj-001', projectName: 'Cloud Migration Phase 2', role: 'DevOps Lead', hoursPerWeek: 32 },
      { projectId: 'proj-002', projectName: 'ERP Integration', role: 'Infrastructure', hoursPerWeek: 20 },
      { projectId: 'proj-004', projectName: 'Data Analytics Platform', role: 'Infra Setup', hoursPerWeek: 14 },
    ],
    activeTasks: 12,
    overdueTasks: 2,
  },
  {
    id: 'user-006',
    name: 'Priya Sharma',
    role: 'MEMBER',
    email: 'priya.sharma@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 62,
    utilizationPercent: 155,
    status: 'over-allocated' as const,
    projects: [
      { projectId: 'proj-001', projectName: 'Cloud Migration Phase 2', role: 'Backend Developer', hoursPerWeek: 36 },
      { projectId: 'proj-002', projectName: 'ERP Integration', role: 'Data Engineer', hoursPerWeek: 26 },
    ],
    activeTasks: 8,
    overdueTasks: 1,
  },
  {
    id: 'user-002',
    name: 'James Rodriguez',
    role: 'PROJECT_MANAGER',
    email: 'james.rodriguez@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 42,
    utilizationPercent: 105,
    status: 'optimal' as const,
    projects: [
      { projectId: 'proj-002', projectName: 'ERP Integration', role: 'PM', hoursPerWeek: 42 },
    ],
    activeTasks: 6,
    overdueTasks: 0,
  },
  {
    id: 'user-003',
    name: 'Aisha Patel',
    role: 'PROJECT_MANAGER',
    email: 'aisha.patel@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 35,
    utilizationPercent: 87,
    status: 'optimal' as const,
    projects: [
      { projectId: 'proj-003', projectName: 'Customer Portal Redesign', role: 'PM', hoursPerWeek: 35 },
    ],
    activeTasks: 4,
    overdueTasks: 0,
  },
  {
    id: 'user-008',
    name: 'Alex Wong',
    role: 'MEMBER',
    email: 'alex.wong@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 60,
    utilizationPercent: 150,
    status: 'over-allocated' as const,
    projects: [
      { projectId: 'proj-002', projectName: 'ERP Integration', role: 'Full Stack Developer', hoursPerWeek: 36 },
      { projectId: 'proj-003', projectName: 'Customer Portal Redesign', role: 'Frontend Developer', hoursPerWeek: 24 },
    ],
    activeTasks: 10,
    overdueTasks: 3,
  },
  {
    id: 'user-009',
    name: 'Raj Patel',
    role: 'MEMBER',
    email: 'raj.patel@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 18,
    utilizationPercent: 45,
    status: 'under-utilized' as const,
    projects: [
      { projectId: 'proj-002', projectName: 'ERP Integration', role: 'Security Analyst', hoursPerWeek: 18 },
    ],
    activeTasks: 2,
    overdueTasks: 1,
  },
  {
    id: 'user-004',
    name: 'Tom Nakamura',
    role: 'PROJECT_MANAGER',
    email: 'tom.nakamura@jcorp.com',
    avatar: null,
    allocatedHoursPerWeek: 40,
    currentHoursPerWeek: 20,
    utilizationPercent: 50,
    status: 'under-utilized' as const,
    projects: [
      { projectId: 'proj-004', projectName: 'Data Analytics Platform', role: 'PM', hoursPerWeek: 20 },
    ],
    activeTasks: 3,
    overdueTasks: 0,
  },
];

// ── GET /api/people/workload ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status'); // over-allocated, under-utilized, optimal
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    // TODO: Replace with Prisma query
    // const workload = await prisma.user.findMany({
    //   include: {
    //     projectAssignments: { include: { project: true } },
    //     tasks: { where: { status: { not: 'COMPLETED' } } },
    //   },
    //   where: {
    //     projectAssignments: projectId ? { some: { projectId } } : undefined,
    //   },
    // });

    let filtered = [...mockWorkload];

    if (projectId) {
      filtered = filtered.filter((w) =>
        w.projects.some((p) => p.projectId === projectId)
      );
    }
    if (status) {
      filtered = filtered.filter((w) => w.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (w) => w.name.toLowerCase().includes(q) || w.email.toLowerCase().includes(q)
      );
    }

    // Sort: over-allocated first, then by utilization descending
    filtered.sort((a, b) => {
      const statusOrder = { 'over-allocated': 0, 'optimal': 1, 'under-utilized': 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return b.utilizationPercent - a.utilizationPercent;
    });

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    const summary = {
      totalPeople: mockWorkload.length,
      overAllocated: mockWorkload.filter((w) => w.status === 'over-allocated').length,
      optimal: mockWorkload.filter((w) => w.status === 'optimal').length,
      underUtilized: mockWorkload.filter((w) => w.status === 'under-utilized').length,
      averageUtilization: Math.round(
        mockWorkload.reduce((sum, w) => sum + w.utilizationPercent, 0) / mockWorkload.length
      ),
    };

    return NextResponse.json({
      data: paginated,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit), summary },
    });
  } catch (error) {
    console.error('GET /api/people/workload error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch workload data' },
      { status: 500 }
    );
  }
}
