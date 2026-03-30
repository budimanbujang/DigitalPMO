'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { StepProps } from './wizard-shell'

interface AISuggestion {
  id: string
  type: 'milestone' | 'risk' | 'cadence' | 'metric'
  title: string
  description: string
  actionLabel: string
}

function generateMockSuggestions(formData: {
  name: string
  milestones: { name: string }[]
  startDate: string
  targetEndDate: string
  totalBudget: number
  teamMembers: { name: string; role: string }[]
  budgetLineItems: { category: string }[]
}): AISuggestion[] {
  const suggestions: AISuggestion[] = []

  const hasUAT = formData.milestones.some(m =>
    m.name.toLowerCase().includes('uat') || m.name.toLowerCase().includes('user acceptance')
  )
  if (!hasUAT) {
    suggestions.push({
      id: 'ms-uat',
      type: 'milestone',
      title: 'Add UAT Milestone',
      description: 'Consider adding a User Acceptance Testing (UAT) milestone before go-live. This is critical for validating the solution meets stakeholder expectations.',
      actionLabel: 'Add Milestone',
    })
  }

  const hasDataMigration = formData.milestones.some(m =>
    m.name.toLowerCase().includes('migration') || m.name.toLowerCase().includes('data')
  )
  if (!hasDataMigration) {
    suggestions.push({
      id: 'ms-migration',
      type: 'milestone',
      title: 'Missing Data Migration Deliverable',
      description: 'No data migration deliverable detected — typical for projects involving system changes. Consider adding a data migration plan and validation checkpoint.',
      actionLabel: 'Add Deliverable',
    })
  }

  if (formData.startDate && formData.targetEndDate) {
    const days = Math.ceil(
      (new Date(formData.targetEndDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (days < 180 && formData.milestones.length >= 3) {
      suggestions.push({
        id: 'risk-timeline',
        type: 'risk',
        title: 'Aggressive Timeline',
        description: `Risk: Timeline appears aggressive for the scope (${days} days with ${formData.milestones.length} milestones). Consider adding a 2-week buffer between major milestones.`,
        actionLabel: 'Accept Risk',
      })
    }
  }

  if (formData.totalBudget > 0 && formData.teamMembers.length > 3) {
    suggestions.push({
      id: 'risk-budget',
      type: 'risk',
      title: 'Budget-to-Team Ratio',
      description: `With ${formData.teamMembers.length} team members and a budget of ${formData.totalBudget.toLocaleString()}, ensure personnel costs are adequately covered for the full project duration.`,
      actionLabel: 'Accept Risk',
    })
  }

  const hasTesters = formData.teamMembers.some(m => m.role === 'Tester')
  if (!hasTesters && formData.teamMembers.length > 0) {
    suggestions.push({
      id: 'risk-no-tester',
      type: 'risk',
      title: 'No Dedicated Tester',
      description: 'No team member with a Tester role has been assigned. Quality assurance coverage may be insufficient.',
      actionLabel: 'Accept Risk',
    })
  }

  const hasContingency = formData.budgetLineItems.some(i =>
    i.category.toLowerCase().includes('contingency')
  )
  if (!hasContingency && formData.budgetLineItems.length > 0) {
    suggestions.push({
      id: 'risk-contingency',
      type: 'risk',
      title: 'No Contingency Budget',
      description: 'No contingency budget line item detected. Best practice is to allocate 10-15% of total budget for contingencies.',
      actionLabel: 'Accept Risk',
    })
  }

  suggestions.push({
    id: 'cadence-weekly',
    type: 'cadence',
    title: 'Weekly Status Reporting',
    description: 'Based on the project scope and timeline, a weekly reporting cadence is recommended. This includes RAG status updates, milestone progress, and risk review.',
    actionLabel: 'Accept',
  })

  suggestions.push({
    id: 'metric-schedule',
    type: 'metric',
    title: 'Schedule Performance Index (SPI)',
    description: 'Track earned value vs. planned value to monitor schedule adherence. Target SPI >= 0.95.',
    actionLabel: 'Track',
  })

  suggestions.push({
    id: 'metric-budget',
    type: 'metric',
    title: 'Cost Performance Index (CPI)',
    description: 'Monitor budget utilization against planned spend. Alert threshold at CPI < 0.90.',
    actionLabel: 'Track',
  })

  suggestions.push({
    id: 'metric-milestone',
    type: 'metric',
    title: 'Milestone Completion Rate',
    description: 'Percentage of milestones completed on time. Target: 85%+ on-time delivery.',
    actionLabel: 'Track',
  })

  return suggestions
}

const TYPE_CONFIG = {
  milestone: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Suggested Milestone',
  },
  risk: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    label: 'Identified Risk',
  },
  cadence: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    label: 'Reporting Cadence',
  },
  metric: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'text-[var(--ai-accent)]',
    bg: 'bg-violet-50',
    label: 'Key Metric',
  },
}

export function StepAISetup({ formData, setFormData }: StepProps) {
  const [analyzing, setAnalyzing] = React.useState(true)
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([])
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())
  const [accepted, setAccepted] = React.useState<Set<string>>(
    new Set([...formData.acceptedSuggestions, ...formData.acceptedRisks, ...(formData.reportingCadence ? ['cadence-weekly'] : []), ...formData.keyMetrics])
  )

  React.useEffect(() => {
    setAnalyzing(true)
    const timer = setTimeout(() => {
      const mockSuggestions = generateMockSuggestions(formData)
      setSuggestions(mockSuggestions)
      setAnalyzing(false)
    }, 2500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleAccept(suggestion: AISuggestion) {
    setAccepted(prev => new Set([...prev, suggestion.id]))

    if (suggestion.type === 'milestone') {
      setFormData(prev => ({
        ...prev,
        acceptedSuggestions: [...prev.acceptedSuggestions, suggestion.id],
      }))
    } else if (suggestion.type === 'risk') {
      setFormData(prev => ({
        ...prev,
        acceptedRisks: [...prev.acceptedRisks, suggestion.id],
      }))
    } else if (suggestion.type === 'cadence') {
      setFormData(prev => ({
        ...prev,
        reportingCadence: 'Weekly',
      }))
    } else if (suggestion.type === 'metric') {
      setFormData(prev => ({
        ...prev,
        keyMetrics: [...prev.keyMetrics, suggestion.title],
      }))
    }
  }

  function handleDismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]))
  }

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id))
  const groupedSuggestions = {
    milestone: visibleSuggestions.filter(s => s.type === 'milestone'),
    risk: visibleSuggestions.filter(s => s.type === 'risk'),
    cadence: visibleSuggestions.filter(s => s.type === 'cadence'),
    metric: visibleSuggestions.filter(s => s.type === 'metric'),
  }

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        {/* AI Animated Indicator */}
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[var(--ai-accent)] to-indigo-500 flex items-center justify-center">
            <svg className="h-10 w-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div className="absolute -inset-3 rounded-full border-2 border-[var(--ai-accent)]/30 animate-ping" />
          <div className="absolute -inset-6 rounded-full border border-[var(--ai-accent)]/20 animate-[ping_2s_ease-in-out_infinite]" />
        </div>

        <h3 className="text-lg font-semibold text-[var(--on-surface)] mb-2">Analyzing your project...</h3>
        <p className="text-sm text-[var(--on-surface-variant)] text-center max-w-md mb-6">
          AI is reviewing your project details to identify potential gaps, risks, and recommendations.
        </p>

        {/* Progress indicators */}
        <div className="space-y-3 w-full max-w-sm">
          {[
            { label: 'Reviewing milestones & deliverables', delay: '0s' },
            { label: 'Analyzing timeline feasibility', delay: '0.5s' },
            { label: 'Assessing budget allocation', delay: '1s' },
            { label: 'Evaluating team composition', delay: '1.5s' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm text-[var(--on-surface-variant)] animate-[fadeIn_0.5s_ease-in-out_forwards] opacity-0"
              style={{ animationDelay: item.delay }}
            >
              <div className="h-4 w-4 rounded-full border-2 border-[var(--ai-accent)] border-t-transparent animate-spin" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-[var(--ai-accent)]/10 to-indigo-500/10">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--ai-accent)] to-indigo-500 flex items-center justify-center shrink-0">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[var(--on-surface)]">AI Analysis Complete</h3>
            <Badge variant="ai">AI</Badge>
          </div>
          <p className="text-sm text-[var(--on-surface-variant)]">
            Found {visibleSuggestions.length} suggestions based on your project configuration.
            {accepted.size > 0 && (
              <span className="text-green-600 ml-1">{accepted.size} accepted.</span>
            )}
          </p>
        </div>
      </div>

      {/* Grouped Suggestions */}
      {Object.entries(groupedSuggestions).map(([type, items]) => {
        if (items.length === 0) return null
        const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]
        return (
          <div key={type} className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--on-surface)] flex items-center gap-2">
              <span className={config.color}>{config.icon}</span>
              {type === 'milestone' && 'Missing Milestones & Deliverables'}
              {type === 'risk' && 'Identified Risks'}
              {type === 'cadence' && 'Recommended Reporting Cadence'}
              {type === 'metric' && 'Key Metrics to Track'}
              <span className="text-xs font-normal text-[var(--outline)]">({items.length})</span>
            </h4>

            {items.map(suggestion => {
              const isAccepted = accepted.has(suggestion.id)
              return (
                <div
                  key={suggestion.id}
                  className={cn(
                    'rounded-xl p-4 transition-all',
                    isAccepted
                      ? 'bg-green-50'
                      : 'bg-[var(--surface-container-lowest)]'
                  )}
                  style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', config.bg, config.color)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm text-[var(--on-surface)]">{suggestion.title}</h5>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{config.label}</Badge>
                      </div>
                      <p className="text-sm text-[var(--on-surface-variant)]">{suggestion.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isAccepted ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Accepted
                        </span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismiss(suggestion.id)}
                            className="h-7 text-xs"
                          >
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(suggestion)}
                            className="h-7 text-xs bg-gradient-to-r from-[var(--ai-accent)] to-indigo-600 hover:from-[var(--ai-accent)]/90 hover:to-indigo-600/90 text-white"
                          >
                            {suggestion.actionLabel}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      {visibleSuggestions.length === 0 && (
        <div className="text-center py-8 text-[var(--outline)]">
          <p className="text-sm">All suggestions have been reviewed.</p>
        </div>
      )}
    </div>
  )
}
