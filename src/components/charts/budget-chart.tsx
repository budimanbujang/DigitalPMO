'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BudgetDataPoint {
  name: string;
  allocated: number;
  spent: number;
  forecast: number;
}

interface BudgetChartProps {
  data: BudgetDataPoint[];
  height?: number;
}

function ForecastPattern() {
  return (
    <defs>
      <pattern
        id="forecast-dashed"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
        patternTransform="rotate(45)"
      >
        <rect width="8" height="8" fill="#74777f" fillOpacity={0.3} />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="8"
          stroke="#74777f"
          strokeWidth="4"
          strokeOpacity={0.6}
        />
      </pattern>
    </defs>
  );
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function BudgetChart({ data, height = 300 }: BudgetChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <ForecastPattern />
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e8e8ea"
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#44474e' }}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12, fill: '#44474e' }}
        />
        <Tooltip
          formatter={(value: any, name: any) => [
            formatCurrency(value as number),
            (name as string).charAt(0).toUpperCase() + (name as string).slice(1),
          ]}
          contentStyle={{
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: 12,
            boxShadow: '0 12px 40px rgba(26, 28, 30, 0.06)',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar
          dataKey="allocated"
          stackId="budget"
          fill="#001736"
          name="Allocated"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="spent"
          stackId="budget"
          fill="#7c3aed"
          name="Spent"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="forecast"
          stackId="budget"
          fill="url(#forecast-dashed)"
          stroke="#74777f"
          strokeWidth={1}
          name="Forecast"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
