import { NextRequest, NextResponse } from 'next/server';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockBudget = {
  projectId: 'proj-001',
  allocated: 1200000,
  spent: 680000,
  committed: 150000,
  forecast: 1150000,
  remaining: 370000,
  utilizationPercent: 56.7,
  forecastVariance: -50000,
  forecastVariancePercent: -4.2,
  currency: 'USD',
  categories: [
    { name: 'Infrastructure', allocated: 400000, spent: 280000, forecast: 390000 },
    { name: 'Development', allocated: 500000, spent: 300000, forecast: 480000 },
    { name: 'Testing & QA', allocated: 150000, spent: 60000, forecast: 140000 },
    { name: 'Project Management', allocated: 100000, spent: 30000, forecast: 95000 },
    { name: 'Contingency', allocated: 50000, spent: 10000, forecast: 45000 },
  ],
  monthlySpend: [
    { month: '2025-11', amount: 45000 },
    { month: '2025-12', amount: 78000 },
    { month: '2026-01', amount: 125000 },
    { month: '2026-02', amount: 180000 },
    { month: '2026-03', amount: 252000 },
  ],
  updatedAt: '2026-03-28T00:00:00Z',
};

// ── GET /api/projects/[id]/budget ──────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Replace with Prisma query
    // const budget = await prisma.projectBudget.findUnique({
    //   where: { projectId: id },
    //   include: { categories: true, monthlySpend: true },
    // });

    return NextResponse.json({
      data: { ...mockBudget, projectId: id },
    });
  } catch (error) {
    console.error(`GET /api/projects/${params.id}/budget error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}

// ── PATCH /api/projects/[id]/budget ────────────────────────────────────
interface UpdateBudgetBody {
  allocated?: number;
  forecast?: number;
  categories?: Array<{
    name: string;
    allocated: number;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateBudgetBody = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { data: null, error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma update
    // const budget = await prisma.projectBudget.update({
    //   where: { projectId: id },
    //   data: body,
    // });

    const updated = {
      ...mockBudget,
      projectId: id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PATCH /api/projects/${params.id}/budget error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}
