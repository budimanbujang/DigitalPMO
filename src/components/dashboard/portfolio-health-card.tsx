'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getTextColor(value: number): string {
  if (value >= 70) return 'text-green-600 dark:text-green-400';
  if (value >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export function PortfolioHealthCard({ score, breakdown }: PortfolioHealthCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Portfolio Health Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <HealthGauge score={score} size="lg" label="Overall Score" />
          <div className="w-full space-y-3 pt-2">
            {breakdownLabels.map(({ key, label }) => {
              const value = breakdown[key];
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={`font-semibold ${getTextColor(value)}`}>
                      {value}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor(value)}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
