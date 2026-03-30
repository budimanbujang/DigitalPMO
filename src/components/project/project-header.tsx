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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: '#74777f', fontFamily: 'Inter, sans-serif' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#1a1c1e'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#74777f'; }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Main header */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* Left: Project info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#1a1c1e' }}
              >
                {project.name}
              </h1>
              <Badge variant={ragVariant(project.ragStatus)} className="rounded-full">
                {project.ragStatus}
              </Badge>
              {project.aiFlagged && (
                <Badge variant="ai" className="rounded-full">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Flagged
                </Badge>
              )}
            </div>
            <div
              className="flex items-center gap-4 text-sm"
              style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}
            >
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
            <Button
              variant="outline"
              size="sm"
              className="border-0"
              style={{ backgroundColor: '#f3f3f6', color: '#1a1c1e', fontFamily: 'Inter, sans-serif' }}
            >
              <RefreshCw className="h-4 w-4" />
              Update Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-0"
              style={{ backgroundColor: '#f3f3f6', color: '#1a1c1e', fontFamily: 'Inter, sans-serif' }}
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
            <Button size="sm" style={{ backgroundColor: '#7c3aed', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}>
              <Sparkles className="h-4 w-4" />
              Run AI Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Progress ring */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Completion</div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#e8e8ea" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20" fill="none" strokeWidth="4"
                  stroke={project.percentComplete === 100 ? '#22C55E' : '#3B82F6'}
                  strokeDasharray={`${(project.percentComplete / 100) * 125.6} 125.6`}
                  strokeLinecap="round"
                />
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ fontFamily: 'Inter, sans-serif', color: '#1a1c1e' }}
              >
                {project.percentComplete}%
              </div>
            </div>
            <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>
              {project.completedTasks}/{project.totalTasks} tasks
            </div>
          </div>
        </div>

        {/* Budget */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Budget</div>
          <div className="text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#1a1c1e' }}>{budgetPercent}%</div>
          <Progress value={budgetPercent} color={budgetColor} />
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>
            {formatCurrency(project.budgetSpent)} / {formatCurrency(project.budgetAllocated)}
          </div>
        </div>

        {/* Days remaining */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Days Remaining</div>
          <div className="text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif', color: daysRemaining < 0 ? '#EF4444' : daysRemaining < 30 ? '#F59E0B' : '#1a1c1e' }}>
            {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d`}
          </div>
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>
            End: {new Date(project.endDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Next milestone */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Next Milestone</div>
          <div className="text-sm font-semibold truncate" style={{ fontFamily: 'Inter, sans-serif', color: '#1a1c1e' }}>{project.nextMilestone.name}</div>
          <div className="text-xs font-medium" style={{ color: project.nextMilestone.daysRemaining < 0 ? '#EF4444' : project.nextMilestone.daysRemaining < 7 ? '#F59E0B' : '#22C55E' }}>
            {project.nextMilestone.daysRemaining < 0
              ? `${Math.abs(project.nextMilestone.daysRemaining)}d overdue`
              : `${project.nextMilestone.daysRemaining}d remaining`}
          </div>
        </div>

        {/* Overdue tasks */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Overdue Tasks</div>
          <div className="text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif', color: project.overdueTasks > 0 ? '#EF4444' : '#22C55E' }}>
            {project.overdueTasks}
          </div>
          <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>
            of {project.totalTasks} total
          </div>
        </div>
      </div>
    </div>
  );
}
