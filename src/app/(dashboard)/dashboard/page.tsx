'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioHealthCard } from '@/components/dashboard/portfolio-health-card';
import { ProjectCard } from '@/components/dashboard/project-card';
import { InsightsFeed } from '@/components/dashboard/insights-feed';
import { AlertsPanel } from '@/components/dashboard/alerts-panel';
import { PortfolioHeatmap } from '@/components/charts/portfolio-heatmap';
import { BudgetChart } from '@/components/charts/budget-chart';
import {
  mockProjects,
  mockInsights,
  mockAlerts,
  portfolioHealthScore,
  portfolioHealthBreakdown,
  budgetChartData,
  portfolioBudgetSummary,
  ragToScore,
} from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Briefcase, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

// Transform projects for the heatmap component (expects numeric scores)
const heatmapProjects = mockProjects
  .filter((p) => p.status !== 'COMPLETED')
  .map((p) => ({
    id: p.id,
    name: p.name,
    scores: {
      Schedule: ragToScore(p.heatmap.schedule),
      Budget: ragToScore(p.heatmap.budget),
      Scope: ragToScore(p.heatmap.scope),
      Risk: ragToScore(p.heatmap.risk),
      Team: ragToScore(p.heatmap.team),
    },
  }));

// Summary stats
const activeCount = mockProjects.filter((p) => p.status !== 'COMPLETED').length;
const atRiskCount = mockProjects.filter(
  (p) => p.ragStatus === 'RED' || p.ragStatus === 'AMBER'
).length;
const totalOverdue = mockProjects.reduce((sum, p) => sum + p.overdueTasks, 0);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Portfolio Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of all government digital projects
        </p>
      </div>

      {/* Summary KPI strip */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">At Risk / Red</p>
              <p className="text-2xl font-bold text-foreground">{atRiskCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue Tasks</p>
              <p className="text-2xl font-bold text-foreground">{totalOverdue}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-2.5">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Budget</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(portfolioBudgetSummary.totalAllocated)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main grid: Health + Project Cards */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left column: Portfolio Health */}
        <PortfolioHealthCard
          score={portfolioHealthScore}
          breakdown={portfolioHealthBreakdown}
        />

        {/* Right column: Project cards grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Projects ({mockProjects.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Portfolio Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioHeatmap projects={heatmapProjects} />
        </CardContent>
      </Card>

      {/* Bottom grid: Insights + Budget + Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Insights */}
        <div className="lg:col-span-1">
          <InsightsFeed insights={mockInsights} />
        </div>

        {/* Budget Summary */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget Summary
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span>
                  Allocated:{' '}
                  <strong className="text-foreground">
                    {formatCurrency(portfolioBudgetSummary.totalAllocated)}
                  </strong>
                </span>
                <span>
                  Spent:{' '}
                  <strong className="text-foreground">
                    {formatCurrency(portfolioBudgetSummary.totalSpent)}
                  </strong>
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <BudgetChart data={budgetChartData} height={340} />
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        <div className="lg:col-span-1">
          <AlertsPanel alerts={mockAlerts} />
        </div>
      </div>
    </div>
  );
}
