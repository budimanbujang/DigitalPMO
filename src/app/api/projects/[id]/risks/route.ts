import { NextRequest, NextResponse } from 'next/server';
import type { RiskLevel, RiskStatus, Priority } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockRisks = [
  {
    id: 'risk-001',
    projectId: 'proj-001',
    title: 'Vendor delay on licensing',
    description: 'AWS Enterprise license agreement renewal may be delayed due to procurement review process.',
    level: 'HIGH' as RiskLevel,
    status: 'OPEN' as RiskStatus,
    probability: 70,
    impact: 'HIGH' as Priority,
    category: 'VENDOR',
    owner: 'Sarah Chen',
    ownerId: 'user-001',
    mitigationPlan: 'Engage alternative cloud provider for contingency. Fast-track procurement approval.',
    contingencyPlan: 'Temporarily use existing license tier with reduced capacity.',
    identifiedDate: '2026-02-15',
    reviewDate: '2026-04-01',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-03-28T00:00:00Z',
  },
  {
    id: 'risk-002',
    projectId: 'proj-001',
    title: 'Data integrity during migration',
    description: 'Risk of data loss or corruption during PostgreSQL to Aurora migration.',
    level: 'MEDIUM' as RiskLevel,
    status: 'MITIGATING' as RiskStatus,
    probability: 40,
    impact: 'CRITICAL' as Priority,
    category: 'TECHNICAL',
    owner: 'Priya Sharma',
    ownerId: 'user-006',
    mitigationPlan: 'Implement checksums and parallel validation queries on both databases during migration window.',
    contingencyPlan: 'Maintain hot standby of source database for 30 days post-migration.',
    identifiedDate: '2026-01-20',
    reviewDate: '2026-03-30',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-25T00:00:00Z',
  },
  {
    id: 'risk-003',
    projectId: 'proj-001',
    title: 'Key personnel departure',
    description: 'Lead cloud architect has indicated possible departure. Knowledge transfer incomplete.',
    level: 'HIGH' as RiskLevel,
    status: 'OPEN' as RiskStatus,
    probability: 30,
    impact: 'HIGH' as Priority,
    category: 'RESOURCE',
    owner: 'Sarah Chen',
    ownerId: 'user-001',
    mitigationPlan: 'Accelerate documentation and pair programming sessions. Identify backup resource.',
    contingencyPlan: 'Engage external consultant with equivalent AWS expertise.',
    identifiedDate: '2026-03-10',
    reviewDate: '2026-04-10',
    createdAt: '2026-03-10T00:00:00Z',
    updatedAt: '2026-03-20T00:00:00Z',
  },
];

// ── GET /api/projects/[id]/risks ──────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level') as RiskLevel | null;
    const status = searchParams.get('status') as RiskStatus | null;

    // TODO: Replace with Prisma query
    // const risks = await prisma.risk.findMany({
    //   where: { projectId: id, level, status },
    //   include: { owner: true },
    //   orderBy: [{ level: 'desc' }, { updatedAt: 'desc' }],
    // });

    let filtered = mockRisks.map((r) => ({ ...r, projectId: id }));

    if (level) filtered = filtered.filter((r) => r.level === level);
    if (status) filtered = filtered.filter((r) => r.status === status);

    return NextResponse.json({ data: filtered });
  } catch (error) {
    console.error(`GET /api/projects/${params.id}/risks error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch risks' },
      { status: 500 }
    );
  }
}

// ── POST /api/projects/[id]/risks ─────────────────────────────────────
interface CreateRiskBody {
  title: string;
  description?: string;
  level: RiskLevel;
  impact: Priority;
  probability: number;
  category: string;
  ownerId: string;
  mitigationPlan?: string;
  contingencyPlan?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: CreateRiskBody = await request.json();

    if (!body.title || !body.level || !body.impact || !body.ownerId) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: title, level, impact, ownerId' },
        { status: 400 }
      );
    }

    if (body.probability !== undefined && (body.probability < 0 || body.probability > 100)) {
      return NextResponse.json(
        { data: null, error: 'Probability must be between 0 and 100' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const risk = await prisma.risk.create({
    //   data: { ...body, projectId: id, status: 'OPEN' },
    // });

    const newRisk = {
      id: `risk-${Date.now()}`,
      projectId: id,
      title: body.title,
      description: body.description ?? '',
      level: body.level,
      status: 'OPEN' as RiskStatus,
      probability: body.probability ?? 50,
      impact: body.impact,
      category: body.category ?? 'GENERAL',
      owner: 'Assigned Owner',
      ownerId: body.ownerId,
      mitigationPlan: body.mitigationPlan ?? '',
      contingencyPlan: body.contingencyPlan ?? '',
      identifiedDate: new Date().toISOString().split('T')[0],
      reviewDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: newRisk }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/projects/${params.id}/risks error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to create risk' },
      { status: 500 }
    );
  }
}
