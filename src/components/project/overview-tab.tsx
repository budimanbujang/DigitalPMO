'use client';

import React from 'react';
import { CheckCircle2, Wallet, Clock, Users, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

function activityIcon(type: string) {
  const colors: Record<string, string> = {
    task: 'bg-blue-500/20 text-blue-500',
    risk: 'bg-red-500/20 text-red-500',
    budget: 'bg-amber-500/20 text-amber-500',
    milestone: 'bg-green-500/20 text-green-500',
    ai: 'bg-violet-500/20 text-violet-500',
    document: 'bg-cyan-500/20 text-cyan-500',
    status: 'bg-gray-500/20 text-gray-500',
    chase: 'bg-orange-500/20 text-orange-500',
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
    <div className="space-y-6">
      {/* Key metrics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          label="Tasks Completed"
          value={`${project.completedTasks}/${project.totalTasks}`}
          sub={`${Math.round((project.completedTasks / project.totalTasks) * 100)}%`}
        />
        <MetricCard
          icon={<Wallet className="h-4 w-4 text-blue-500" />}
          label="Budget Used"
          value={`${budgetUsed}%`}
          sub={formatCurrency(project.budgetSpent)}
        />
        <MetricCard
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          label="Days Remaining"
          value={`${daysRemaining > 0 ? daysRemaining : 0}`}
          sub={daysRemaining < 0 ? 'Overdue' : 'Until deadline'}
        />
        <MetricCard
          icon={<Users className="h-4 w-4 text-cyan-500" />}
          label="Team Size"
          value={`${teamSize}`}
          sub="Active members"
        />
        <MetricCard
          icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
          label="Risks Open"
          value={`${openRisks}`}
          sub={openRisks > 3 ? 'Needs attention' : 'Manageable'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity feed - takes 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1.5 ${activityIcon(a.type)}`}>
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{a.action}</span>
                      <span className="text-xs text-muted-foreground">{formatRelativeDate(a.timestamp)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{a.detail}</p>
                    <span className="text-xs text-muted-foreground">by {a.user}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Task completion trend mini chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Task Completion Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {trendData.map((d) => (
                  <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/80 transition-all"
                      style={{ height: `${(d.completed / maxTrend) * 100}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{d.week}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Next milestone countdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-base font-semibold text-foreground">{project.nextMilestone.name}</div>
              <div className="flex items-center gap-2">
                <div className={`text-2xl font-bold ${project.nextMilestone.daysRemaining < 0 ? 'text-red-500' : project.nextMilestone.daysRemaining < 7 ? 'text-amber-500' : 'text-green-500'}`}>
                  {Math.abs(project.nextMilestone.daysRemaining)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {project.nextMilestone.daysRemaining < 0 ? 'days overdue' : 'days remaining'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Due: {new Date(project.nextMilestone.dueDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <Progress
                value={project.nextMilestone.daysRemaining < 0 ? 100 : Math.max(0, 100 - project.nextMilestone.daysRemaining * 3)}
                color={project.nextMilestone.daysRemaining < 0 ? '#EF4444' : project.nextMilestone.daysRemaining < 7 ? '#F59E0B' : '#22C55E'}
              />
            </CardContent>
          </Card>

          {/* AI health summary */}
          <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" />
                AI Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {insights.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active AI insights for this project.</p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      insights.some((i) => i.severity === 'CRITICAL') ? 'bg-red-500' :
                      insights.some((i) => i.severity === 'HIGH') ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm font-medium text-foreground">
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
                            className="text-[10px] px-1.5 py-0"
                          >
                            {insight.severity}
                          </Badge>
                          <span className="font-medium text-foreground truncate">{insight.title}</span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{insight.summary}</p>
                      </div>
                    ))}
                  </div>
                  {insights.length > 3 && (
                    <p className="text-xs text-violet-500 font-medium">+{insights.length - 3} more insights</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Health Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(project.heatmap).map(([key, val]) => (
                  <div key={key} className="flex flex-col items-center gap-1">
                    <div className={`h-8 w-8 rounded-md ${
                      val === 'RED' ? 'bg-red-500/80' : val === 'AMBER' ? 'bg-amber-500/80' : 'bg-green-500/80'
                    }`} />
                    <span className="text-[10px] text-muted-foreground capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
