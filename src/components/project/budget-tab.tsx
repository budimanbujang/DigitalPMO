'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
          iconColor="#3B82F6"
          iconBg="rgba(59,130,246,0.1)"
        />
        <SummaryCard
          label="Spent"
          value={formatCurrency(totalActual)}
          icon={<TrendingDown className="h-4 w-4" />}
          iconColor="#7c3aed"
          iconBg="rgba(124,58,237,0.1)"
        />
        <SummaryCard
          label="Remaining"
          value={formatCurrency(totalRemaining)}
          icon={totalRemaining >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          iconColor={totalRemaining >= 0 ? '#22C55E' : '#EF4444'}
          iconBg={totalRemaining >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}
        />
        <SummaryCard
          label="Forecast"
          value={formatCurrency(forecastTotal)}
          icon={<PieChart className="h-4 w-4" />}
          iconColor="#6B7280"
          iconBg="rgba(107,114,128,0.1)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category breakdown table */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: '#1a1c1e' }}>
            Category Breakdown
          </h3>
          <div className="rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f3f3f6' }}>
                  <th className="text-left px-3 py-2 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Category</th>
                  <th className="text-right px-3 py-2 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Planned</th>
                  <th className="text-right px-3 py-2 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Actual</th>
                  <th className="text-right px-3 py-2 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Variance</th>
                  <th className="text-right px-3 py-2 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>% Used</th>
                </tr>
              </thead>
              <tbody>
                {mockCategories.map((cat, idx) => {
                  const variance = cat.planned - cat.actual;
                  const pctUsed = Math.round((cat.actual / cat.planned) * 100);
                  return (
                    <tr
                      key={cat.name}
                      style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9fc' }}
                      className="transition-colors"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f3f6'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f9f9fc'; }}
                    >
                      <td className="px-3 py-2.5 font-medium" style={{ color: '#1a1c1e', fontFamily: 'Inter, sans-serif' }}>{cat.name}</td>
                      <td className="px-3 py-2.5 text-right" style={{ color: '#74777f' }}>{formatCurrency(cat.planned)}</td>
                      <td className="px-3 py-2.5 text-right" style={{ color: '#1a1c1e' }}>{formatCurrency(cat.actual)}</td>
                      <td className="px-3 py-2.5 text-right font-medium" style={{ color: variance >= 0 ? '#22C55E' : '#EF4444' }}>
                        {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: pctUsed > 100 ? '#fee2e2' : pctUsed > 80 ? '#fef3c7' : '#dcfce7',
                            color: pctUsed > 100 ? '#b91c1c' : pctUsed > 80 ? '#b45309' : '#15803d',
                          }}
                        >
                          {pctUsed}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f3f3f6' }}>
                  <td className="px-3 py-2.5 font-semibold" style={{ color: '#1a1c1e' }}>Total</td>
                  <td className="px-3 py-2.5 text-right font-semibold" style={{ color: '#74777f' }}>{formatCurrency(totalPlanned)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold" style={{ color: '#1a1c1e' }}>{formatCurrency(totalActual)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold" style={{ color: totalRemaining >= 0 ? '#22C55E' : '#EF4444' }}>
                    {totalRemaining >= 0 ? '+' : ''}{formatCurrency(totalRemaining)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold" style={{ color: '#1a1c1e' }}>
                    {Math.round((totalActual / totalPlanned) * 100)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Bar chart: planned vs actual */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: '#1a1c1e' }}>
            Planned vs Actual
          </h3>
          <div className="space-y-4">
            {mockCategories.map((cat) => {
              const plannedPct = (cat.planned / maxBarValue) * 100;
              const actualPct = (cat.actual / maxBarValue) * 100;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className="font-medium" style={{ color: '#1a1c1e' }}>{cat.name}</span>
                    <span style={{ color: '#74777f' }}>
                      {formatCurrency(cat.actual)} / {formatCurrency(cat.planned)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#e8e8ea' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${plannedPct}%`, backgroundColor: 'rgba(59,130,246,0.6)' }}
                      />
                    </div>
                    <div className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#e8e8ea' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${actualPct}%`,
                          backgroundColor: cat.actual > cat.planned ? 'rgba(239,68,68,0.7)' : 'rgba(124,58,237,0.7)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 pt-2 text-xs" style={{ color: '#74777f' }}>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded" style={{ backgroundColor: 'rgba(59,130,246,0.6)' }} />
                Planned
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded" style={{ backgroundColor: 'rgba(124,58,237,0.7)' }} />
                Actual
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.7)' }} />
                Over budget
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast comparison */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: '#1a1c1e' }}>
          Forecast vs Plan
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span style={{ color: '#74777f' }}>Plan</span>
              <span className="font-medium" style={{ color: '#1a1c1e' }}>{formatCurrency(totalPlanned)}</span>
            </div>
            <div className="h-6 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#e8e8ea' }}>
              <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: 'rgba(59,130,246,0.6)' }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span style={{ color: '#74777f' }}>Forecast</span>
              <span className="font-medium" style={{ color: forecastTotal > totalPlanned ? '#EF4444' : '#22C55E' }}>
                {formatCurrency(forecastTotal)}
              </span>
            </div>
            <div className="h-6 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#e8e8ea' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((forecastTotal / totalPlanned) * 100, 100)}%`,
                  backgroundColor: forecastTotal > totalPlanned ? 'rgba(239,68,68,0.6)' : 'rgba(34,197,94,0.6)',
                }}
              />
            </div>
          </div>
        </div>
        {forecastTotal > totalPlanned && (
          <p className="text-xs mt-2" style={{ color: '#EF4444' }}>
            Forecast exceeds plan by {formatCurrency(forecastTotal - totalPlanned)} ({Math.round(((forecastTotal - totalPlanned) / totalPlanned) * 100)}% over)
          </p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, iconColor, iconBg }: {
  label: string; value: string; icon: React.ReactNode; iconColor: string; iconBg: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 space-y-2"
      style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
    >
      <div
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>{label}</div>
      <div className="text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#1a1c1e' }}>{value}</div>
    </div>
  );
}
