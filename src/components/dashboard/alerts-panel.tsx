'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      return <Clock className="h-4 w-4 text-red-500" />;
    case 'BUDGET':
      return <DollarSign className="h-4 w-4 text-amber-500" />;
    case 'MILESTONE':
      return <Flag className="h-4 w-4 text-orange-500" />;
    case 'RISK':
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    case 'APPROVAL':
      return <FileCheck className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
}

function alertTypeBorder(type: AlertType): string {
  switch (type) {
    case 'OVERDUE':
      return 'border-l-red-500';
    case 'BUDGET':
      return 'border-l-amber-500';
    case 'MILESTONE':
      return 'border-l-orange-500';
    case 'RISK':
      return 'border-l-red-500';
    case 'APPROVAL':
      return 'border-l-blue-500';
    default:
      return 'border-l-muted-foreground';
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Active Alerts
          </CardTitle>
          {activeAlerts.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-red-100 px-1.5 text-[10px] font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {activeAlerts.length}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ScrollArea className="h-[300px] lg:h-[360px]">
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`relative rounded-lg border border-l-[3px] ${alertTypeBorder(
                    alert.type
                  )} bg-card p-3 transition-all hover:bg-accent/30`}
                >
                  <div className="space-y-2">
                    {/* Header row */}
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">
                        {alertTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground leading-tight">
                          {alert.title}
                        </h4>
                        {alert.projectName && (
                          <span className="text-[10px] text-muted-foreground">
                            {alert.projectName}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Message */}
                    <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                      {alert.message}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pl-6">
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeDate(alert.timestamp)}
                      </span>
                      {alert.actionHref && alert.actionLabel && (
                        <Link href={alert.actionHref}>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
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
      </CardContent>
    </Card>
  );
}
