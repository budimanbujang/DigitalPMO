import { NextRequest, NextResponse } from 'next/server';
import type { RiskLevel, RiskStatus, Priority } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockRisk = {
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
};

// ── PATCH /api/risks/[id] ─────────────────────────────────────────────
interface UpdateRiskBody {
  title?: string;
  description?: string;
  level?: RiskLevel;
  status?: RiskStatus;
  probability?: number;
  impact?: Priority;
  category?: string;
  ownerId?: string;
  mitigationPlan?: string;
  contingencyPlan?: string;
  reviewDate?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateRiskBody = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { data: null, error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    if (body.probability !== undefined && (body.probability < 0 || body.probability > 100)) {
      return NextResponse.json(
        { data: null, error: 'Probability must be between 0 and 100' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma update
    // const risk = await prisma.risk.update({
    //   where: { id },
    //   data: { ...body, updatedAt: new Date() },
    //   include: { owner: true, project: true },
    // });

    const updated = {
      ...mockRisk,
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PATCH /api/risks/${params.id} error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to update risk' },
      { status: 500 }
    );
  }
}
