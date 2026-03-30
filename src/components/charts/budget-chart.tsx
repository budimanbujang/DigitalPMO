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
        <rect width="8" height="8" fill="#6B7280" fillOpacity={0.3} />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="8"
          stroke="#6B7280"
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
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          className="fill-gray-600 dark:fill-gray-400"
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
          className="fill-gray-600 dark:fill-gray-400"
        />
        <Tooltip
          formatter={(value: any, name: any) => [
            formatCurrency(value as number),
            (name as string).charAt(0).toUpperCase() + (name as string).slice(1),
          ]}
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #fff)',
            border: '1px solid var(--tooltip-border, #e5e7eb)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          wrapperClassName="[--tooltip-bg:theme(colors.white)] dark:[--tooltip-bg:theme(colors.gray.800)] [--tooltip-border:theme(colors.gray.200)] dark:[--tooltip-border:theme(colors.gray.700)]"
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar
          dataKey="allocated"
          stackId="budget"
          fill="#3B82F6"
          name="Allocated"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="spent"
          stackId="budget"
          fill="#8B5CF6"
          name="Spent"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="forecast"
          stackId="budget"
          fill="url(#forecast-dashed)"
          stroke="#6B7280"
          strokeWidth={1}
          name="Forecast"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
