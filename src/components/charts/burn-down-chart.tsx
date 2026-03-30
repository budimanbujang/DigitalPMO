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
          stroke="#e8e8ea"
        />
        <XAxis
          dataKey="date"
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
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line
          type="monotone"
          dataKey="planned"
          stroke="#001736"
          strokeWidth={2}
          strokeDasharray="6 3"
          dot={false}
          name="Planned"
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#7c3aed"
          strokeWidth={2}
          dot={{ r: 3, fill: '#7c3aed' }}
          activeDot={{ r: 5 }}
          name="Actual"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
