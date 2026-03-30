'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StepProps } from './wizard-shell'

export function StepMilestones({ formData, setFormData }: StepProps) {
  function addMilestone() {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { name: '', description: '', dueDate: '', deliverables: [] },
      ],
    }))
  }

  function updateMilestone(index: number, field: string, value: string) {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }))
  }

  function removeMilestone(index: number) {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }))
  }

  function addDeliverable(milestoneIndex: number) {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) =>
        i === milestoneIndex
          ? { ...m, deliverables: [...m.deliverables, { name: '', dueDate: '' }] }
          : m
      ),
    }))
  }

  function updateDeliverable(milestoneIndex: number, deliverableIndex: number, field: string, value: string) {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, mi) =>
        mi === milestoneIndex
          ? {
              ...m,
              deliverables: m.deliverables.map((d, di) =>
                di === deliverableIndex ? { ...d, [field]: value } : d
              ),
            }
          : m
      ),
    }))
  }

  function removeDeliverable(milestoneIndex: number, deliverableIndex: number) {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, mi) =>
        mi === milestoneIndex
          ? { ...m, deliverables: m.deliverables.filter((_, di) => di !== deliverableIndex) }
          : m
      ),
    }))
  }

  // Collect all dated milestones for the timeline preview
  const datedMilestones = formData.milestones.filter(m => m.name && m.dueDate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Milestones</label>
        <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Milestone
        </Button>
      </div>

      {formData.milestones.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
          <svg className="h-8 w-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">No milestones defined yet. Add key milestones to track your project progress.</p>
        </div>
      )}

      {formData.milestones.map((milestone, mIndex) => (
        <Card key={mIndex} className="border-muted-foreground/20">
          <CardContent className="p-4 space-y-4">
            {/* Milestone header */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-sm font-bold mt-0.5 shrink-0">
                M{mIndex + 1}
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="Milestone name"
                      value={milestone.name}
                      onChange={e => updateMilestone(mIndex, 'name', e.target.value)}
                    />
                  </div>
                  <Input
                    type="date"
                    value={milestone.dueDate}
                    onChange={e => updateMilestone(mIndex, 'dueDate', e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Brief description of this milestone..."
                  value={milestone.description}
                  onChange={e => updateMilestone(mIndex, 'description', e.target.value)}
                  rows={2}
                  className="text-sm"
                />

                {/* Deliverables */}
                <div className="space-y-2 pl-2 border-l-2 border-violet-200 dark:border-violet-800/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deliverables</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addDeliverable(mIndex)}
                      className="h-7 text-xs"
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Deliverable
                    </Button>
                  </div>

                  {milestone.deliverables.length === 0 && (
                    <p className="text-xs text-muted-foreground/60 py-1">No deliverables for this milestone.</p>
                  )}

                  {milestone.deliverables.map((deliverable, dIndex) => (
                    <div key={dIndex} className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <Input
                        placeholder="Deliverable name"
                        value={deliverable.name}
                        onChange={e => updateDeliverable(mIndex, dIndex, 'name', e.target.value)}
                        className="h-8 text-sm"
                      />
                      <Input
                        type="date"
                        value={deliverable.dueDate}
                        onChange={e => updateDeliverable(mIndex, dIndex, 'dueDate', e.target.value)}
                        className="h-8 text-sm w-40 shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() => removeDeliverable(mIndex, dIndex)}
                        className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeMilestone(mIndex)}
                className="text-muted-foreground hover:text-red-500 transition-colors mt-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Visual Timeline Preview */}
      {datedMilestones.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Milestone Timeline</label>
          <Card>
            <CardContent className="p-4">
              <MilestoneTimeline milestones={datedMilestones} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function MilestoneTimeline({
  milestones,
}: {
  milestones: { name: string; dueDate: string; deliverables: { name: string; dueDate: string }[] }[]
}) {
  const sorted = [...milestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  const earliest = new Date(sorted[0].dueDate).getTime()
  const latest = new Date(sorted[sorted.length - 1].dueDate).getTime()
  const range = latest - earliest || 1

  const colors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500',
  ]

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />

      <div className="space-y-4">
        {sorted.map((m, i) => {
          const pct = range > 0 ? ((new Date(m.dueDate).getTime() - earliest) / range) * 100 : 0
          return (
            <div key={i} className="relative pl-10">
              {/* Dot */}
              <div className={cn(
                'absolute left-2 top-1.5 h-5 w-5 rounded-full border-2 border-background flex items-center justify-center',
                colors[i % colors.length]
              )}>
                <span className="text-white text-[8px] font-bold">{i + 1}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{m.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.dueDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {m.deliverables.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {m.deliverables.filter(d => d.name).map((d, di) => (
                      <div key={di} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        {d.name}
                        {d.dueDate && (
                          <span className="text-muted-foreground/50">
                            ({new Date(d.dueDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
