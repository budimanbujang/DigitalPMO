'use client';

import React from 'react';

interface Risk {
  id: string;
  title: string;
  likelihood: number; // 1-4
  impact: number;     // 1-4
  status?: string;
}

interface RiskMatrixProps {
  risks: Risk[];
}

// Severity color based on likelihood * impact
function getCellColor(likelihood: number, impact: number): string {
  const severity = likelihood * impact;
  if (severity >= 12) return 'bg-rag-red/20 dark:bg-rag-red/30';
  if (severity >= 8) return 'bg-orange-200/60 dark:bg-orange-900/40';
  if (severity >= 4) return 'bg-rag-amber/20 dark:bg-rag-amber/30';
  return 'bg-rag-green/20 dark:bg-rag-green/30';
}

function getDotColor(likelihood: number, impact: number): string {
  const severity = likelihood * impact;
  if (severity >= 12) return 'bg-rag-red';
  if (severity >= 8) return 'bg-orange-500';
  if (severity >= 4) return 'bg-rag-amber';
  return 'bg-rag-green';
}

const impactLabels = ['Low', 'Medium', 'High', 'Critical'];
const likelihoodLabels = ['Unlikely', 'Possible', 'Likely', 'Almost Certain'];

export function RiskMatrix({ risks }: RiskMatrixProps) {
  // Group risks by cell
  const cellRisks: Record<string, Risk[]> = {};
  for (const risk of risks) {
    const key = `${risk.likelihood}-${risk.impact}`;
    if (!cellRisks[key]) cellRisks[key] = [];
    cellRisks[key].push(risk);
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[360px]">
        {/* Y-axis label */}
        <div className="flex">
          <div className="w-24 shrink-0" />
          <div className="flex-1 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 font-heading">
            Impact
          </div>
        </div>

        {/* Column headers */}
        <div className="flex">
          <div className="w-24 shrink-0" />
          <div className="flex-1 grid grid-cols-4 gap-1">
            {impactLabels.map((label) => (
              <div
                key={label}
                className="text-center text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Grid rows (top row = highest likelihood) */}
        <div className="flex">
          {/* Row labels */}
          <div className="w-24 shrink-0 flex flex-col-reverse gap-1 pr-2">
            {likelihoodLabels.map((label) => (
              <div
                key={label}
                className="h-16 flex items-center justify-end text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body text-right"
              >
                {label}
              </div>
            ))}
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-right font-heading mt-1">
              Likelihood
            </div>
          </div>

          {/* Grid cells */}
          <div className="flex-1 flex flex-col-reverse gap-1">
            {[1, 2, 3, 4].map((likelihood) => (
              <div key={likelihood} className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((impact) => {
                  const key = `${likelihood}-${impact}`;
                  const cellItems = cellRisks[key] || [];
                  return (
                    <div
                      key={key}
                      className={`h-16 rounded-md border border-gray-200 dark:border-gray-700 p-1 flex flex-wrap gap-1 items-start content-start ${getCellColor(likelihood, impact)}`}
                      title={cellItems.map((r) => r.title).join(', ')}
                    >
                      {cellItems.map((risk) => (
                        <div
                          key={risk.id}
                          className={`w-5 h-5 rounded-full ${getDotColor(likelihood, impact)} flex items-center justify-center text-[8px] font-bold text-white shadow-sm cursor-default`}
                          title={risk.title}
                        >
                          {risk.id.slice(0, 2)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
