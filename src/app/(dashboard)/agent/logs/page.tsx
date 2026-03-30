'use client';

import React, { useState } from 'react';
import {
  Bot,
  Brain,
  MessageCircle,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LogStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'RUNNING';
type LogType = 'ANALYSIS' | 'CHASE' | 'INSIGHT' | 'ALERT';

interface AgentLog {
  id: string;
  timestamp: string;
  type: LogType;
  scope: string;
  summary: string;
  status: LogStatus;
  details: string;
  duration?: string;
}

const MOCK_LOGS: AgentLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-03-30T09:45:00Z',
    type: 'ANALYSIS',
    scope: 'Portfolio',
    summary: 'Scheduled portfolio health analysis completed',
    status: 'SUCCESS',
    details: 'Analyzed 6 active projects. Overall health score: 72/100. Detected 2 projects with budget drift >10%. Generated 3 new insights.',
    duration: '4.2s',
  },
  {
    id: 'log-02',
    timestamp: '2026-03-30T09:30:00Z',
    type: 'CHASE',
    scope: 'MYDA Phase 2',
    summary: 'Chase messages sent for 3 overdue tasks',
    status: 'SUCCESS',
    details: 'Sent Level 1 reminders to Ahmad Razif (API Integration), Nurul Huda (Database Migration), and Faizal Noor (Security Audit). Next escalation in 48 hours if no response.',
    duration: '2.1s',
  },
  {
    id: 'log-03',
    timestamp: '2026-03-30T09:15:00Z',
    type: 'INSIGHT',
    scope: 'E-Perolehan Revamp',
    summary: 'Budget drift insight generated - HIGH severity',
    status: 'SUCCESS',
    details: 'Budget utilization at 78% with only 55% of deliverables completed. Forecasted overrun of MYR 320,000. Recommended immediate scope review and vendor renegotiation.',
    duration: '3.8s',
  },
  {
    id: 'log-04',
    timestamp: '2026-03-30T08:50:00Z',
    type: 'ALERT',
    scope: 'HRMIS Upgrade',
    summary: 'Milestone at risk - UAT Phase due in 5 days',
    status: 'SUCCESS',
    details: 'UAT Phase milestone due 04 Apr 2026. 3 blocking tasks still in progress. Notified PM Siti Aminah and PMO Lead. Auto-escalation scheduled.',
    duration: '1.5s',
  },
  {
    id: 'log-05',
    timestamp: '2026-03-30T08:30:00Z',
    type: 'ANALYSIS',
    scope: 'MyGov Portal',
    summary: 'Project-level risk analysis completed',
    status: 'SUCCESS',
    details: 'Identified 2 new dependency risks with HRMIS Upgrade. Team workload analysis shows 3 members above 90% capacity. Recommended resource rebalancing.',
    duration: '5.1s',
  },
  {
    id: 'log-06',
    timestamp: '2026-03-30T08:00:00Z',
    type: 'CHASE',
    scope: 'MYDA Phase 2',
    summary: 'Escalation triggered - Level 2 for Security Audit task',
    status: 'SUCCESS',
    details: 'No response to Level 1 chase sent on 27 Mar. Escalated to PM Wan Ismail. Firm follow-up message generated and sent.',
    duration: '1.9s',
  },
  {
    id: 'log-07',
    timestamp: '2026-03-29T18:00:00Z',
    type: 'ANALYSIS',
    scope: 'Portfolio',
    summary: 'End-of-day portfolio summary generated',
    status: 'SUCCESS',
    details: 'Daily summary: 4 tasks completed, 7 tasks in progress, 3 new overdue. Budget variance within threshold for 4/6 projects. Chase response rate: 67%.',
    duration: '6.3s',
  },
  {
    id: 'log-08',
    timestamp: '2026-03-29T15:30:00Z',
    type: 'INSIGHT',
    scope: 'ePenyata Gaji',
    summary: 'Stagnant tasks detected - 4 tasks with no activity for 7+ days',
    status: 'SUCCESS',
    details: 'Tasks flagged: Payroll Integration (9 days), Report Template Design (7 days), Data Validation Rules (8 days), API Documentation (12 days). Chase sequences initiated.',
    duration: '2.7s',
  },
  {
    id: 'log-09',
    timestamp: '2026-03-29T14:00:00Z',
    type: 'ALERT',
    scope: 'E-Perolehan Revamp',
    summary: 'Critical risk count threshold exceeded',
    status: 'SUCCESS',
    details: 'Project now has 3 CRITICAL risks (threshold: 2). Triggered notifications to PMO Lead and Steering Committee distribution list.',
    duration: '1.2s',
  },
  {
    id: 'log-10',
    timestamp: '2026-03-29T12:00:00Z',
    type: 'ANALYSIS',
    scope: 'HRMIS Upgrade',
    summary: 'Gap analysis run on updated project scope',
    status: 'PARTIAL',
    details: 'Analyzed updated scope document. Found 5 gaps: missing rollback plan (CRITICAL), no performance benchmarks (HIGH), incomplete data migration checklist (HIGH), vague acceptance criteria (MEDIUM), no training schedule (MEDIUM). API rate limit hit during extended analysis.',
    duration: '8.4s',
  },
  {
    id: 'log-11',
    timestamp: '2026-03-29T10:00:00Z',
    type: 'CHASE',
    scope: 'MyGov Portal',
    summary: 'Chase response processed - Blocked status reported',
    status: 'SUCCESS',
    details: 'Amirah Tan responded to chase for Frontend Redesign task. Reported status: BLOCKED. Reason: Waiting for design system approval from UX team. Auto-created blocker ticket and notified UX Lead.',
    duration: '1.8s',
  },
  {
    id: 'log-12',
    timestamp: '2026-03-29T08:00:00Z',
    type: 'ANALYSIS',
    scope: 'Portfolio',
    summary: 'Morning portfolio health check',
    status: 'SUCCESS',
    details: 'All 6 projects scanned. Health score: 74/100 (up from 71). Improvements in HRMIS Upgrade and ePenyata Gaji. Decline in E-Perolehan Revamp.',
    duration: '4.9s',
  },
  {
    id: 'log-13',
    timestamp: '2026-03-28T16:00:00Z',
    type: 'INSIGHT',
    scope: 'Portfolio',
    summary: 'Resource conflict detected across projects',
    status: 'SUCCESS',
    details: 'Ahmad Razif assigned to critical tasks in both MYDA Phase 2 and MyGov Portal with overlapping deadlines (31 Mar - 04 Apr). Recommended reassignment or timeline adjustment.',
    duration: '3.2s',
  },
  {
    id: 'log-14',
    timestamp: '2026-03-28T14:00:00Z',
    type: 'ALERT',
    scope: 'ePenyata Gaji',
    summary: 'Status update overdue for 5 days',
    status: 'SUCCESS',
    details: 'No status update from PM Hafiz Rahman since 23 Mar 2026. Automated reminder sent. If no update by 30 Mar, will escalate to PMO Lead.',
    duration: '1.1s',
  },
  {
    id: 'log-15',
    timestamp: '2026-03-28T09:00:00Z',
    type: 'CHASE',
    scope: 'E-Perolehan Revamp',
    summary: 'Failed to send chase - recipient email bounced',
    status: 'FAILED',
    details: 'Attempted to send Level 1 chase to contractor Kamal Idris for Vendor Onboarding task. Email delivery failed: address not found. Flagged for manual review by PMO team.',
    duration: '0.8s',
  },
];

function getTypeIcon(type: LogType) {
  switch (type) {
    case 'ANALYSIS': return <Brain className="h-4 w-4" />;
    case 'CHASE': return <MessageCircle className="h-4 w-4" />;
    case 'INSIGHT': return <Bot className="h-4 w-4" />;
    case 'ALERT': return <AlertTriangle className="h-4 w-4" />;
  }
}

function getTypeBadgeClass(type: LogType) {
  switch (type) {
    case 'ANALYSIS': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'CHASE': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'INSIGHT': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'ALERT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }
}

function getStatusBadge(status: LogStatus) {
  switch (status) {
    case 'SUCCESS':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" /> Success
        </span>
      );
    case 'PARTIAL':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
          <Clock className="h-3 w-3" /> Partial
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">
          <XCircle className="h-3 w-3" /> Failed
        </span>
      );
    case 'RUNNING':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
          <Clock className="h-3 w-3 animate-spin" /> Running
        </span>
      );
  }
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function AgentLogsPage() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  const filtered = MOCK_LOGS.filter((log) => {
    if (typeFilter !== 'ALL' && log.type !== typeFilter) return false;
    if (dateFilter === 'TODAY') {
      return log.timestamp.startsWith('2026-03-30');
    }
    if (dateFilter === 'YESTERDAY') {
      return log.timestamp.startsWith('2026-03-29');
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Activity Logs</h1>
          <p className="mt-1 text-sm text-slate-400">
            View all AI agent actions, analysis runs, and chase activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">
            {MOCK_LOGS.length} total entries
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="h-4 w-4" />
          Filters:
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="ANALYSIS">Analysis</option>
          <option value="CHASE">Chase</option>
          <option value="INSIGHT">Insight</option>
          <option value="ALERT">Alert</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
        >
          <option value="ALL">All Dates</option>
          <option value="TODAY">Today</option>
          <option value="YESTERDAY">Yesterday</option>
        </select>
        <div className="ml-auto relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs..."
            className="rounded-lg border border-slate-700 bg-slate-800 py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Summary</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {filtered.map((log) => (
              <React.Fragment key={log.id}>
                <tr
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-slate-700/30',
                    expandedRow === log.id && 'bg-slate-700/20'
                  )}
                  onClick={() =>
                    setExpandedRow(expandedRow === log.id ? null : log.id)
                  }
                >
                  <td className="px-4 py-3 text-slate-400">
                    {expandedRow === log.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        getTypeBadgeClass(log.type)
                      )}
                    >
                      {getTypeIcon(log.type)}
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {log.scope}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-200 max-w-md truncate">
                    {log.summary}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {log.duration ?? '-'}
                  </td>
                </tr>
                {expandedRow === log.id && (
                  <tr className="bg-slate-800/80">
                    <td colSpan={7} className="px-8 py-4">
                      <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
                        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                          Details
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {log.details}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Bot className="h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">No log entries match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
