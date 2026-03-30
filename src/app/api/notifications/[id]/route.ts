import { NextRequest, NextResponse } from 'next/server';

// ── PATCH /api/notifications/[id] ─────────────────────────────────────
interface UpdateNotificationBody {
  read?: boolean;
  dismissed?: boolean;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateNotificationBody = await request.json();

    if (body.read === undefined && body.dismissed === undefined) {
      return NextResponse.json(
        { data: null, error: 'Provide at least one field: read or dismissed' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma update
    // const notification = await prisma.notification.update({
    //   where: { id, recipientId: session.user.id },
    //   data: {
    //     read: body.read,
    //     dismissed: body.dismissed,
    //     readAt: body.read ? new Date() : undefined,
    //     dismissedAt: body.dismissed ? new Date() : undefined,
    //   },
    // });

    const updated = {
      id,
      read: body.read ?? false,
      dismissed: body.dismissed ?? false,
      readAt: body.read ? new Date().toISOString() : null,
      dismissedAt: body.dismissed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`PATCH /api/notifications/${params.id} error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
