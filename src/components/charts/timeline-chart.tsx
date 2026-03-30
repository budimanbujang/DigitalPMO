'use client';

import React, { useMemo } from 'react';

interface TimelineItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed' | 'not-started';
  percentComplete: number;
}

interface TimelineChartProps {
  items: TimelineItem[];
  height?: number;
}

const statusColors: Record<TimelineItem['status'], { bar: string; fill: string; text: string }> = {
  'on-track': {
    bar: 'bg-primary/20 dark:bg-primary/30',
    fill: 'bg-primary',
    text: 'text-primary',
  },
  'at-risk': {
    bar: 'bg-rag-amber/20 dark:bg-rag-amber/30',
    fill: 'bg-rag-amber',
    text: 'text-rag-amber',
  },
  delayed: {
    bar: 'bg-rag-red/20 dark:bg-rag-red/30',
    fill: 'bg-rag-red',
    text: 'text-rag-red',
  },
  completed: {
    bar: 'bg-rag-green/20 dark:bg-rag-green/30',
    fill: 'bg-rag-green',
    text: 'text-rag-green',
  },
  'not-started': {
    bar: 'bg-gray-200 dark:bg-gray-700',
    fill: 'bg-gray-400 dark:bg-gray-500',
    text: 'text-gray-500 dark:text-gray-400',
  },
};

const statusLabels: Record<TimelineItem['status'], string> = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  delayed: 'Delayed',
  completed: 'Completed',
  'not-started': 'Not Started',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TimelineChart({ items }: TimelineChartProps) {
  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (items.length === 0) {
      const now = Date.now();
      return { minDate: now, maxDate: now + 86400000, totalDays: 1 };
    }
    const starts = items.map((i) => new Date(i.startDate).getTime());
    const ends = items.map((i) => new Date(i.endDate).getTime());
    const min = Math.min(...starts);
    const max = Math.max(...ends);
    const days = Math.max(1, (max - min) / (1000 * 60 * 60 * 24));
    return { minDate: min, maxDate: max, totalDays: days };
  }, [items]);

  // Generate month markers for the header
  const monthMarkers = useMemo(() => {
    const markers: { label: string; left: number }[] = [];
    const start = new Date(minDate);
    const end = new Date(maxDate);
    const current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      const dayOffset = (current.getTime() - minDate) / (1000 * 60 * 60 * 24);
      const left = Math.max(0, (dayOffset / totalDays) * 100);
      markers.push({
        label: current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        left,
      });
      current.setMonth(current.getMonth() + 1);
    }
    return markers;
  }, [minDate, maxDate, totalDays]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-500 dark:text-gray-400 font-body">
        No timeline items to display
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Month header */}
        <div className="flex">
          <div className="w-40 shrink-0" />
          <div className="flex-1 relative h-6 border-b border-gray-200 dark:border-gray-700">
            {monthMarkers.map((marker, i) => (
              <div
                key={i}
                className="absolute top-0 text-[10px] font-medium text-gray-500 dark:text-gray-400 font-body"
                style={{ left: `${marker.left}%` }}
              >
                <div className="border-l border-gray-300 dark:border-gray-600 pl-1 h-6 flex items-center">
                  {marker.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map((item) => {
            const startOffset = (new Date(item.startDate).getTime() - minDate) / (1000 * 60 * 60 * 24);
            const endOffset = (new Date(item.endDate).getTime() - minDate) / (1000 * 60 * 60 * 24);
            const left = (startOffset / totalDays) * 100;
            const width = Math.max(1, ((endOffset - startOffset) / totalDays) * 100);
            const colors = statusColors[item.status];
            const clamped = Math.max(0, Math.min(100, item.percentComplete));

            return (
              <div key={item.id} className="flex items-center py-2 group">
                {/* Label */}
                <div className="w-40 shrink-0 pr-3">
                  <div className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate font-heading">
                    {item.name}
                  </div>
                  <div className={`text-[10px] ${colors.text} font-body`}>
                    {statusLabels[item.status]}
                  </div>
                </div>

                {/* Bar area */}
                <div className="flex-1 relative h-8">
                  {/* Month grid lines */}
                  {monthMarkers.map((marker, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-l border-gray-100 dark:border-gray-800"
                      style={{ left: `${marker.left}%` }}
                    />
                  ))}

                  {/* Bar container */}
                  <div
                    className={`absolute top-1 h-6 rounded ${colors.bar} overflow-hidden transition-all`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${item.name}: ${formatDate(item.startDate)} - ${formatDate(item.endDate)} (${clamped}%)`}
                  >
                    {/* Filled portion */}
                    <div
                      className={`h-full ${colors.fill} rounded-l transition-all`}
                      style={{ width: `${clamped}%` }}
                    />
                    {/* Percentage label */}
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-gray-800 dark:text-gray-100 font-mono mix-blend-difference">
                      {clamped}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {(Object.keys(statusColors) as TimelineItem['status'][]).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${statusColors[status].fill}`} />
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-body">
                {statusLabels[status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
