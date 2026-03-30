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
function getCellBg(likelihood: number, impact: number): string {
  const severity = likelihood * impact;
  if (severity >= 12) return 'rgba(220, 38, 38, 0.12)';
  if (severity >= 8) return 'rgba(234, 88, 12, 0.12)';
  if (severity >= 4) return 'rgba(217, 119, 6, 0.12)';
  return 'rgba(22, 163, 74, 0.12)';
}

function getDotBg(likelihood: number, impact: number): string {
  const severity = likelihood * impact;
  if (severity >= 12) return '#dc2626';
  if (severity >= 8) return '#ea580c';
  if (severity >= 4) return '#d97706';
  return '#16a34a';
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
          <div className="flex-1 text-center text-xs font-semibold mb-1 font-heading" style={{ color: 'var(--on-surface-variant)' }}>
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
                className="text-center text-[10px] font-medium font-body"
                style={{ color: 'var(--outline)' }}
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
                className="h-16 flex items-center justify-end text-[10px] font-medium font-body text-right"
                style={{ color: 'var(--outline)' }}
              >
                {label}
              </div>
            ))}
            <div className="text-xs font-semibold text-right font-heading mt-1" style={{ color: 'var(--on-surface-variant)' }}>
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
                      className="h-16 rounded-md p-1 flex flex-wrap gap-1 items-start content-start"
                      style={{ backgroundColor: getCellBg(likelihood, impact) }}
                      title={cellItems.map((r) => r.title).join(', ')}
                    >
                      {cellItems.map((risk) => (
                        <div
                          key={risk.id}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm cursor-default"
                          style={{ backgroundColor: getDotBg(likelihood, impact) }}
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
