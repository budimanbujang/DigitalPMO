import { NextRequest, NextResponse } from 'next/server';
import type { ChaseStatus } from '@/types';

// ── POST /api/chase/[taskId]/respond ──────────────────────────────────
interface ChaseRespondBody {
  response: string;
  estimatedCompletionDate?: string;
  blockerDescription?: string;
  requestHelp?: boolean;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;
    const body: ChaseRespondBody = await request.json();

    if (!body.response || body.response.trim().length === 0) {
      return NextResponse.json(
        { data: null, error: 'Response text is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma update
    // const [chase, _task] = await prisma.$transaction([
    //   prisma.chase.update({
    //     where: { taskId, status: 'PENDING' },
    //     data: {
    //       status: 'RESPONDED',
    //       response: body.response,
    //       respondedAt: new Date(),
    //       estimatedCompletionDate: body.estimatedCompletionDate,
    //     },
    //   }),
    //   // Optionally update task with new estimated completion
    //   body.estimatedCompletionDate
    //     ? prisma.task.update({
    //         where: { id: taskId },
    //         data: { dueDate: body.estimatedCompletionDate },
    //       })
    //     : Promise.resolve(null),
    // ]);

    const chaseResponse = {
      id: `chase-resp-${Date.now()}`,
      taskId,
      status: 'RESPONDED' as ChaseStatus,
      response: body.response.trim(),
      respondedAt: new Date().toISOString(),
      respondedBy: 'user-005', // TODO: Get from session
      estimatedCompletionDate: body.estimatedCompletionDate ?? null,
      blockerDescription: body.blockerDescription ?? null,
      requestHelp: body.requestHelp ?? false,
    };

    // If help was requested, create a notification for the project manager
    // TODO: Create escalation notification
    // if (body.requestHelp) {
    //   await prisma.notification.create({
    //     data: {
    //       type: 'ESCALATION',
    //       title: `Help requested on task ${taskId}`,
    //       recipientId: project.managerId,
    //       ...
    //     },
    //   });
    // }

    return NextResponse.json({ data: chaseResponse });
  } catch (error) {
    console.error(`POST /api/chase/${params.taskId}/respond error:`, error);
    return NextResponse.json(
      { data: null, error: 'Failed to submit chase response' },
      { status: 500 }
    );
  }
}
