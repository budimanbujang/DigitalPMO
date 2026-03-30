'use client';

import React from 'react';
import { HealthGauge } from '@/components/charts/health-gauge';
import type { PortfolioHealthBreakdown } from '@/lib/mock-data';

interface PortfolioHealthCardProps {
  score: number;
  breakdown: PortfolioHealthBreakdown;
}

const breakdownLabels: { key: keyof PortfolioHealthBreakdown; label: string }[] = [
  { key: 'schedule', label: 'Schedule' },
  { key: 'budget', label: 'Budget' },
  { key: 'scope', label: 'Scope' },
  { key: 'risk', label: 'Risk' },
  { key: 'team', label: 'Team' },
];

function getBarColor(value: number): string {
  if (value >= 70) return '#16a34a';
  if (value >= 40) return '#d97706';
  return '#dc2626';
}

function getTextColor(value: number): string {
  if (value >= 70) return '#16a34a';
  if (value >= 40) return '#d97706';
  return '#dc2626';
}

export function PortfolioHealthCard({ score, breakdown }: PortfolioHealthCardProps) {
  return (
    <div
      className="bg-white rounded-xl h-full"
      style={{ boxShadow: '0 12px 40px rgba(26, 28, 30, 0.06)' }}
    >
      <div className="p-6 pb-2">
        <h3
          className="text-base font-semibold font-heading"
          style={{ color: '#1a1c1e', letterSpacing: '-0.02em' }}
        >
          Portfolio Health Score
        </h3>
      </div>
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center gap-4">
          <HealthGauge score={score} size="lg" label="Overall Score" />
          <div className="w-full space-y-3 pt-2">
            {breakdownLabels.map(({ key, label }) => {
              const value = breakdown[key];
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-body">
                    <span style={{ color: '#44474e' }}>{label}</span>
                    <span
                      className="font-semibold"
                      style={{ color: getTextColor(value) }}
                    >
                      {value}
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full rounded-full"
                    style={{ backgroundColor: '#e8e8ea' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${value}%`,
                        backgroundColor: getBarColor(value),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
