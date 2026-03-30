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
      bg: 'bg-rag-green/20 dark:bg-rag-green/30',
      text: 'text-rag-green',
      label: 'Good',
    };
  }
  if (score >= 40) {
    return {
      bg: 'bg-rag-amber/20 dark:bg-rag-amber/30',
      text: 'text-rag-amber',
      label: 'At Risk',
    };
  }
  return {
    bg: 'bg-rag-red/20 dark:bg-rag-red/30',
    text: 'text-rag-red',
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
      <div className="flex items-center justify-center h-32 text-sm text-gray-500 dark:text-gray-400 font-body">
        No projects to display
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold text-gray-600 dark:text-gray-400 font-heading py-2 pr-3 w-40">
              Project
            </th>
            {dimensions.map((dim) => (
              <th
                key={dim}
                className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 font-heading py-2 px-1"
              >
                {dim}
              </th>
            ))}
            <th className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 font-heading py-2 px-1 border-l border-gray-200 dark:border-gray-700">
              Overall
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {projects.map((project) => {
            const overall = getOverallScore(project, dimensions);
            const overallColor = getHealthColor(overall);

            return (
              <tr key={project.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-2 pr-3">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 font-heading truncate block max-w-[160px]">
                    {project.name}
                  </span>
                </td>
                {dimensions.map((dim) => {
                  const score = project.scores[dim] ?? 0;
                  const color = getHealthColor(score);
                  return (
                    <td key={dim} className="py-2 px-1">
                      <div
                        className={`mx-auto w-full max-w-[64px] h-9 rounded-md ${color.bg} flex items-center justify-center cursor-default transition-transform group-hover:scale-105`}
                        title={`${project.name} - ${dim}: ${score} (${color.label})`}
                      >
                        <span className={`text-xs font-semibold ${color.text} font-mono`}>
                          {score}
                        </span>
                      </div>
                    </td>
                  );
                })}
                <td className="py-2 px-1 border-l border-gray-200 dark:border-gray-700">
                  <div
                    className={`mx-auto w-full max-w-[64px] h-9 rounded-md ${overallColor.bg} flex items-center justify-center cursor-default`}
                    title={`${project.name} - Overall: ${overall} (${overallColor.label})`}
                  >
                    <span className={`text-xs font-bold ${overallColor.text} font-mono`}>
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
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-body">Health:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-rag-green/30" />
          <span className="text-[10px] text-gray-600 dark:text-gray-400 font-body">Good (70-100)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-rag-amber/30" />
          <span className="text-[10px] text-gray-600 dark:text-gray-400 font-body">At Risk (40-69)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-rag-red/30" />
          <span className="text-[10px] text-gray-600 dark:text-gray-400 font-body">Critical (0-39)</span>
        </div>
      </div>
    </div>
  );
}
