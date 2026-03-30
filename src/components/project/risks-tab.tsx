'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, X, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type RiskLikelihood = 1 | 2 | 3 | 4;
type RiskImpact = 1 | 2 | 3 | 4;
type RiskStatus = 'OPEN' | 'MITIGATING' | 'RESOLVED' | 'ACCEPTED';
type SortKey = 'title' | 'likelihood' | 'impact' | 'score' | 'status' | 'owner';

interface Risk {
  id: string;
  title: string;
  description: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  status: RiskStatus;
  owner: string;
  mitigation: string;
  aiGenerated: boolean;
}

const likelihoodLabel = ['', 'Rare', 'Unlikely', 'Possible', 'Likely'];
const impactLabel = ['', 'Low', 'Medium', 'High', 'Critical'];

const MOCK_RISKS: Risk[] = [
  {
    id: 'r1', title: 'Vendor delivery delay', description: 'Key vendor may miss delivery timeline for critical components',
    likelihood: 3, impact: 4, status: 'OPEN', owner: 'Ahmad', mitigation: 'Engage backup vendor, weekly tracking calls', aiGenerated: false,
  },
  {
    id: 'r2', title: 'Resource attrition', description: 'Senior developers may leave mid-project due to market conditions',
    likelihood: 2, impact: 3, status: 'MITIGATING', owner: 'Siti', mitigation: 'Retention bonuses approved, knowledge transfer sessions scheduled', aiGenerated: false,
  },
  {
    id: 'r3', title: 'Scope creep from stakeholders', description: 'Continuous change requests from business units exceeding change budget',
    likelihood: 4, impact: 3, status: 'OPEN', owner: 'Faizal', mitigation: 'Strict change control board process, CR impact assessment template', aiGenerated: false,
  },
  {
    id: 'r4', title: 'Data migration integrity', description: 'AI detected: Historical data quality issues may cause migration failures',
    likelihood: 3, impact: 4, status: 'OPEN', owner: 'Lee', mitigation: 'Data profiling and cleansing sprints before migration', aiGenerated: true,
  },
  {
    id: 'r5', title: 'Integration complexity underestimated', description: 'AI detected: Third-party API dependencies show inconsistent response patterns',
    likelihood: 3, impact: 3, status: 'MITIGATING', owner: 'Tan', mitigation: 'Build adapter layer, increase integration testing allocation', aiGenerated: true,
  },
  {
    id: 'r6', title: 'Budget overrun on consultancy', description: 'External consultancy rates increased 15% since contract signing',
    likelihood: 2, impact: 2, status: 'ACCEPTED', owner: 'Farah', mitigation: 'Negotiate fixed-price blocks for remaining work', aiGenerated: false,
  },
  {
    id: 'r7', title: 'Regulatory compliance gap', description: 'New PDPA amendments may require additional data handling controls',
    likelihood: 2, impact: 4, status: 'OPEN', owner: 'Ahmad', mitigation: 'Legal review scheduled, compliance checkpoint added to UAT', aiGenerated: false,
  },
  {
    id: 'r8', title: 'Performance bottleneck predicted', description: 'AI detected: Current architecture may not handle peak load projections',
    likelihood: 2, impact: 3, status: 'OPEN', owner: 'Lee', mitigation: 'Load testing sprint planned, auto-scaling architecture review', aiGenerated: true,
  },
];

function riskScore(l: number, i: number) { return l * i; }

function scoreColor(score: number) {
  if (score >= 12) return 'bg-red-500 text-white';
  if (score >= 8) return 'bg-orange-500 text-white';
  if (score >= 4) return 'bg-yellow-400 text-black dark:text-black';
  return 'bg-green-500 text-white';
}

const statusVariant = (s: RiskStatus) => {
  switch (s) {
    case 'OPEN': return 'rag-red' as const;
    case 'MITIGATING': return 'rag-amber' as const;
    case 'RESOLVED': return 'rag-green' as const;
    case 'ACCEPTED': return 'secondary' as const;
  }
};

export function RisksTab() {
  const [risks, setRisks] = useState<Risk[]>(MOCK_RISKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortAsc, setSortAsc] = useState(false);

  const addRisk = () => {
    if (!newTitle.trim()) return;
    setRisks((prev) => [...prev, {
      id: `r-new-${Date.now()}`, title: newTitle.trim(), description: '', likelihood: 2 as RiskLikelihood,
      impact: 2 as RiskImpact, status: 'OPEN' as RiskStatus, owner: 'Unassigned', mitigation: 'To be defined', aiGenerated: false,
    }]);
    setNewTitle('');
    setShowAdd(false);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sortedRisks = [...risks].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'title': cmp = a.title.localeCompare(b.title); break;
      case 'likelihood': cmp = a.likelihood - b.likelihood; break;
      case 'impact': cmp = a.impact - b.impact; break;
      case 'score': cmp = riskScore(a.likelihood, a.impact) - riskScore(b.likelihood, b.impact); break;
      case 'status': cmp = a.status.localeCompare(b.status); break;
      case 'owner': cmp = a.owner.localeCompare(b.owner); break;
    }
    return sortAsc ? cmp : -cmp;
  });

  // Build matrix data
  const matrix: Record<string, Risk[]> = {};
  for (let l = 4; l >= 1; l--) {
    for (let i = 1; i <= 4; i++) {
      matrix[`${l}-${i}`] = risks.filter((r) => r.likelihood === l && r.impact === i && r.status !== 'RESOLVED');
    }
  }

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-3 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn('h-3 w-3', sortKey === field ? 'text-foreground' : 'text-muted-foreground/50')} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Risk Register ({risks.length})</h3>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Risk
        </Button>
      </div>

      {showAdd && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
          <Input
            placeholder="Risk title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRisk()}
            autoFocus
            className="flex-1"
          />
          <Button size="sm" onClick={addRisk}>Add</Button>
          <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setNewTitle(''); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Risk table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <SortHeader label="Risk" field="title" />
                  <SortHeader label="Likelihood" field="likelihood" />
                  <SortHeader label="Impact" field="impact" />
                  <SortHeader label="Score" field="score" />
                  <SortHeader label="Status" field="status" />
                  <SortHeader label="Owner" field="owner" />
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">AI</th>
                </tr>
              </thead>
              <tbody>
                {sortedRisks.map((risk) => {
                  const score = riskScore(risk.likelihood, risk.impact);
                  return (
                    <tr key={risk.id} className={cn(
                      'border-b border-border hover:bg-muted/30',
                      risk.aiGenerated && 'border-l-2 border-l-violet-500'
                    )}>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-foreground">{risk.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{risk.description}</div>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <Badge variant={risk.likelihood >= 3 ? 'rag-amber' : 'secondary'} className="text-[10px]">
                          {likelihoodLabel[risk.likelihood]}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <Badge variant={risk.impact >= 3 ? 'rag-red' : risk.impact >= 2 ? 'rag-amber' : 'rag-green'} className="text-[10px]">
                          {impactLabel[risk.impact]}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold', scoreColor(score))}>
                          {score}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={statusVariant(risk.status)}>{risk.status}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{risk.owner}</td>
                      <td className="px-3 py-2.5 text-center">
                        {risk.aiGenerated && <Sparkles className="h-4 w-4 text-violet-500 inline" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4x4 Risk matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Risk Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="w-16 text-[10px] text-muted-foreground text-right pr-1">Likelihood</div>
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-[10px] text-center text-muted-foreground">{impactLabel[i]}</div>
                  ))}
                </div>
              </div>
              {[4, 3, 2, 1].map((l) => (
                <div key={l} className="flex items-center gap-1">
                  <div className="w-16 text-[10px] text-muted-foreground text-right pr-1">{likelihoodLabel[l]}</div>
                  <div className="flex-1 grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((i) => {
                      const cellRisks = matrix[`${l}-${i}`] || [];
                      const score = l * i;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'h-12 rounded-md flex items-center justify-center text-[10px] font-medium',
                            score >= 12 ? 'bg-red-500/20 text-red-500' :
                            score >= 8 ? 'bg-orange-500/20 text-orange-500' :
                            score >= 4 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                            'bg-green-500/20 text-green-500'
                          )}
                          title={`L:${likelihoodLabel[l]} I:${impactLabel[i]} - ${cellRisks.length} risks`}
                        >
                          {cellRisks.length > 0 && (
                            <div className="flex gap-0.5">
                              {cellRisks.map((r) => (
                                <div key={r.id} className={cn(
                                  'h-2.5 w-2.5 rounded-full',
                                  score >= 12 ? 'bg-red-500' :
                                  score >= 8 ? 'bg-orange-500' :
                                  score >= 4 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                )} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1 mt-1">
                <div className="w-16" />
                <div className="flex-1 text-center text-[10px] text-muted-foreground">Impact</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
