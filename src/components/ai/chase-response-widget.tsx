'use client';

import React, { useState } from 'react';
import { Bot, Calendar, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

type ResponseOption = 'on_track' | 'blocked' | 'need_help' | 'reassign';

interface ChaseResponseWidgetProps {
  taskName: string;
  dueDate: string;
  daysOverdue: number;
  milestoneName?: string;
  milestoneDueDate?: string;
  chaseId?: string;
  onSubmit?: (response: {
    status: ResponseOption;
    newDate?: string;
    blockerDescription?: string;
    helpDescription?: string;
    reassignTo?: string;
    notes?: string;
  }) => void;
}

export function ChaseResponseWidget({
  taskName,
  dueDate,
  daysOverdue,
  milestoneName,
  milestoneDueDate,
  onSubmit,
}: ChaseResponseWidgetProps) {
  const [selected, setSelected] = useState<ResponseOption | null>(null);
  const [newDate, setNewDate] = useState('');
  const [blockerDescription, setBlockerDescription] = useState('');
  const [helpDescription, setHelpDescription] = useState('');
  const [reassignTo, setReassignTo] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const options: { value: ResponseOption; label: string; description: string }[] = [
    {
      value: 'on_track',
      label: 'On Track',
      description: 'I am working on it and will complete soon',
    },
    {
      value: 'blocked',
      label: 'Blocked',
      description: 'I am waiting on something or someone',
    },
    {
      value: 'need_help',
      label: 'Need Help',
      description: 'I need assistance to complete this',
    },
    {
      value: 'reassign',
      label: 'Reassign',
      description: 'This should be assigned to someone else',
    },
  ];

  function handleSubmit() {
    if (!selected) return;
    setSubmitted(true);
    onSubmit?.({
      status: selected,
      newDate: selected === 'on_track' ? newDate : undefined,
      blockerDescription: selected === 'blocked' ? blockerDescription : undefined,
      helpDescription: selected === 'need_help' ? helpDescription : undefined,
      reassignTo: selected === 'reassign' ? reassignTo : undefined,
      notes,
    });
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl bg-[var(--surface-container-lowest)] border-t-2 border-t-[var(--ai-accent)] p-6"
        style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-3">
            <Bot className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--on-surface)]">Response Recorded</h3>
          <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
            Thank you for your update. The PMO agent will process your response.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl bg-[var(--surface-container-lowest)] border-t-2 border-t-[var(--ai-accent)]"
      style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--surface-container-high)' }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ai-accent)]/10">
          <Bot className="h-5 w-5 text-[var(--ai-accent)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--on-surface)]">PMO Agent Follow-up</h3>
          <p className="text-xs text-[var(--outline)]">Please provide a status update</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Task Info */}
        <div className="rounded-lg bg-[var(--surface-container-low)] p-4">
          <div className="text-sm font-medium text-[var(--on-surface)]">{taskName}</div>
          <div className="mt-2 flex items-center gap-4 text-xs text-[var(--outline)]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Due: {dueDate}
            </span>
            <span
              className={cn(
                'font-medium',
                daysOverdue > 3 ? 'text-red-600' : 'text-amber-600'
              )}
            >
              {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
            </span>
          </div>
          {milestoneName && (
            <div className="mt-2 flex items-center gap-1 text-xs text-[var(--outline)]">
              <span>Affects milestone:</span>
              <span className="font-medium text-[var(--on-surface)]">{milestoneName}</span>
              {milestoneDueDate && (
                <span className="text-[var(--outline)]/60">(due {milestoneDueDate})</span>
              )}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-[var(--outline)]">
            Current Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className={cn(
                  'rounded-lg p-3 text-left transition-all',
                  selected === opt.value
                    ? 'bg-[var(--ai-accent)]/10 ring-1 ring-[var(--ai-accent)]'
                    : 'bg-[var(--surface-container-low)] hover:bg-[var(--surface-container-high)]'
                )}
              >
                <div
                  className={cn(
                    'text-sm font-medium',
                    selected === opt.value ? 'text-[var(--ai-accent)]' : 'text-[var(--on-surface)]'
                  )}
                >
                  {opt.label}
                </div>
                <div className="mt-0.5 text-xs text-[var(--outline)]">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Inputs */}
        {selected === 'on_track' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--outline)]">
              Expected completion date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)] focus:outline-none focus:ring-1 focus:ring-[var(--ai-accent)]/30"
            />
          </div>
        )}

        {selected === 'blocked' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--outline)]">
              What is blocking you?
            </label>
            <input
              type="text"
              value={blockerDescription}
              onChange={(e) => setBlockerDescription(e.target.value)}
              placeholder="Describe the blocker..."
              className="w-full rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-1 focus:ring-[var(--ai-accent)]/30"
            />
          </div>
        )}

        {selected === 'need_help' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--outline)]">
              What help do you need?
            </label>
            <input
              type="text"
              value={helpDescription}
              onChange={(e) => setHelpDescription(e.target.value)}
              placeholder="Describe what you need..."
              className="w-full rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-1 focus:ring-[var(--ai-accent)]/30"
            />
          </div>
        )}

        {selected === 'reassign' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--outline)]">
              Suggest who should take over
            </label>
            <input
              type="text"
              value={reassignTo}
              onChange={(e) => setReassignTo(e.target.value)}
              placeholder="Name or role..."
              className="w-full rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-1 focus:ring-[var(--ai-accent)]/30"
            />
          </div>
        )}

        {/* Notes */}
        {selected && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--outline)]">
              Additional notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other information..."
              rows={3}
              className="w-full rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-1 focus:ring-[var(--ai-accent)]/30 resize-none"
            />
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Submit Response
        </button>
      </div>
    </div>
  );
}
