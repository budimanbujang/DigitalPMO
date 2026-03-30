'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ItemStatus = 'COMPLETED' | 'IN_PROGRESS' | 'BLOCKED' | 'TODO';

interface TimelineItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: ItemStatus;
  percentComplete: number;
  type: 'task' | 'milestone';
}

const statusColor: Record<ItemStatus, string> = {
  COMPLETED: 'bg-green-500',
  IN_PROGRESS: 'bg-blue-500',
  BLOCKED: 'bg-red-500',
  TODO: 'bg-slate-400 dark:bg-slate-600',
};

const statusFillColor: Record<ItemStatus, string> = {
  COMPLETED: 'bg-green-600',
  IN_PROGRESS: 'bg-blue-600',
  BLOCKED: 'bg-red-600',
  TODO: 'bg-slate-500',
};

const MOCK_ITEMS: TimelineItem[] = [
  { id: 'tl1', name: 'Project Kickoff & Planning', startDate: '2026-01-05', endDate: '2026-01-31', status: 'COMPLETED', percentComplete: 100, type: 'milestone' },
  { id: 'tl2', name: 'Requirements Gathering', startDate: '2026-01-15', endDate: '2026-02-15', status: 'COMPLETED', percentComplete: 100, type: 'task' },
  { id: 'tl3', name: 'Architecture Design', startDate: '2026-02-01', endDate: '2026-02-28', status: 'COMPLETED', percentComplete: 100, type: 'task' },
  { id: 'tl4', name: 'Backend API Development', startDate: '2026-02-15', endDate: '2026-04-15', status: 'IN_PROGRESS', percentComplete: 65, type: 'task' },
  { id: 'tl5', name: 'Frontend Development', startDate: '2026-03-01', endDate: '2026-04-30', status: 'IN_PROGRESS', percentComplete: 40, type: 'task' },
  { id: 'tl6', name: 'Database Migration', startDate: '2026-03-15', endDate: '2026-04-15', status: 'BLOCKED', percentComplete: 20, type: 'task' },
  { id: 'tl7', name: 'Integration Testing', startDate: '2026-04-01', endDate: '2026-05-15', status: 'TODO', percentComplete: 0, type: 'task' },
  { id: 'tl8', name: 'UAT Preparation', startDate: '2026-05-01', endDate: '2026-05-30', status: 'TODO', percentComplete: 0, type: 'milestone' },
  { id: 'tl9', name: 'Security Audit', startDate: '2026-05-15', endDate: '2026-06-15', status: 'TODO', percentComplete: 0, type: 'task' },
  { id: 'tl10', name: 'Go-Live Deployment', startDate: '2026-06-15', endDate: '2026-06-30', status: 'TODO', percentComplete: 0, type: 'milestone' },
];

const MONTHS = [
  { label: 'Jan 2026', start: new Date(2026, 0, 1) },
  { label: 'Feb 2026', start: new Date(2026, 1, 1) },
  { label: 'Mar 2026', start: new Date(2026, 2, 1) },
  { label: 'Apr 2026', start: new Date(2026, 3, 1) },
  { label: 'May 2026', start: new Date(2026, 4, 1) },
  { label: 'Jun 2026', start: new Date(2026, 5, 1) },
];

const RANGE_START = new Date(2026, 0, 1);
const RANGE_END = new Date(2026, 6, 1);
const TOTAL_DAYS = Math.ceil((RANGE_END.getTime() - RANGE_START.getTime()) / (1000 * 60 * 60 * 24));

function dateToPct(dateStr: string): number {
  const d = new Date(dateStr);
  const daysSinceStart = Math.ceil((d.getTime() - RANGE_START.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(100, (daysSinceStart / TOTAL_DAYS) * 100));
}

function todayPct(): number {
  const now = new Date();
  const daysSinceStart = Math.ceil((now.getTime() - RANGE_START.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(100, (daysSinceStart / TOTAL_DAYS) * 100));
}

export function TimelineTab() {
  const today = todayPct();

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1.5"><div className="h-2.5 w-6 rounded bg-green-500" /> Completed</div>
        <div className="flex items-center gap-1.5"><div className="h-2.5 w-6 rounded bg-blue-500" /> In Progress</div>
        <div className="flex items-center gap-1.5"><div className="h-2.5 w-6 rounded bg-red-500" /> Blocked</div>
        <div className="flex items-center gap-1.5"><div className="h-2.5 w-6 rounded bg-slate-400 dark:bg-slate-600" /> Todo</div>
        <div className="flex items-center gap-1.5"><div className="h-4 w-0 border-l-2 border-dashed border-red-500" /> Today</div>
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Month headers */}
          <div className="flex border-b border-border bg-muted/40">
            <div className="w-52 shrink-0 px-4 py-2 text-xs font-medium text-muted-foreground border-r border-border">
              Item
            </div>
            <div className="flex-1 relative flex">
              {MONTHS.map((m, idx) => {
                const startPct = dateToPct(m.start.toISOString());
                const nextStart = idx < MONTHS.length - 1
                  ? dateToPct(MONTHS[idx + 1].start.toISOString())
                  : 100;
                const widthPct = nextStart - startPct;
                return (
                  <div
                    key={m.label}
                    className="text-xs font-medium text-muted-foreground py-2 text-center border-r border-border last:border-r-0"
                    style={{ width: `${widthPct}%` }}
                  >
                    {m.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rows */}
          <div className="relative">
            {/* Today marker */}
            <div
              className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500 z-10 pointer-events-none"
              style={{ left: `calc(13rem + (100% - 13rem) * ${today / 100})` }}
            />

            {MOCK_ITEMS.map((item) => {
              const leftPct = dateToPct(item.startDate);
              const rightPct = dateToPct(item.endDate);
              const widthPct = Math.max(rightPct - leftPct, 1);

              return (
                <div key={item.id} className="flex items-center border-b border-border last:border-b-0 hover:bg-muted/20">
                  <div className="w-52 shrink-0 px-4 py-3 border-r border-border">
                    <div className="text-sm font-medium text-foreground truncate">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {item.startDate} &mdash; {item.endDate}
                    </div>
                  </div>
                  <div className="flex-1 relative h-10 px-1">
                    <div
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-6 rounded-md overflow-hidden flex items-center',
                        statusColor[item.status],
                        item.type === 'milestone' && 'border-2 border-foreground/20'
                      )}
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                      }}
                    >
                      {/* Progress fill inside bar */}
                      {item.percentComplete > 0 && item.percentComplete < 100 && (
                        <div
                          className={cn('absolute inset-y-0 left-0', statusFillColor[item.status])}
                          style={{ width: `${item.percentComplete}%` }}
                        />
                      )}
                      <span className="relative z-10 text-[10px] text-white font-medium px-1.5 truncate">
                        {item.percentComplete}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
