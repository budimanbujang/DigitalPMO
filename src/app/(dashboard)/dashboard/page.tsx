'use client';

import React from 'react';
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
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9fc' }}>
      {/* Page header */}
      <div className="bg-white py-8 pl-16 pr-20">
        <h1
          className="text-3xl font-bold font-heading"
          style={{ color: '#001736', letterSpacing: '-0.02em' }}
        >
          Portfolio Dashboard
        </h1>
        <p className="mt-1.5 text-sm font-body" style={{ color: '#44474e' }}>
          Overview of all government digital projects
        </p>
      </div>

      {/* Summary KPI strip */}
      <div className="px-6 py-6" style={{ backgroundColor: '#f3f3f6' }}>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Briefcase,
              label: 'Active Projects',
              value: activeCount,
              iconBg: 'rgba(0, 23, 54, 0.08)',
              iconColor: '#001736',
            },
            {
              icon: AlertTriangle,
              label: 'At Risk / Red',
              value: atRiskCount,
              iconBg: 'rgba(217, 119, 6, 0.1)',
              iconColor: '#d97706',
            },
            {
              icon: TrendingUp,
              label: 'Overdue Tasks',
              value: totalOverdue,
              iconBg: 'rgba(220, 38, 38, 0.1)',
              iconColor: '#dc2626',
            },
            {
              icon: DollarSign,
              label: 'Total Budget',
              value: formatCurrency(portfolioBudgetSummary.totalAllocated),
              iconBg: 'rgba(22, 163, 74, 0.1)',
              iconColor: '#16a34a',
              small: true,
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-4 flex items-center gap-3"
                style={{ boxShadow: '0 12px 40px rgba(26, 28, 30, 0.06)' }}
              >
                <div
                  className="rounded-lg p-2.5"
                  style={{ backgroundColor: kpi.iconBg }}
                >
                  <Icon className="h-5 w-5" style={{ color: kpi.iconColor }} />
                </div>
                <div>
                  <p className="text-xs font-body" style={{ color: '#74777f' }}>
                    {kpi.label}
                  </p>
                  <p
                    className={`${kpi.small ? 'text-lg' : 'text-2xl'} font-bold font-body`}
                    style={{ color: '#1a1c1e' }}
                  >
                    {kpi.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main grid: Health + Project Cards */}
      <div className="px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left column: Portfolio Health */}
          <PortfolioHealthCard
            score={portfolioHealthScore}
            breakdown={portfolioHealthBreakdown}
          />

          {/* Right column: Project cards grid */}
          <div className="space-y-3">
            <h2
              className="text-sm font-semibold font-heading"
              style={{ color: '#1a1c1e', letterSpacing: '-0.02em' }}
            >
              Projects ({mockProjects.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {mockProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="pl-16 pr-20 py-8" style={{ backgroundColor: '#f3f3f6' }}>
        <div
          className="bg-white rounded-xl p-6"
          style={{ boxShadow: '0 12px 40px rgba(26, 28, 30, 0.06)' }}
        >
          <h2
            className="text-base font-semibold font-heading mb-4"
            style={{ color: '#1a1c1e', letterSpacing: '-0.02em' }}
          >
            Portfolio Heatmap
          </h2>
          <PortfolioHeatmap projects={heatmapProjects} />
        </div>
      </div>

      {/* Bottom grid: Insights + Budget + Alerts */}
      <div className="px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Insights */}
          <div className="lg:col-span-1">
            <InsightsFeed insights={mockInsights} />
          </div>

          {/* Budget Summary */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-xl h-full flex flex-col"
              style={{ boxShadow: '0 12px 40px rgba(26, 28, 30, 0.06)' }}
            >
              <div className="p-6 pb-3">
                <h3
                  className="text-base font-semibold font-heading flex items-center gap-2"
                  style={{ color: '#1a1c1e', letterSpacing: '-0.02em' }}
                >
                  <DollarSign className="h-4 w-4" style={{ color: '#74777f' }} />
                  Budget Summary
                </h3>
                <div className="flex items-center gap-4 text-xs pt-1 font-body" style={{ color: '#74777f' }}>
                  <span>
                    Allocated:{' '}
                    <strong style={{ color: '#1a1c1e' }}>
                      {formatCurrency(portfolioBudgetSummary.totalAllocated)}
                    </strong>
                  </span>
                  <span>
                    Spent:{' '}
                    <strong style={{ color: '#1a1c1e' }}>
                      {formatCurrency(portfolioBudgetSummary.totalSpent)}
                    </strong>
                  </span>
                </div>
              </div>
              <div className="flex-1 px-6 pb-6">
                <BudgetChart data={budgetChartData} height={340} />
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="lg:col-span-1">
            <AlertsPanel alerts={mockAlerts} />
          </div>
        </div>
      </div>
    </div>
  );
}
