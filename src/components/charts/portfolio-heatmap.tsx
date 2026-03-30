'use client';

import React from 'react';

interface HeatmapProject {
  id: string;
  name: string;
  scores: Record<string, number>; // dimension name -> score 0-100
}

interface PortfolioHeatmapProps {
  projects: HeatmapProject[];
  dimensions?: string[];
}

const defaultDimensions = ['Schedule', 'Budget', 'Scope', 'Risk', 'Team'];

function getHealthColor(score: number): {
  bg: string;
  text: string;
  label: string;
} {
  if (score >= 70) {
    return {
      bg: 'rgba(22, 163, 74, 0.12)',
      text: '#16a34a',
      label: 'Good',
    };
  }
  if (score >= 40) {
    return {
      bg: 'rgba(217, 119, 6, 0.12)',
      text: '#d97706',
      label: 'At Risk',
    };
  }
  return {
    bg: 'rgba(220, 38, 38, 0.12)',
    text: '#dc2626',
    label: 'Critical',
  };
}

function getOverallScore(project: HeatmapProject, dimensions: string[]): number {
  const scores = dimensions.map((d) => project.scores[d] ?? 0);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function PortfolioHeatmap({
  projects,
  dimensions = defaultDimensions,
}: PortfolioHeatmapProps) {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm font-body" style={{ color: '#74777f' }}>
        No projects to display
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold font-heading py-2 pr-3 w-40" style={{ color: '#44474e' }}>
              Project
            </th>
            {dimensions.map((dim) => (
              <th
                key={dim}
                className="text-center text-xs font-semibold font-heading py-2 px-1"
                style={{ color: '#44474e' }}
              >
                {dim}
              </th>
            ))}
            <th className="text-center text-xs font-semibold font-heading py-2 px-1" style={{ color: '#44474e', borderLeft: '1px solid #e8e8ea' }}>
              Overall
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const overall = getOverallScore(project, dimensions);
            const overallColor = getHealthColor(overall);

            return (
              <tr key={project.id} className="group transition-colors" style={{ borderBottom: '1px solid #f3f3f6' }}>
                <td className="py-2 pr-3">
                  <span className="text-sm font-medium font-heading truncate block max-w-[160px]" style={{ color: '#1a1c1e' }}>
                    {project.name}
                  </span>
                </td>
                {dimensions.map((dim) => {
                  const score = project.scores[dim] ?? 0;
                  const color = getHealthColor(score);
                  return (
                    <td key={dim} className="py-2 px-1">
                      <div
                        className="mx-auto w-full max-w-[64px] h-9 rounded-md flex items-center justify-center cursor-default transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.bg }}
                        title={`${project.name} - ${dim}: ${score} (${color.label})`}
                      >
                        <span className="text-xs font-semibold font-mono" style={{ color: color.text }}>
                          {score}
                        </span>
                      </div>
                    </td>
                  );
                })}
                <td className="py-2 px-1" style={{ borderLeft: '1px solid #e8e8ea' }}>
                  <div
                    className="mx-auto w-full max-w-[64px] h-9 rounded-md flex items-center justify-center cursor-default"
                    style={{ backgroundColor: overallColor.bg }}
                    title={`${project.name} - Overall: ${overall} (${overallColor.label})`}
                  >
                    <span className="text-xs font-bold font-mono" style={{ color: overallColor.text }}>
                      {overall}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #e8e8ea' }}>
        <span className="text-[10px] font-body" style={{ color: '#74777f' }}>Health:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(22, 163, 74, 0.25)' }} />
          <span className="text-[10px] font-body" style={{ color: '#44474e' }}>Good (70-100)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(217, 119, 6, 0.25)' }} />
          <span className="text-[10px] font-body" style={{ color: '#44474e' }}>At Risk (40-69)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.25)' }} />
          <span className="text-[10px] font-body" style={{ color: '#44474e' }}>Critical (0-39)</span>
        </div>
      </div>
    </div>
  );
}
