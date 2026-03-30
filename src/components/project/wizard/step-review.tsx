'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { StepProps } from './wizard-shell'

interface SectionProps {
  title: string
  step: number
  goToStep?: (step: number) => void
  children: React.ReactNode
}

function ReviewSection({ title, step, goToStep, children }: SectionProps) {
  return (
    <div
      className="rounded-xl bg-[var(--surface-container-lowest)] p-5"
      style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--on-surface)]">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goToStep?.(step)}
          className="h-7 text-xs text-[var(--ai-accent)] hover:text-[var(--ai-accent)]/80"
        >
          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </Button>
      </div>
      {children}
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start py-1.5">
      <span className="text-sm text-[var(--outline)] w-40 shrink-0">{label}</span>
      <span className="text-sm text-[var(--on-surface)] font-medium">{value || <span className="text-[var(--outline)]/50 font-normal">Not provided</span>}</span>
    </div>
  )
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}

export function StepReview({ formData, goToStep }: StepProps) {
  const lineItemsTotal = formData.budgetLineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalDeliverables = formData.milestones.reduce((sum, m) => sum + m.deliverables.length, 0)

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-[var(--surface-container-low)] mb-2">
        <p className="text-sm text-[var(--on-surface-variant)]">
          Review all project details below before registering. Click <strong>Edit</strong> on any section to make changes.
        </p>
      </div>

      {/* Basic Info */}
      <ReviewSection title="Basic Information" step={1} goToStep={goToStep}>
        <div className="space-y-0.5">
          <DataRow label="Project Name" value={formData.name} />
          <DataRow label="Description" value={formData.description ? (
            <span className="line-clamp-2">{formData.description}</span>
          ) : null} />
          <DataRow label="Tags" value={
            formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs rounded-full bg-[var(--surface-container-high)] text-[var(--on-surface)]">{tag}</Badge>
                ))}
              </div>
            ) : null
          } />
          <DataRow label="Priority" value={
            formData.priority ? (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[formData.priority] || ''}`}>
                {formData.priority}
              </span>
            ) : null
          } />
          <DataRow label="Division" value={formData.sponsoringDivision} />
        </div>
      </ReviewSection>

      {/* Timeline */}
      <ReviewSection title="Timeline" step={2} goToStep={goToStep}>
        <div className="space-y-0.5">
          <DataRow label="Start Date" value={formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
          <DataRow label="Target End Date" value={formData.targetEndDate ? new Date(formData.targetEndDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
          <DataRow label="Phases" value={
            formData.phases.length > 0 ? (
              <div className="space-y-1">
                {formData.phases.map((p, i) => (
                  <div key={i} className="text-xs bg-[var(--surface-container-low)] px-2 py-1 rounded">
                    <span className="font-semibold">{p.name}</span>
                    {p.start && p.end && (
                      <span className="text-[var(--outline)] ml-2">
                        {new Date(p.start).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })} - {new Date(p.end).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : `${formData.phases.length} phases`
          } />
        </div>
      </ReviewSection>

      {/* Budget */}
      <ReviewSection title="Budget" step={3} goToStep={goToStep}>
        <div className="space-y-0.5">
          <DataRow label="Total Budget" value={formData.totalBudget > 0 ? formatCurrency(formData.totalBudget, formData.currency) : null} />
          <DataRow label="Currency" value={formData.currency} />
          <DataRow label="Line Items" value={
            formData.budgetLineItems.length > 0 ? (
              <div className="space-y-1">
                {formData.budgetLineItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-[var(--surface-container-low)] px-2 py-1 rounded">
                    <span>
                      <span className="font-semibold">{item.category}</span>
                      {item.description && <span className="text-[var(--outline)] ml-1">- {item.description}</span>}
                    </span>
                    <span className="font-medium">{formatCurrency(item.amount, formData.currency)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs font-semibold pt-1" style={{ borderTop: '1px solid var(--surface-container-high)' }}>
                  <span>Total Allocated</span>
                  <span>{formatCurrency(lineItemsTotal, formData.currency)}</span>
                </div>
              </div>
            ) : `${formData.budgetLineItems.length} items`
          } />
        </div>
      </ReviewSection>

      {/* Team */}
      <ReviewSection title="Team" step={4} goToStep={goToStep}>
        <div className="space-y-0.5">
          <DataRow label="Project Manager" value={formData.projectManager} />
          <DataRow label="Team Members" value={
            formData.teamMembers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.teamMembers.map((m, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs bg-[var(--surface-container-low)] px-2 py-1 rounded">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-[var(--outline)]">({m.role})</span>
                  </span>
                ))}
              </div>
            ) : null
          } />
          <DataRow label="Team Size" value={`${formData.teamMembers.length + (formData.projectManager ? 1 : 0)} members`} />
        </div>
      </ReviewSection>

      {/* Milestones */}
      <ReviewSection title="Milestones & Deliverables" step={5} goToStep={goToStep}>
        <div className="space-y-0.5">
          <DataRow label="Milestones" value={`${formData.milestones.length} milestones`} />
          <DataRow label="Deliverables" value={`${totalDeliverables} deliverables`} />
          {formData.milestones.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.milestones.map((m, i) => (
                <div key={i} className="text-xs bg-[var(--surface-container-low)] px-3 py-2 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{m.name || `Milestone ${i + 1}`}</span>
                    {m.dueDate && (
                      <span className="text-[var(--outline)]">
                        {new Date(m.dueDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  {m.deliverables.length > 0 && (
                    <div className="mt-1 pl-3 border-l border-[var(--surface-container-high)] space-y-0.5">
                      {m.deliverables.map((d, di) => (
                        <div key={di} className="text-[var(--outline)]">{d.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ReviewSection>

      {/* AI Setup */}
      <ReviewSection title="AI Analysis" step={6} goToStep={goToStep}>
        <div className="space-y-0.5">
          <DataRow label="Accepted Suggestions" value={formData.acceptedSuggestions.length > 0 ? `${formData.acceptedSuggestions.length} suggestions` : 'None'} />
          <DataRow label="Accepted Risks" value={formData.acceptedRisks.length > 0 ? `${formData.acceptedRisks.length} risks added to register` : 'None'} />
          <DataRow label="Reporting Cadence" value={formData.reportingCadence || null} />
          <DataRow label="Key Metrics" value={
            formData.keyMetrics.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {formData.keyMetrics.map((m, i) => (
                  <Badge key={i} variant="ai" className="text-xs">{m}</Badge>
                ))}
              </div>
            ) : null
          } />
        </div>
      </ReviewSection>
    </div>
  )
}
