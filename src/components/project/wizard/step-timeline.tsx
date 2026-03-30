'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StepProps } from './wizard-shell'

export function StepTimeline({ formData, setFormData }: StepProps) {
  function addPhase() {
    setFormData(prev => ({
      ...prev,
      phases: [...prev.phases, { name: '', start: '', end: '' }],
    }))
  }

  function updatePhase(index: number, field: string, value: string) {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }))
  }

  function removePhase(index: number) {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.filter((_, i) => i !== index),
    }))
  }

  // Calculate project duration in days
  const durationDays = formData.startDate && formData.targetEndDate
    ? Math.ceil((new Date(formData.targetEndDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Start Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="h-11"
          />
        </div>

        {/* Target End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Target End Date <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={formData.targetEndDate}
            onChange={e => setFormData(prev => ({ ...prev, targetEndDate: e.target.value }))}
            className="h-11"
          />
        </div>
      </div>

      {durationDays > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Project duration: <span className="font-semibold text-foreground">{durationDays} days</span>
          ({Math.ceil(durationDays / 7)} weeks, ~{Math.round(durationDays / 30)} months)
        </div>
      )}

      {/* Key Phases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Key Phases</label>
          <Button type="button" variant="outline" size="sm" onClick={addPhase}>
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Phase
          </Button>
        </div>

        {formData.phases.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <svg className="h-8 w-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No phases defined yet. Add phases to break down your project timeline.</p>
          </div>
        )}

        {formData.phases.map((phase, index) => (
          <Card key={index} className="border-muted-foreground/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-bold mt-1 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Phase name"
                    value={phase.name}
                    onChange={e => updatePhase(index, 'name', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={phase.start}
                    onChange={e => updatePhase(index, 'start', e.target.value)}
                    placeholder="Start"
                  />
                  <Input
                    type="date"
                    value={phase.end}
                    onChange={e => updatePhase(index, 'end', e.target.value)}
                    placeholder="End"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePhase(index)}
                  className="text-muted-foreground hover:text-red-500 transition-colors mt-1.5"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visual Timeline Preview */}
      {formData.phases.length > 0 && formData.startDate && formData.targetEndDate && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Timeline Preview</label>
          <Card>
            <CardContent className="p-4">
              <TimelinePreview
                startDate={formData.startDate}
                endDate={formData.targetEndDate}
                phases={formData.phases}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function TimelinePreview({
  startDate,
  endDate,
  phases,
}: {
  startDate: string
  endDate: string
  phases: { name: string; start: string; end: string }[]
}) {
  const projectStart = new Date(startDate).getTime()
  const projectEnd = new Date(endDate).getTime()
  const totalDuration = projectEnd - projectStart

  if (totalDuration <= 0) return null

  const colors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-orange-500',
  ]

  return (
    <div className="space-y-3">
      {/* Full project bar */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <span>{new Date(startDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</span>
        <div className="flex-1 h-2 bg-muted rounded-full" />
        <span>{new Date(endDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</span>
      </div>

      {phases.filter(p => p.name && p.start && p.end).map((phase, i) => {
        const phaseStart = new Date(phase.start).getTime()
        const phaseEnd = new Date(phase.end).getTime()
        const leftPct = Math.max(0, ((phaseStart - projectStart) / totalDuration) * 100)
        const widthPct = Math.min(100 - leftPct, ((phaseEnd - phaseStart) / totalDuration) * 100)

        return (
          <div key={i} className="relative h-7 flex items-center">
            <div
              className={cn('absolute h-6 rounded-md flex items-center px-2', colors[i % colors.length])}
              style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 2)}%` }}
            >
              <span className="text-xs text-white font-medium truncate">{phase.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
