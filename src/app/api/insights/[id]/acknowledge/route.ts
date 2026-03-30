import { NextRequest, NextResponse } from 'next/server';

// ── POST /api/insights/[id]/acknowledge ───────────────────────────────
interface AcknowledgeBody {
  notes?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: AcknowledgeBody = await request.json().catch(() => ({}));

    // TODO: Replace with Prisma update
    // const insight = await prisma.aiInsight.update({
    //   where: { id },
    //   data: {
    //     acknowledged: true,
    //     acknowledgedAt: new Date(),
    //     acknowledgedBy: session.user.id,
    //     acknowledgeNotes: body.notes,
    //   },
    // });

    const acknowledged = {
      id,
      acknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: 'user-001', // TODO: Get from session
      notes: body.notes ?? null,
    };

    return NextResponse.json({ data: acknowledged });
  } catch (error) {
    console.error(`POST /api/insights/${params.id}/acknowledge error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to acknowledge insight' },
      { status: 500 }
    );
  }
}
