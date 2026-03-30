import { NextRequest, NextResponse } from 'next/server';

// ── POST /api/tasks/[id]/comments ─────────────────────────────────────
interface CreateCommentBody {
  content: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: taskId } = params;
    const body: CreateCommentBody = await request.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { data: null, error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (body.content.length > 5000) {
      return NextResponse.json(
        { data: null, error: 'Comment content must be 5000 characters or less' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma create
    // const comment = await prisma.taskComment.create({
    //   data: {
    //     taskId,
    //     authorId: session.user.id,
    //     content: body.content,
    //   },
    //   include: { author: true },
    // });

    const newComment = {
      id: `cmt-${Date.now()}`,
      taskId,
      authorId: 'user-001', // TODO: Get from session
      authorName: 'Current User',
      content: body.content.trim(),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: newComment }, { status: 201 });
  } catch (error) {
    console.error(`POST /api/tasks/${params.id}/comments error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
