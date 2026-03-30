'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
type InsightType = 'SCHEDULE_RISK' | 'BUDGET_ALERT' | 'RESOURCE_WARNING' | 'QUALITY_ISSUE' | 'OPPORTUNITY';

interface Insight {
  id: string;
  title: string;
  summary: string;
  details: string;
  severity: Severity;
  type: InsightType;
  recommendations: string[];
  timestamp: string;
  acknowledged: boolean;
}

const severityConfig: Record<Severity, { badgeVariant: 'rag-red' | 'rag-amber' | 'rag-green' | 'secondary'; color: string }> = {
  CRITICAL: { badgeVariant: 'rag-red', color: 'border-l-red-500' },
  HIGH: { badgeVariant: 'rag-amber', color: 'border-l-orange-500' },
  MEDIUM: { badgeVariant: 'secondary', color: 'border-l-yellow-500' },
  LOW: { badgeVariant: 'rag-green', color: 'border-l-blue-500' },
};

const typeLabels: Record<InsightType, string> = {
  SCHEDULE_RISK: 'Schedule Risk',
  BUDGET_ALERT: 'Budget Alert',
  RESOURCE_WARNING: 'Resource Warning',
  QUALITY_ISSUE: 'Quality Issue',
  OPPORTUNITY: 'Opportunity',
};

function relativeTime(ts: string): string {
  const now = new Date();
  const d = new Date(ts);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' });
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'ins1',
    title: 'Schedule slippage detected on Core Development Sprint',
    summary: 'Based on current velocity, the Core Development Sprint milestone is projected to miss its April 15 deadline by 8-12 days.',
    details: 'Analysis of task completion rates over the past 3 sprints shows a declining velocity trend. The team is completing an average of 6.2 story points per week versus the planned 9.5. Key blockers include the database migration dependency and pending IT approvals for firewall configuration.',
    severity: 'CRITICAL',
    type: 'SCHEDULE_RISK',
    recommendations: [
      'Escalate firewall configuration approval to IT Director',
      'Consider parallel-tracking the database migration with a temporary data bridge',
      'Reallocate 2 developers from documentation tasks to critical path items',
      'Schedule daily stand-ups for blocked items until resolved',
    ],
    timestamp: '2026-03-30T08:15:00Z',
    acknowledged: false,
  },
  {
    id: 'ins2',
    title: 'Budget overrun risk in Personnel and Consulting categories',
    summary: 'Personnel costs are 8.2% over budget and Consulting is 24% over budget. Combined overspend may exhaust contingency fund.',
    details: 'Personnel overspend is driven by overtime approvals for the blocked database migration work. Consulting overrun stems from additional API integration support needed from the vendor, which was not in the original scope. If trends continue, the contingency fund of RM 200K will be fully consumed by end of April.',
    severity: 'HIGH',
    type: 'BUDGET_ALERT',
    recommendations: [
      'Review and cap overtime approvals for the next 2 weeks',
      'Renegotiate consulting engagement to fixed-price for remaining deliverables',
      'Request additional budget allocation from PMO for Q2',
    ],
    timestamp: '2026-03-29T14:30:00Z',
    acknowledged: false,
  },
  {
    id: 'ins3',
    title: 'Resource overallocation detected for Lee Wei Ming',
    summary: 'Lee Wei Ming is assigned to 10 active tasks across 3 critical paths. Current utilization is at 100% with 2 overdue items.',
    details: 'Lee is the sole person with expertise in both the legacy system integration and the new database architecture. This creates a single point of failure risk. His task queue shows conflicting deadlines for the database migration script and the ERP integration testing.',
    severity: 'HIGH',
    type: 'RESOURCE_WARNING',
    recommendations: [
      'Redistribute 3 non-critical tasks to Tan Kai Lun or Farah Nadia',
      'Schedule knowledge transfer sessions for legacy system expertise',
      'Consider hiring a short-term contractor for database migration support',
    ],
    timestamp: '2026-03-29T10:00:00Z',
    acknowledged: true,
  },
  {
    id: 'ins4',
    title: 'Test coverage below threshold for API modules',
    summary: 'Automated test coverage for backend API modules has dropped to 62%, below the project threshold of 80%.',
    details: 'The rapid development pace in the past 2 sprints prioritized feature delivery over test writing. Modules with lowest coverage are: User Authentication (55%), Payment Processing (58%), and Notification Service (48%). This increases regression risk during the upcoming integration testing phase.',
    severity: 'MEDIUM',
    type: 'QUALITY_ISSUE',
    recommendations: [
      'Allocate dedicated testing sprint before integration testing begins',
      'Enforce code review policy requiring tests for all new PRs',
      'Prioritize test coverage for Payment Processing module due to compliance requirements',
    ],
    timestamp: '2026-03-28T16:45:00Z',
    acknowledged: false,
  },
  {
    id: 'ins5',
    title: 'Opportunity to accelerate UAT with automated regression suite',
    summary: 'Implementing an automated regression test suite now could reduce the planned UAT duration from 4 weeks to 2.5 weeks.',
    details: 'Analysis of the test plan shows that 40% of UAT test cases are regression scenarios that can be automated. Given the current schedule pressure, investing 2 weeks now in automation tooling could save 1.5 weeks during UAT, effectively recovering some of the projected schedule slippage.',
    severity: 'LOW',
    type: 'OPPORTUNITY',
    recommendations: [
      'Evaluate Cypress or Playwright for UAT automation framework',
      'Assign Farah Nadia to lead automation setup in parallel with current QA work',
      'Create automation backlog from existing UAT test case document',
    ],
    timestamp: '2026-03-28T09:00:00Z',
    acknowledged: false,
  },
];

export function InsightsTab() {
  const [insights, setInsights] = useState<Insight[]>(MOCK_INSIGHTS);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [analyzing, setAnalyzing] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAcknowledge = (id: string) => {
    setInsights((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, acknowledged: !ins.acknowledged } : ins))
    );
  };

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          AI Project Insights ({insights.length})
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={runAnalysis}
          disabled={analyzing}
          className="border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
        >
          <Sparkles className={cn('h-4 w-4 mr-1', analyzing && 'animate-spin')} />
          {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </Button>
      </div>

      <div className="space-y-3">
        {insights.map((ins) => {
          const cfg = severityConfig[ins.severity];
          const expanded = expandedIds.has(ins.id);

          return (
            <div
              key={ins.id}
              className={cn(
                'rounded-lg border border-border bg-card border-l-4 transition-colors',
                cfg.color,
                ins.acknowledged && 'opacity-60'
              )}
            >
              <button
                onClick={() => toggleExpand(ins.id)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    {expanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant={cfg.badgeVariant} className="text-[10px]">{ins.severity}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{typeLabels[ins.type]}</Badge>
                        {ins.acknowledged && (
                          <Badge variant="rag-green" className="text-[10px]">Acknowledged</Badge>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-foreground">{ins.title}</div>
                      <p className="text-xs text-muted-foreground mt-1">{ins.summary}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-muted-foreground">{relativeTime(ins.timestamp)}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(ins.timestamp).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </button>

              {expanded && (
                <div className="px-4 pb-4 pt-0 space-y-3 ml-6">
                  <div className="text-sm text-foreground/80 leading-relaxed">{ins.details}</div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-foreground">Recommendations</div>
                    <ul className="space-y-1">
                      {ins.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-violet-500 shrink-0 mt-0.5">&#x2022;</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    size="sm"
                    variant={ins.acknowledged ? 'secondary' : 'outline'}
                    onClick={(e) => { e.stopPropagation(); toggleAcknowledge(ins.id); }}
                    className="h-7 text-xs"
                  >
                    <CheckCircle2 className={cn('h-3.5 w-3.5 mr-1', ins.acknowledged ? 'text-green-500' : 'text-muted-foreground')} />
                    {ins.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
