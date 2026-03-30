'use client';

import React from 'react';

interface HealthGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeConfig = {
  sm: { width: 80, strokeWidth: 6, fontSize: 16, labelSize: 10 },
  md: { width: 120, strokeWidth: 8, fontSize: 24, labelSize: 12 },
  lg: { width: 160, strokeWidth: 10, fontSize: 32, labelSize: 14 },
};

function getColor(score: number): string {
  if (score >= 70) return '#22C55E'; // rag-green
  if (score >= 40) return '#F59E0B'; // rag-amber
  return '#EF4444'; // rag-red
}

export function HealthGauge({ score, size = 'md', label }: HealthGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270-degree arc
  const filledLength = (clampedScore / 100) * arcLength;
  const color = getColor(clampedScore);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg
        width={config.width}
        height={config.width}
        viewBox={`0 0 ${config.width} ${config.width}`}
        className="drop-shadow-sm"
      >
        {/* Background arc */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={config.strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${config.width / 2} ${config.width / 2})`}
        />
        {/* Filled arc */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeDasharray={`${filledLength} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(135 ${config.width / 2} ${config.width / 2})`}
          style={{
            transition: 'stroke-dasharray 0.6s ease-in-out, stroke 0.3s ease',
          }}
        />
        {/* Score text */}
        <text
          x={config.width / 2}
          y={config.width / 2 + config.fontSize * 0.1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={config.fontSize}
          fontWeight="700"
          fill={color}
          className="font-heading"
        >
          {clampedScore}
        </text>
      </svg>
      {label && (
        <span
          className="text-center text-gray-600 dark:text-gray-400 font-body"
          style={{ fontSize: config.labelSize }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
