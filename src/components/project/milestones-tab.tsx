'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type MilestoneStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'AT_RISK';

interface Deliverable {
  id: string;
  name: string;
  completed: boolean;
}

interface MilestoneItem {
  id: string;
  name: string;
  dueDate: string;
  status: MilestoneStatus;
  deliverables: Deliverable[];
}

const statusConfig: Record<MilestoneStatus, { label: string; color: string; badgeClass: string }> = {
  NOT_STARTED: { label: 'Not Started', color: 'bg-slate-400', badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500', badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  DELAYED: { label: 'Delayed', color: 'bg-red-500', badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  AT_RISK: { label: 'At Risk', color: 'bg-amber-500', badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

const mockMilestones: MilestoneItem[] = [
  {
    id: 'ms-1',
    name: 'Project Kickoff & Planning',
    dueDate: '2026-01-15',
    status: 'COMPLETED',
    deliverables: [
      { id: 'd1-1', name: 'Project charter signed', completed: true },
      { id: 'd1-2', name: 'Stakeholder analysis document', completed: true },
      { id: 'd1-3', name: 'Resource allocation plan', completed: true },
    ],
  },
  {
    id: 'ms-2',
    name: 'Requirements & Design',
    dueDate: '2026-02-28',
    status: 'COMPLETED',
    deliverables: [
      { id: 'd2-1', name: 'Business requirements document', completed: true },
      { id: 'd2-2', name: 'Technical architecture design', completed: true },
      { id: 'd2-3', name: 'UI/UX wireframes approved', completed: true },
      { id: 'd2-4', name: 'Data model specification', completed: true },
    ],
  },
  {
    id: 'ms-3',
    name: 'Core Development Sprint',
    dueDate: '2026-04-15',
    status: 'IN_PROGRESS',
    deliverables: [
      { id: 'd3-1', name: 'Backend API modules completed', completed: true },
      { id: 'd3-2', name: 'Frontend application shell', completed: true },
      { id: 'd3-3', name: 'Database migration scripts', completed: false },
      { id: 'd3-4', name: 'Integration with legacy systems', completed: false },
    ],
  },
  {
    id: 'ms-4',
    name: 'User Acceptance Testing',
    dueDate: '2026-05-30',
    status: 'AT_RISK',
    deliverables: [
      { id: 'd4-1', name: 'Test plan and test cases', completed: true },
      { id: 'd4-2', name: 'UAT environment setup', completed: false },
      { id: 'd4-3', name: 'UAT execution and sign-off', completed: false },
    ],
  },
  {
    id: 'ms-5',
    name: 'Production Deployment & Go-Live',
    dueDate: '2026-06-30',
    status: 'NOT_STARTED',
    deliverables: [
      { id: 'd5-1', name: 'Deployment runbook', completed: false },
      { id: 'd5-2', name: 'Production environment ready', completed: false },
      { id: 'd5-3', name: 'Go-live checklist completed', completed: false },
      { id: 'd5-4', name: 'Post-deployment verification', completed: false },
    ],
  },
];

export function MilestonesTab() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['ms-3']));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-0">
      {mockMilestones.map((ms, idx) => {
        const completedCount = ms.deliverables.filter((d) => d.completed).length;
        const totalCount = ms.deliverables.length;
        const progressPct = Math.round((completedCount / totalCount) * 100);
        const expanded = expandedIds.has(ms.id);
        const isLast = idx === mockMilestones.length - 1;
        const cfg = statusConfig[ms.status];

        return (
          <div key={ms.id} className="flex gap-4">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div className={cn('h-4 w-4 rounded-full shrink-0 ring-4 ring-background', cfg.color)} />
              {!isLast && <div className="w-0.5 flex-1 bg-border" />}
            </div>

            {/* Content */}
            <div className={cn('flex-1 pb-8', isLast && 'pb-0')}>
              <button
                onClick={() => toggleExpand(ms.id)}
                className="w-full text-left rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {expanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-foreground">{ms.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">Due: {ms.dueDate}</span>
                        <Badge className={cn('text-[10px] px-1.5 py-0 border-0', cfg.badgeClass)}>
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium text-foreground">{completedCount}/{totalCount}</div>
                    <div className="text-[10px] text-muted-foreground">deliverables</div>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={progressPct} className="h-2" />
                  <div className="text-[10px] text-muted-foreground mt-1">{progressPct}% complete</div>
                </div>
              </button>

              {/* Expanded deliverables checklist */}
              {expanded && (
                <div className="mt-2 ml-6 space-y-1.5">
                  {ms.deliverables.map((d) => (
                    <div key={d.id} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/30">
                      {d.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={cn(
                        'text-sm',
                        d.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                      )}>
                        {d.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
