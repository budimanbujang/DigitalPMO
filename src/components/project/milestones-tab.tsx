'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

const statusConfig: Record<MilestoneStatus, { label: string; dotColor: string; badgeBg: string; badgeText: string }> = {
  NOT_STARTED: { label: 'Not Started', dotColor: '#94a3b8', badgeBg: '#f1f5f9', badgeText: '#475569' },
  IN_PROGRESS: { label: 'In Progress', dotColor: '#3B82F6', badgeBg: '#dbeafe', badgeText: '#1d4ed8' },
  COMPLETED: { label: 'Completed', dotColor: '#22C55E', badgeBg: '#dcfce7', badgeText: '#15803d' },
  DELAYED: { label: 'Delayed', dotColor: '#EF4444', badgeBg: '#fee2e2', badgeText: '#b91c1c' },
  AT_RISK: { label: 'At Risk', dotColor: '#F59E0B', badgeBg: '#fef3c7', badgeText: '#b45309' },
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
              <div
                className="h-4 w-4 rounded-full shrink-0"
                style={{ backgroundColor: cfg.dotColor, boxShadow: `0 0 0 4px #ffffff` }}
              />
              {!isLast && <div className="w-0.5 flex-1" style={{ backgroundColor: '#e8e8ea' }} />}
            </div>

            {/* Content */}
            <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-8'}`}>
              <button
                onClick={() => toggleExpand(ms.id)}
                className="w-full text-left rounded-xl p-4 transition-shadow"
                style={{
                  backgroundColor: '#ffffff',
                  boxShadow: '0 12px 40px rgba(26,28,30,0.06)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,28,30,0.10)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,28,30,0.06)'; }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {expanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0" style={{ color: '#74777f' }} />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" style={{ color: '#74777f' }} />
                    )}
                    <div>
                      <div className="text-sm font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#1a1c1e' }}>{ms.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs" style={{ color: '#74777f' }}>Due: {ms.dueDate}</span>
                        <span
                          className="text-[10px] px-1.5 py-0 rounded-full font-medium"
                          style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#1a1c1e' }}>{completedCount}/{totalCount}</div>
                    <div className="text-[10px]" style={{ color: '#74777f' }}>deliverables</div>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={progressPct} className="h-2" />
                  <div className="text-[10px] mt-1" style={{ color: '#74777f' }}>{progressPct}% complete</div>
                </div>
              </button>

              {/* Expanded deliverables checklist */}
              {expanded && (
                <div className="mt-2 ml-6 space-y-1.5">
                  {ms.deliverables.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md"
                      style={{ backgroundColor: '#f9f9fc' }}
                    >
                      {d.completed ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#22C55E' }} />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0" style={{ color: '#74777f' }} />
                      )}
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          color: d.completed ? '#74777f' : '#1a1c1e',
                          textDecoration: d.completed ? 'line-through' : 'none',
                        }}
                      >
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
