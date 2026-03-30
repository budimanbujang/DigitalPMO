import { NextRequest, NextResponse } from 'next/server';
import type { ProjectStatus, Priority, RAGStatus } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockProjects = [
  {
    id: 'proj-001',
    name: 'Cloud Migration Phase 2',
    description: 'Migrate remaining on-prem services to AWS',
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
  },
  {
    id: 'proj-002',
    name: 'ERP Integration',
    description: 'SAP S/4HANA integration with internal systems',
    status: 'AT_RISK' as ProjectStatus,
    priority: 'CRITICAL' as Priority,
    ragStatus: 'RED' as RAGStatus,
    percentComplete: 35,
    startDate: '2025-12-01',
    targetEndDate: '2026-08-31',
    budgetAllocated: 2500000,
    budgetSpent: 1100000,
    budgetForecast: 2800000,
    managerId: 'user-002',
    managerName: 'James Rodriguez',
    teamSize: 22,
    overdueTasks: 8,
    totalTasks: 76,
    completedTasks: 20,
    createdAt: '2025-11-20T00:00:00Z',
    updatedAt: '2026-03-29T00:00:00Z',
  },
  {
    id: 'proj-003',
    name: 'Customer Portal Redesign',
    description: 'Complete UX overhaul of the customer-facing portal',
    status: 'IN_PROGRESS' as ProjectStatus,
    priority: 'MEDIUM' as Priority,
    ragStatus: 'GREEN' as RAGStatus,
    percentComplete: 78,
    startDate: '2025-09-15',
    targetEndDate: '2026-04-30',
    budgetAllocated: 600000,
    budgetSpent: 440000,
    budgetForecast: 580000,
    managerId: 'user-003',
    managerName: 'Aisha Patel',
    teamSize: 8,
    overdueTasks: 0,
    totalTasks: 32,
    completedTasks: 25,
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2026-03-27T00:00:00Z',
  },
  {
    id: 'proj-004',
    name: 'Data Analytics Platform',
    description: 'Build centralized data lake and BI dashboards',
    status: 'PLANNING' as ProjectStatus,
    priority: 'HIGH' as Priority,
    ragStatus: 'GREEN' as RAGStatus,
    percentComplete: 5,
    startDate: '2026-04-01',
    targetEndDate: '2026-12-31',
    budgetAllocated: 900000,
    budgetSpent: 25000,
    budgetForecast: 900000,
    managerId: 'user-004',
    managerName: 'Tom Nakamura',
    teamSize: 6,
    overdueTasks: 0,
    totalTasks: 12,
    completedTasks: 0,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-03-25T00:00:00Z',
  },
];

// ── GET /api/projects ──────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ProjectStatus | null;
    const priority = searchParams.get('priority') as Priority | null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    // TODO: Replace with Prisma query
    // const projects = await prisma.project.findMany({
    //   where: { status, priority, name: { contains: search } },
    //   include: { manager: true },
    //   orderBy: { updatedAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });

    let filtered = [...mockProjects];

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (priority) {
      filtered = filtered.filter((p) => p.priority === priority);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      data: paginated,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// ── POST /api/projects ─────────────────────────────────────────────────
interface CreateProjectBody {
  name: string;
  description?: string;
  priority: Priority;
  startDate: string;
  targetEndDate: string;
  budgetAllocated: number;
  managerId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectBody = await request.json();

    if (!body.name || !body.priority || !body.startDate || !body.targetEndDate || !body.managerId) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: name, priority, startDate, targetEndDate, managerId' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const project = await prisma.project.create({ data: body });

    const newProject = {
      id: `proj-${Date.now()}`,
      name: body.name,
      description: body.description ?? '',
      status: 'PLANNING' as ProjectStatus,
      priority: body.priority,
      ragStatus: 'GREEN' as RAGStatus,
      percentComplete: 0,
      startDate: body.startDate,
      targetEndDate: body.targetEndDate,
      budgetAllocated: body.budgetAllocated ?? 0,
      budgetSpent: 0,
      budgetForecast: body.budgetAllocated ?? 0,
      managerId: body.managerId,
      managerName: 'Assigned Manager',
      teamSize: 0,
      overdueTasks: 0,
      totalTasks: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: newProject }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
