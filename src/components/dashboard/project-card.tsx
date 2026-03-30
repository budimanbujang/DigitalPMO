'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { MockProject } from '@/lib/mock-data';

interface ProjectCardProps {
  project: MockProject;
}

function ragPillarColor(status: string): string {
  switch (status) {
    case 'RED': return '#dc2626';
    case 'AMBER': return '#d97706';
    case 'GREEN': return '#16a34a';
    default: return '#74777f';
  }
}

function ragBadgeStyles(status: string): { bg: string; text: string } {
  switch (status) {
    case 'RED': return { bg: '#fef2f2', text: '#dc2626' };
    case 'AMBER': return { bg: '#fffbeb', text: '#d97706' };
    case 'GREEN': return { bg: '#f0fdf4', text: '#16a34a' };
    default: return { bg: '#f3f3f6', text: '#74777f' };
  }
}

function progressBarColor(status: string, isCompleted: boolean): string {
  if (isCompleted) return '#16a34a';
  switch (status) {
    case 'RED': return '#dc2626';
    case 'AMBER': return '#d97706';
    case 'GREEN': return '#16a34a';
    default: return '#3B82F6';
  }
}

function budgetBarColor(spent: number, allocated: number): string {
  const ratio = spent / allocated;
  if (ratio > 0.9) return '#dc2626';
  if (ratio > 0.7) return '#d97706';
  return '#3B82F6';
}

export function ProjectCard({ project }: ProjectCardProps) {
  const budgetPercent = Math.round((project.budgetSpent / project.budgetAllocated) * 100);
  const isCompleted = project.status === 'COMPLETED';
  const badge = ragBadgeStyles(project.ragStatus);

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <div
        className="bg-white rounded-xl h-full transition-all duration-200 relative overflow-hidden group-focus-visible:ring-2 group-focus-visible:ring-[#001736]"
        style={{
          boxShadow: '0 12px 40px rgba(26, 28, 30, 0.06)',
          borderLeft: `3px solid ${ragPillarColor(project.ragStatus)}`,
        }}
      >
        <div className="p-5 space-y-4">
          {/* Header: name + RAG + AI flag */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className="font-semibold text-sm font-heading truncate"
                style={{ color: '#1a1c1e', letterSpacing: '-0.02em' }}
              >
                {project.name}
              </h3>
              <span className="text-xs font-body" style={{ color: '#74777f' }}>
                {project.code}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {project.aiFlagged && (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full ring-2"
                  style={{
                    backgroundColor: '#7c3aed',
                    boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.2)',
                  }}
                  title="AI risk flagged"
                />
              )}
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: badge.bg, color: badge.text }}
              >
                {project.ragStatus}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-body">
              <span style={{ color: '#44474e' }}>Progress</span>
              <span className="font-medium" style={{ color: '#1a1c1e' }}>
                {project.percentComplete}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: '#e8e8ea' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${project.percentComplete}%`,
                  backgroundColor: progressBarColor(project.ragStatus, isCompleted),
                }}
              />
            </div>
          </div>

          {/* Budget utilization */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-body">
              <span style={{ color: '#44474e' }}>Budget</span>
              <span className="font-medium" style={{ color: '#1a1c1e' }}>
                {budgetPercent}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: '#e8e8ea' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(budgetPercent, 100)}%`,
                  backgroundColor: budgetBarColor(project.budgetSpent, project.budgetAllocated),
                }}
              />
            </div>
          </div>

          {/* Footer row: milestone + overdue */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs min-w-0 font-body" style={{ color: '#44474e' }}>
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: '#16a34a' }} />
                  <span className="truncate">Completed</span>
                </>
              ) : (
                <>
                  <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{project.nextMilestone.name}</span>
                  <span className="shrink-0 font-medium" style={{ color: '#1a1c1e' }}>
                    {project.nextMilestone.daysRemaining}d
                  </span>
                </>
              )}
            </div>
            {project.overdueTasks > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <AlertTriangle className="h-3.5 w-3.5" style={{ color: '#dc2626' }} />
                <span className="text-xs font-semibold" style={{ color: '#dc2626' }}>
                  {project.overdueTasks}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
