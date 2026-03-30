import { NextRequest, NextResponse } from 'next/server';
import type { PortfolioHealthScore } from '@/types';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockHealthScore: PortfolioHealthScore & {
  trend: { date: string; overall: number }[];
  projectScores: { projectId: string; projectName: string; score: number; trend: 'up' | 'down' | 'stable' }[];
} = {
  overall: 68,
  schedule: 62,
  budget: 71,
  scope: 75,
  risk: 58,
  team: 70,
  trend: [
    { date: '2026-03-24', overall: 71 },
    { date: '2026-03-25', overall: 70 },
    { date: '2026-03-26', overall: 69 },
    { date: '2026-03-27', overall: 69 },
    { date: '2026-03-28', overall: 68 },
    { date: '2026-03-29', overall: 67 },
    { date: '2026-03-30', overall: 68 },
  ],
  projectScores: [
    { projectId: 'proj-001', projectName: 'Cloud Migration Phase 2', score: 65, trend: 'down' },
    { projectId: 'proj-002', projectName: 'ERP Integration', score: 42, trend: 'down' },
    { projectId: 'proj-003', projectName: 'Customer Portal Redesign', score: 88, trend: 'stable' },
    { projectId: 'proj-004', projectName: 'Data Analytics Platform', score: 90, trend: 'stable' },
  ],
};

// ── GET /api/dashboard/health-score ───────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // TODO: Replace with calculated health score from Prisma data
    // Health score calculation would aggregate:
    // - Schedule: based on task completion rate vs planned, milestone adherence
    // - Budget: based on spend vs forecast vs allocation ratios
    // - Scope: based on scope change requests, unplanned work ratio
    // - Risk: based on open risk count weighted by severity
    // - Team: based on utilization rates, turnover, velocity trends

    if (projectId) {
      const projectScore = mockHealthScore.projectScores.find((p) => p.projectId === projectId);
      if (!projectScore) {
        return NextResponse.json(
          { data: null, error: 'Project not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        data: {
          projectId,
          projectName: projectScore.projectName,
          score: projectScore.score,
          trend: projectScore.trend,
          // TODO: Include per-project dimension breakdown
        },
      });
    }

    return NextResponse.json({ data: mockHealthScore });
  } catch (error) {
    console.error('GET /api/dashboard/health-score error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to fetch health score' },
      { status: 500 }
    );
  }
}
