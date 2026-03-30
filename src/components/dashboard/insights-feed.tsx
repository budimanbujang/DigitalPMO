'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Check, ExternalLink } from 'lucide-react';
import type { AIInsight, InsightSeverity, InsightType } from '@/lib/mock-data';
import { formatRelativeDate } from '@/lib/utils';

interface InsightsFeedProps {
  insights: AIInsight[];
}

function severityColor(severity: InsightSeverity) {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'LOW':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  }
}

function typeLabel(type: InsightType): string {
  switch (type) {
    case 'RISK': return 'Risk';
    case 'BUDGET': return 'Budget';
    case 'SCHEDULE': return 'Schedule';
    case 'RESOURCE': return 'Resource';
    case 'SCOPE': return 'Scope';
    case 'QUALITY': return 'Quality';
  }
}

export function InsightsFeed({ insights }: InsightsFeedProps) {
  const [acknowledged, setAcknowledged] = useState<Set<string>>(
    new Set(insights.filter((i) => i.acknowledged).map((i) => i.id))
  );

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => new Set([...prev, id]));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            AI Insights
          </CardTitle>
          <Badge variant="ai" className="text-[10px]">
            {insights.filter((i) => !acknowledged.has(i.id)).length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <ScrollArea className="h-[400px] lg:h-[480px]">
          <div className="space-y-3 pr-2">
            {insights.map((insight) => {
              const isAck = acknowledged.has(insight.id);
              return (
                <div
                  key={insight.id}
                  className={`relative rounded-lg border p-3 transition-all ${
                    isAck
                      ? 'border-border/50 opacity-60'
                      : 'border-border bg-card'
                  }`}
                >
                  {/* Purple left border for AI indicator */}
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-violet-500" />

                  <div className="pl-3 space-y-2">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${severityColor(
                          insight.severity
                        )}`}
                      >
                        {insight.severity}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {typeLabel(insight.type)}
                      </span>
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        {formatRelativeDate(insight.timestamp)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-semibold text-foreground leading-tight">
                      {insight.title}
                    </h4>

                    {/* Summary */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.summary}
                    </p>

                    {/* Footer: project link + acknowledge */}
                    <div className="flex items-center justify-between pt-1">
                      <Link
                        href={`/projects/${insight.projectId}`}
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                      >
                        {insight.projectName}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      {!isAck && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          onClick={() => handleAcknowledge(insight.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
