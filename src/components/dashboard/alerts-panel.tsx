'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Clock,
  DollarSign,
  Flag,
  ShieldAlert,
  FileCheck,
  X,
  ArrowRight,
} from 'lucide-react';
import type { DashboardAlert, AlertType } from '@/lib/mock-data';
import { formatRelativeDate } from '@/lib/utils';

interface AlertsPanelProps {
  alerts: DashboardAlert[];
}

function alertTypeIcon(type: AlertType) {
  switch (type) {
    case 'OVERDUE':
      return <Clock className="h-4 w-4" style={{ color: '#dc2626' }} />;
    case 'BUDGET':
      return <DollarSign className="h-4 w-4" style={{ color: '#d97706' }} />;
    case 'MILESTONE':
      return <Flag className="h-4 w-4" style={{ color: '#ea580c' }} />;
    case 'RISK':
      return <ShieldAlert className="h-4 w-4" style={{ color: '#dc2626' }} />;
    case 'APPROVAL':
      return <FileCheck className="h-4 w-4" style={{ color: '#2563eb' }} />;
    default:
      return <Bell className="h-4 w-4" style={{ color: '#74777f' }} />;
  }
}

function alertPillarColor(type: AlertType): string {
  switch (type) {
    case 'OVERDUE': return '#dc2626';
    case 'BUDGET': return '#d97706';
    case 'MILESTONE': return '#ea580c';
    case 'RISK': return '#dc2626';
    case 'APPROVAL': return '#2563eb';
    default: return '#74777f';
  }
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(
    new Set(alerts.filter((a) => a.dismissed).map((a) => a.id))
  );

  const activeAlerts = alerts.filter((a) => !dismissed.has(a.id));

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  return (
    <div
      className="bg-white rounded-xl h-full flex flex-col"
      style={{ boxShadow: '0 12px 40px rgba(26, 28, 30, 0.06)' }}
    >
      <div className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <h3
            className="text-base font-semibold font-heading flex items-center gap-2"
            style={{ color: '#1a1c1e', letterSpacing: '-0.02em' }}
          >
            <Bell className="h-4 w-4" style={{ color: '#74777f' }} />
            Active Alerts
          </h3>
          {activeAlerts.length > 0 && (
            <span
              className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full px-1.5 text-[10px] font-bold"
              style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}
            >
              {activeAlerts.length}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 px-6 pb-6">
        <ScrollArea className="h-[300px] lg:h-[360px]">
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32">
              <Bell className="h-8 w-8 mb-2 opacity-20" style={{ color: '#74777f' }} />
              <p className="text-sm font-body" style={{ color: '#74777f' }}>
                No active alerts
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="relative rounded-lg p-3 transition-all"
                  style={{
                    backgroundColor: '#f9f9fc',
                    borderLeft: `3px solid ${alertPillarColor(alert.type)}`,
                  }}
                >
                  <div className="space-y-2">
                    {/* Header row */}
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">
                        {alertTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-sm font-semibold leading-tight font-body"
                          style={{ color: '#1a1c1e' }}
                        >
                          {alert.title}
                        </h4>
                        {alert.projectName && (
                          <span className="text-[10px] font-body" style={{ color: '#74777f' }}>
                            {alert.projectName}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="shrink-0 rounded p-0.5 transition-colors"
                        style={{ color: '#74777f' }}
                        title="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Message */}
                    <p className="text-xs leading-relaxed pl-6 font-body" style={{ color: '#44474e' }}>
                      {alert.message}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pl-6">
                      <span className="text-[10px] font-body" style={{ color: '#74777f' }}>
                        {formatRelativeDate(alert.timestamp)}
                      </span>
                      {alert.actionHref && alert.actionLabel && (
                        <Link href={alert.actionHref}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            style={{ color: '#001736' }}
                          >
                            {alert.actionLabel}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
