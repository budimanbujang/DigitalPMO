'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';

interface BudgetCategory {
  name: string;
  planned: number;
  actual: number;
}

const mockCategories: BudgetCategory[] = [
  { name: 'Personnel', planned: 850000, actual: 920000 },
  { name: 'Infrastructure', planned: 320000, actual: 285000 },
  { name: 'Software Licenses', planned: 180000, actual: 175000 },
  { name: 'Consulting', planned: 250000, actual: 310000 },
  { name: 'Training', planned: 120000, actual: 95000 },
  { name: 'Contingency', planned: 200000, actual: 45000 },
];

const totalPlanned = mockCategories.reduce((s, c) => s + c.planned, 0);
const totalActual = mockCategories.reduce((s, c) => s + c.actual, 0);
const totalRemaining = totalPlanned - totalActual;
const forecastTotal = Math.round(totalActual * 1.15);

export function BudgetTab() {
  const maxBarValue = Math.max(...mockCategories.flatMap((c) => [c.planned, c.actual]));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Allocated"
          value={formatCurrency(totalPlanned)}
          icon={<DollarSign className="h-4 w-4" />}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <SummaryCard
          label="Spent"
          value={formatCurrency(totalActual)}
          icon={<TrendingDown className="h-4 w-4" />}
          color="text-violet-500"
          bgColor="bg-violet-500/10"
        />
        <SummaryCard
          label="Remaining"
          value={formatCurrency(totalRemaining)}
          icon={totalRemaining >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          color={totalRemaining >= 0 ? 'text-green-500' : 'text-red-500'}
          bgColor={totalRemaining >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}
        />
        <SummaryCard
          label="Forecast"
          value={formatCurrency(forecastTotal)}
          icon={<PieChart className="h-4 w-4" />}
          color="text-gray-500"
          bgColor="bg-gray-500/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category breakdown table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">Category</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">Planned</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">Actual</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">Variance</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">% Used</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCategories.map((cat) => {
                    const variance = cat.planned - cat.actual;
                    const pctUsed = Math.round((cat.actual / cat.planned) * 100);
                    return (
                      <tr key={cat.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-3 py-2.5 font-medium text-foreground">{cat.name}</td>
                        <td className="px-3 py-2.5 text-right text-muted-foreground">{formatCurrency(cat.planned)}</td>
                        <td className="px-3 py-2.5 text-right text-foreground">{formatCurrency(cat.actual)}</td>
                        <td className={cn(
                          'px-3 py-2.5 text-right font-medium',
                          variance >= 0 ? 'text-green-500' : 'text-red-500'
                        )}>
                          {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <span className={cn(
                            'inline-block px-2 py-0.5 rounded text-xs font-medium',
                            pctUsed > 100 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            pctUsed > 80 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          )}>
                            {pctUsed}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/40 font-semibold">
                    <td className="px-3 py-2.5 text-foreground">Total</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{formatCurrency(totalPlanned)}</td>
                    <td className="px-3 py-2.5 text-right text-foreground">{formatCurrency(totalActual)}</td>
                    <td className={cn('px-3 py-2.5 text-right', totalRemaining >= 0 ? 'text-green-500' : 'text-red-500')}>
                      {totalRemaining >= 0 ? '+' : ''}{formatCurrency(totalRemaining)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-foreground">
                      {Math.round((totalActual / totalPlanned) * 100)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bar chart: planned vs actual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Planned vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCategories.map((cat) => {
                const plannedPct = (cat.planned / maxBarValue) * 100;
                const actualPct = (cat.actual / maxBarValue) * 100;
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(cat.actual)} / {formatCurrency(cat.planned)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500/60 rounded-full"
                          style={{ width: `${plannedPct}%` }}
                        />
                      </div>
                      <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            cat.actual > cat.planned ? 'bg-red-500/70' : 'bg-violet-500/70'
                          )}
                          style={{ width: `${actualPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded bg-blue-500/60" />
                  Planned
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded bg-violet-500/70" />
                  Actual
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded bg-red-500/70" />
                  Over budget
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Forecast vs Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">{formatCurrency(totalPlanned)}</span>
              </div>
              <div className="h-6 w-full bg-muted/40 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500/60 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Forecast</span>
                <span className={cn('font-medium', forecastTotal > totalPlanned ? 'text-red-500' : 'text-green-500')}>
                  {formatCurrency(forecastTotal)}
                </span>
              </div>
              <div className="h-6 w-full bg-muted/40 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    forecastTotal > totalPlanned ? 'bg-red-500/60' : 'bg-green-500/60'
                  )}
                  style={{ width: `${Math.min((forecastTotal / totalPlanned) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
          {forecastTotal > totalPlanned && (
            <p className="text-xs text-red-500 mt-2">
              Forecast exceeds plan by {formatCurrency(forecastTotal - totalPlanned)} ({Math.round(((forecastTotal - totalPlanned) / totalPlanned) * 100)}% over)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, icon, color, bgColor }: {
  label: string; value: string; icon: React.ReactNode; color: string; bgColor: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className={cn('inline-flex items-center justify-center h-8 w-8 rounded-lg', bgColor, color)}>
        {icon}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
