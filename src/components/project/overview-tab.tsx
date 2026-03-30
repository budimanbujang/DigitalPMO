'use client';

import React from 'react';
import { CheckCircle2, Wallet, Clock, Users, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjectContext } from '@/components/project/project-context';
import { formatCurrency, formatRelativeDate } from '@/lib/utils';

// Mock activity feed
function getMockActivities(projectId: string) {
  return [
    { id: '1', action: 'Task completed', detail: 'API integration testing passed', user: 'Ahmad', timestamp: '2026-03-30T10:30:00Z', type: 'task' },
    { id: '2', action: 'Risk updated', detail: 'Vendor risk escalated to HIGH', user: 'Siti', timestamp: '2026-03-29T16:00:00Z', type: 'risk' },
    { id: '3', action: 'Budget revised', detail: 'Additional RM 200K approved for consultancy', user: 'Faizal', timestamp: '2026-03-29T14:00:00Z', type: 'budget' },
    { id: '4', action: 'Milestone updated', detail: 'UAT preparation 85% complete', user: 'Lee', timestamp: '2026-03-29T11:00:00Z', type: 'milestone' },
    { id: '5', action: 'AI Insight generated', detail: 'Schedule risk detected for Q2 deliverables', user: 'AI Agent', timestamp: '2026-03-29T08:15:00Z', type: 'ai' },
    { id: '6', action: 'Task assigned', detail: 'Database migration script review', user: 'Farah', timestamp: '2026-03-28T15:30:00Z', type: 'task' },
    { id: '7', action: 'Document uploaded', detail: 'Updated project charter v2.3', user: 'Ahmad', timestamp: '2026-03-28T10:00:00Z', type: 'document' },
    { id: '8', action: 'Status update', detail: 'Weekly status report submitted', user: 'Siti', timestamp: '2026-03-27T17:00:00Z', type: 'status' },
    { id: '9', action: 'Task blocked', detail: 'Firewall configuration pending IT approval', user: 'Tan', timestamp: '2026-03-27T14:00:00Z', type: 'task' },
    { id: '10', action: 'Chase sent', detail: 'Follow-up on pending test environment access', user: 'System', timestamp: '2026-03-27T09:00:00Z', type: 'chase' },
  ];
}

// Mock task completion trend data
const trendData = [
  { week: 'W1', completed: 8 },
  { week: 'W2', completed: 12 },
  { week: 'W3', completed: 6 },
  { week: 'W4', completed: 15 },
  { week: 'W5', completed: 11 },
  { week: 'W6', completed: 18 },
  { week: 'W7', completed: 14 },
  { week: 'W8', completed: 20 },
];

function activityIconColor(type: string): string {
  const colors: Record<string, string> = {
    task: '#3B82F6',
    risk: '#EF4444',
    budget: '#F59E0B',
    milestone: '#22C55E',
    ai: 'var(--ai-accent)',
    document: '#06B6D4',
    status: '#6B7280',
    chase: '#F97316',
  };
  return colors[type] || colors.status;
}

export function OverviewTab() {
  const { project, insights } = useProjectContext();
  const activities = getMockActivities(project.id);
  const budgetUsed = Math.round((project.budgetSpent / project.budgetAllocated) * 100);
  const daysRemaining = Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const teamSize = Math.floor(project.totalTasks / 15) + 3; // mock
  const openRisks = project.ragStatus === 'RED' ? 5 : project.ragStatus === 'AMBER' ? 3 : 1;
  const maxTrend = Math.max(...trendData.map((d) => d.completed));

  return (
    <div className="space-y-8">
      {/* Key metrics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          icon={<CheckCircle2 className="h-4 w-4" style={{ color: '#22C55E' }} />}
          label="Tasks Completed"
          value={`${project.completedTasks}/${project.totalTasks}`}
          sub={`${Math.round((project.completedTasks / project.totalTasks) * 100)}%`}
        />
        <MetricCard
          icon={<Wallet className="h-4 w-4" style={{ color: '#3B82F6' }} />}
          label="Budget Used"
          value={`${budgetUsed}%`}
          sub={formatCurrency(project.budgetSpent)}
        />
        <MetricCard
          icon={<Clock className="h-4 w-4" style={{ color: '#F59E0B' }} />}
          label="Days Remaining"
          value={`${daysRemaining > 0 ? daysRemaining : 0}`}
          sub={daysRemaining < 0 ? 'Overdue' : 'Until deadline'}
        />
        <MetricCard
          icon={<Users className="h-4 w-4" style={{ color: '#06B6D4' }} />}
          label="Team Size"
          value={`${teamSize}`}
          sub="Active members"
        />
        <MetricCard
          icon={<ShieldAlert className="h-4 w-4" style={{ color: '#EF4444' }} />}
          label="Risks Open"
          value={`${openRisks}`}
          sub={openRisks > 3 ? 'Needs attention' : 'Manageable'}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Activity feed - takes 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent activity */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'var(--surface-container-lowest)', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
          >
            <h3
              className="text-sm font-semibold mb-5"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}
            >
              Recent Activity
            </h3>
            <div className="space-y-5">
              {activities.map((a) => {
                const dotColor = activityIconColor(a.type);
                return (
                  <div key={a.id} className="flex items-start gap-3">
                    <div
                      className="mt-1.5 rounded-full p-1.5 shrink-0"
                      style={{ backgroundColor: `${dotColor}15` }}
                    >
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--on-surface)' }}>{a.action}</span>
                        <span className="text-xs" style={{ color: 'var(--outline)' }}>{formatRelativeDate(a.timestamp)}</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--on-surface-variant)' }}>{a.detail}</p>
                      <span className="text-xs" style={{ color: 'var(--outline)' }}>by {a.user}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task completion trend mini chart */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'var(--surface-container-lowest)', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
          >
            <h3
              className="text-sm font-semibold flex items-center gap-2 mb-5"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}
            >
              <TrendingUp className="h-4 w-4" style={{ color: '#22C55E' }} />
              Task Completion Trend
            </h3>
            <div className="flex items-end gap-2 h-32">
              {trendData.map((d) => (
                <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all"
                    style={{ height: `${(d.completed / maxTrend) * 100}%`, backgroundColor: 'var(--primary)' }}
                  />
                  <span className="text-[10px]" style={{ color: 'var(--outline)' }}>{d.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
          {/* Next milestone countdown */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'var(--surface-container-lowest)', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}
            >
              Next Milestone
            </h3>
            <div className="space-y-3">
              <div className="text-base font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--on-surface)' }}>{project.nextMilestone.name}</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: project.nextMilestone.daysRemaining < 0 ? '#EF4444' : project.nextMilestone.daysRemaining < 7 ? '#F59E0B' : '#22C55E' }}>
                  {Math.abs(project.nextMilestone.daysRemaining)}
                </div>
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  {project.nextMilestone.daysRemaining < 0 ? 'days overdue' : 'days remaining'}
                </span>
              </div>
              <div className="text-xs" style={{ color: 'var(--outline)' }}>
                Due: {new Date(project.nextMilestone.dueDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <Progress
                value={project.nextMilestone.daysRemaining < 0 ? 100 : Math.max(0, 100 - project.nextMilestone.daysRemaining * 3)}
                color={project.nextMilestone.daysRemaining < 0 ? '#EF4444' : project.nextMilestone.daysRemaining < 7 ? '#F59E0B' : '#22C55E'}
              />
            </div>
          </div>

          {/* AI health summary */}
          <div
            className="rounded-2xl p-6"
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              boxShadow: '0 12px 40px rgba(26,28,30,0.06)',
              borderLeft: '3px solid var(--ai-accent)',
            }}
          >
            <h3
              className="text-sm font-semibold flex items-center gap-2 mb-4"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}
            >
              <Sparkles className="h-4 w-4" style={{ color: 'var(--ai-accent)' }} />
              AI Health Summary
            </h3>
            <div className="space-y-3">
              {insights.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>No active AI insights for this project.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: insights.some((i) => i.severity === 'CRITICAL') ? '#EF4444' :
                          insights.some((i) => i.severity === 'HIGH') ? '#F59E0B' : '#22C55E'
                      }}
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--on-surface)' }}>
                      {insights.some((i) => i.severity === 'CRITICAL') ? 'Critical issues detected' :
                       insights.some((i) => i.severity === 'HIGH') ? 'High-priority items' : 'Moderate observations'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {insights.slice(0, 3).map((insight) => (
                      <div key={insight.id} className="text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={insight.severity === 'CRITICAL' ? 'rag-red' : insight.severity === 'HIGH' ? 'rag-amber' : 'secondary'}
                            className="text-[10px] px-1.5 py-0 rounded-full"
                          >
                            {insight.severity}
                          </Badge>
                          <span className="font-medium truncate" style={{ color: 'var(--on-surface)' }}>{insight.title}</span>
                        </div>
                        <p style={{ color: 'var(--on-surface-variant)' }} className="line-clamp-2">{insight.summary}</p>
                      </div>
                    ))}
                  </div>
                  {insights.length > 3 && (
                    <p className="text-xs font-medium" style={{ color: 'var(--ai-accent)' }}>+{insights.length - 3} more insights</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Heatmap */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'var(--surface-container-lowest)', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}
            >
              Health Heatmap
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(project.heatmap).map(([key, val]) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div
                    className="h-8 w-8 rounded-md"
                    style={{
                      backgroundColor: val === 'RED' ? 'rgba(239,68,68,0.8)' : val === 'AMBER' ? 'rgba(245,158,11,0.8)' : 'rgba(34,197,94,0.8)'
                    }}
                  />
                  <span className="text-[10px] capitalize" style={{ color: 'var(--outline)' }}>{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div
      className="rounded-2xl p-4 space-y-1"
      style={{ backgroundColor: 'var(--surface-container-lowest)', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
    >
      <div className="flex items-center gap-2 text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--on-surface-variant)' }}>
        {icon}
        {label}
      </div>
      <div className="text-xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--on-surface)' }}>{value}</div>
      <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--outline)' }}>{sub}</div>
    </div>
  );
}
