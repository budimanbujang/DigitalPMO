'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Plus, Sparkles, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProjectContext } from '@/components/project/project-context';
import { formatCurrency, calculateDaysRemaining } from '@/lib/utils';

function ragVariant(status: string) {
  switch (status) {
    case 'RED': return 'rag-red' as const;
    case 'AMBER': return 'rag-amber' as const;
    case 'GREEN': return 'rag-green' as const;
    default: return 'secondary' as const;
  }
}

function priorityLabel(rag: string) {
  switch (rag) {
    case 'RED': return 'Critical';
    case 'AMBER': return 'High';
    case 'GREEN': return 'Normal';
    default: return 'Normal';
  }
}

export function ProjectHeader() {
  const { project } = useProjectContext();
  const daysRemaining = calculateDaysRemaining(project.endDate);
  const budgetPercent = Math.round((project.budgetSpent / project.budgetAllocated) * 100);
  const budgetColor = budgetPercent > 90 ? '#EF4444' : budgetPercent > 70 ? '#F59E0B' : '#3B82F6';

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Main header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        {/* Left: Project info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-heading font-bold text-foreground">{project.name}</h1>
            <Badge variant={ragVariant(project.ragStatus)}>{project.ragStatus}</Badge>
            {project.aiFlagged && (
              <Badge variant="ai">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Flagged
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono">{project.code}</span>
            <span className="flex items-center gap-1">
              <Flag className="h-3.5 w-3.5" />
              {priorityLabel(project.ragStatus)}
            </span>
            <span>Owner: {project.owner}</span>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Update Status
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Sparkles className="h-4 w-4" />
            Run AI Analysis
          </Button>
        </div>
      </div>

      {/* Metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Progress ring */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="text-xs text-muted-foreground">Completion</div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-secondary" />
                <circle
                  cx="24" cy="24" r="20" fill="none" strokeWidth="4"
                  stroke={project.percentComplete === 100 ? '#22C55E' : '#3B82F6'}
                  strokeDasharray={`${(project.percentComplete / 100) * 125.6} 125.6`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                {project.percentComplete}%
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {project.completedTasks}/{project.totalTasks} tasks
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="text-xs text-muted-foreground">Budget</div>
          <div className="text-lg font-bold text-foreground">{budgetPercent}%</div>
          <Progress value={budgetPercent} color={budgetColor} />
          <div className="text-xs text-muted-foreground">
            {formatCurrency(project.budgetSpent)} / {formatCurrency(project.budgetAllocated)}
          </div>
        </div>

        {/* Days remaining */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="text-xs text-muted-foreground">Days Remaining</div>
          <div className={`text-lg font-bold ${daysRemaining < 0 ? 'text-red-500' : daysRemaining < 30 ? 'text-amber-500' : 'text-foreground'}`}>
            {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d`}
          </div>
          <div className="text-xs text-muted-foreground">
            End: {new Date(project.endDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Next milestone */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="text-xs text-muted-foreground">Next Milestone</div>
          <div className="text-sm font-semibold text-foreground truncate">{project.nextMilestone.name}</div>
          <div className={`text-xs font-medium ${project.nextMilestone.daysRemaining < 0 ? 'text-red-500' : project.nextMilestone.daysRemaining < 7 ? 'text-amber-500' : 'text-green-500'}`}>
            {project.nextMilestone.daysRemaining < 0
              ? `${Math.abs(project.nextMilestone.daysRemaining)}d overdue`
              : `${project.nextMilestone.daysRemaining}d remaining`}
          </div>
        </div>

        {/* Overdue tasks */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <div className="text-xs text-muted-foreground">Overdue Tasks</div>
          <div className={`text-lg font-bold ${project.overdueTasks > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {project.overdueTasks}
          </div>
          <div className="text-xs text-muted-foreground">
            of {project.totalTasks} total
          </div>
        </div>
      </div>
    </div>
  );
}
