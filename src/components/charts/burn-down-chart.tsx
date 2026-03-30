'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BurnDownDataPoint {
  date: string;
  planned: number;
  actual: number;
}

interface BurnDownChartProps {
  data: BurnDownDataPoint[];
  height?: number;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function BurnDownChart({ data, height = 300 }: BurnDownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <XAxis
          dataKey="date"
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
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="planned"
          stroke="#3B82F6"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
          name="Planned"
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={{ r: 3, fill: '#8B5CF6' }}
          activeDot={{ r: 5 }}
          name="Actual"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
