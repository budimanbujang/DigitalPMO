'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Check, ExternalLink } from 'lucide-react';
import type { AIInsight, InsightSeverity, InsightType } from '@/lib/mock-data';
import { formatRelativeDate } from '@/lib/utils';

interface InsightsFeedProps {
  insights: AIInsight[];
}

function severityBadgeStyles(severity: InsightSeverity): { bg: string; text: string } {
  switch (severity) {
    case 'CRITICAL': return { bg: '#fef2f2', text: '#dc2626' };
    case 'HIGH': return { bg: '#fff7ed', text: '#ea580c' };
    case 'MEDIUM': return { bg: '#fffbeb', text: '#d97706' };
    case 'LOW': return { bg: '#eff6ff', text: '#2563eb' };
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
            <Sparkles className="h-4 w-4" style={{ color: '#7c3aed' }} />
            AI Insights
          </h3>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}
          >
            {insights.filter((i) => !acknowledged.has(i.id)).length} new
          </span>
        </div>
      </div>
      <div className="flex-1 px-6 pb-6">
        <ScrollArea className="h-[400px] lg:h-[480px]">
          <div className="space-y-3 pr-2">
            {insights.map((insight) => {
              const isAck = acknowledged.has(insight.id);
              const sevStyles = severityBadgeStyles(insight.severity);
              return (
                <div
                  key={insight.id}
                  className={`relative rounded-lg p-3 transition-all ${
                    isAck ? 'opacity-60' : ''
                  }`}
                  style={{
                    backgroundColor: isAck ? '#f9f9fc' : '#ffffff',
                    borderLeft: '3px solid #7c3aed',
                  }}
                >
                  <div className="pl-3 space-y-2">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: sevStyles.bg, color: sevStyles.text }}
                      >
                        {insight.severity}
                      </span>
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ backgroundColor: '#f3f3f6', color: '#44474e' }}
                      >
                        {typeLabel(insight.type)}
                      </span>
                      <span className="ml-auto text-[10px] font-body" style={{ color: '#74777f' }}>
                        {formatRelativeDate(insight.timestamp)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4
                      className="text-sm font-semibold leading-tight font-body"
                      style={{ color: '#1a1c1e' }}
                    >
                      {insight.title}
                    </h4>

                    {/* Summary */}
                    <p className="text-xs leading-relaxed font-body" style={{ color: '#44474e' }}>
                      {insight.summary}
                    </p>

                    {/* Footer: project link + acknowledge */}
                    <div className="flex items-center justify-between pt-1">
                      <Link
                        href={`/projects/${insight.projectId}`}
                        className="inline-flex items-center gap-1 text-[11px] font-body hover:underline"
                        style={{ color: '#001736' }}
                      >
                        {insight.projectName}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      {!isAck && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          style={{ color: '#44474e' }}
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
      </div>
    </div>
  );
}
