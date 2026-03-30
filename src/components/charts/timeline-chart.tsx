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

const statusColors: Record<TimelineItem['status'], { barBg: string; fillBg: string; textColor: string; legendBg: string }> = {
  'on-track': {
    barBg: 'rgba(0, 23, 54, 0.12)',
    fillBg: 'var(--primary)',
    textColor: 'var(--primary)',
    legendBg: 'var(--primary)',
  },
  'at-risk': {
    barBg: 'rgba(217, 119, 6, 0.12)',
    fillBg: '#d97706',
    textColor: '#d97706',
    legendBg: '#d97706',
  },
  delayed: {
    barBg: 'rgba(220, 38, 38, 0.12)',
    fillBg: '#dc2626',
    textColor: '#dc2626',
    legendBg: '#dc2626',
  },
  completed: {
    barBg: 'rgba(22, 163, 74, 0.12)',
    fillBg: '#16a34a',
    textColor: '#16a34a',
    legendBg: '#16a34a',
  },
  'not-started': {
    barBg: 'var(--surface-container-high)',
    fillBg: 'var(--outline)',
    textColor: 'var(--outline)',
    legendBg: 'var(--outline)',
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
      <div className="flex items-center justify-center h-32 text-sm font-body" style={{ color: 'var(--outline)' }}>
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
          <div className="flex-1 relative h-6" style={{ borderBottom: '1px solid var(--surface-container-high)' }}>
            {monthMarkers.map((marker, i) => (
              <div
                key={i}
                className="absolute top-0 text-[10px] font-medium font-body"
                style={{ left: `${marker.left}%`, color: 'var(--outline)' }}
              >
                <div className="pl-1 h-6 flex items-center" style={{ borderLeft: '1px solid var(--surface-container-high)' }}>
                  {marker.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-0">
          {items.map((item) => {
            const startOffset = (new Date(item.startDate).getTime() - minDate) / (1000 * 60 * 60 * 24);
            const endOffset = (new Date(item.endDate).getTime() - minDate) / (1000 * 60 * 60 * 24);
            const left = (startOffset / totalDays) * 100;
            const width = Math.max(1, ((endOffset - startOffset) / totalDays) * 100);
            const colors = statusColors[item.status];
            const clamped = Math.max(0, Math.min(100, item.percentComplete));

            return (
              <div key={item.id} className="flex items-center py-2 group" style={{ borderBottom: '1px solid var(--surface-container-low)' }}>
                {/* Label */}
                <div className="w-40 shrink-0 pr-3">
                  <div className="text-xs font-medium truncate font-heading" style={{ color: 'var(--on-surface)' }}>
                    {item.name}
                  </div>
                  <div className="text-[10px] font-body" style={{ color: colors.textColor }}>
                    {statusLabels[item.status]}
                  </div>
                </div>

                {/* Bar area */}
                <div className="flex-1 relative h-8">
                  {/* Month grid lines */}
                  {monthMarkers.map((marker, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0"
                      style={{ left: `${marker.left}%`, borderLeft: '1px solid var(--surface-container-low)' }}
                    />
                  ))}

                  {/* Bar container */}
                  <div
                    className="absolute top-1 h-6 rounded overflow-hidden transition-all"
                    style={{ left: `${left}%`, width: `${width}%`, backgroundColor: colors.barBg }}
                    title={`${item.name}: ${formatDate(item.startDate)} - ${formatDate(item.endDate)} (${clamped}%)`}
                  >
                    {/* Filled portion */}
                    <div
                      className="h-full rounded-l transition-all"
                      style={{ width: `${clamped}%`, backgroundColor: colors.fillBg }}
                    />
                    {/* Percentage label */}
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold font-mono" style={{ color: 'var(--on-surface)', mixBlendMode: 'difference' }}>
                      {clamped}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: '1px solid var(--surface-container-high)' }}>
          {(Object.keys(statusColors) as TimelineItem['status'][]).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: statusColors[status].legendBg }} />
              <span className="text-[10px] font-body" style={{ color: 'var(--on-surface-variant)' }}>
                {statusLabels[status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
