'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { MockProject } from '@/lib/mock-data';

interface ProjectCardProps {
  project: MockProject;
}

function ragVariant(status: string) {
  switch (status) {
    case 'RED': return 'rag-red' as const;
    case 'AMBER': return 'rag-amber' as const;
    case 'GREEN': return 'rag-green' as const;
    default: return 'secondary' as const;
  }
}

function budgetColor(spent: number, allocated: number): string {
  const ratio = spent / allocated;
  if (ratio > 0.9) return '#EF4444';
  if (ratio > 0.7) return '#F59E0B';
  return '#3B82F6';
}

export function ProjectCard({ project }: ProjectCardProps) {
  const budgetPercent = Math.round((project.budgetSpent / project.budgetAllocated) * 100);
  const isCompleted = project.status === 'COMPLETED';

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-primary">
        <CardContent className="p-5 space-y-4">
          {/* Header: name + RAG + AI flag */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {project.name}
              </h3>
              <span className="text-xs text-muted-foreground">{project.code}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {project.aiFlagged && (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-violet-500/20"
                  title="AI risk flagged"
                />
              )}
              <Badge variant={ragVariant(project.ragStatus)}>
                {project.ragStatus}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{project.percentComplete}%</span>
            </div>
            <Progress
              value={project.percentComplete}
              color={isCompleted ? '#22C55E' : undefined}
            />
          </div>

          {/* Budget utilization */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Budget</span>
              <span className="font-medium text-foreground">{budgetPercent}%</span>
            </div>
            <Progress
              value={budgetPercent}
              color={budgetColor(project.budgetSpent, project.budgetAllocated)}
            />
          </div>

          {/* Footer row: milestone + overdue */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span className="truncate">Completed</span>
                </>
              ) : (
                <>
                  <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{project.nextMilestone.name}</span>
                  <span className="shrink-0 font-medium text-foreground">
                    {project.nextMilestone.daysRemaining}d
                  </span>
                </>
              )}
            </div>
            {project.overdueTasks > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {project.overdueTasks}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
