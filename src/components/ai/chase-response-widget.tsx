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
        className="rounded-xl bg-white border-t-2 border-t-[#7c3aed] p-6"
        style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-3">
            <Bot className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#1a1c1e]">Response Recorded</h3>
          <p className="mt-1 text-sm text-[#44474e]">
            Thank you for your update. The PMO agent will process your response.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl bg-white border-t-2 border-t-[#7c3aed]"
      style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid #e8e8ea' }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7c3aed]/10">
          <Bot className="h-5 w-5 text-[#7c3aed]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1a1c1e]">PMO Agent Follow-up</h3>
          <p className="text-xs text-[#74777f]">Please provide a status update</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Task Info */}
        <div className="rounded-lg bg-[#f3f3f6] p-4">
          <div className="text-sm font-medium text-[#1a1c1e]">{taskName}</div>
          <div className="mt-2 flex items-center gap-4 text-xs text-[#74777f]">
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
            <div className="mt-2 flex items-center gap-1 text-xs text-[#74777f]">
              <span>Affects milestone:</span>
              <span className="font-medium text-[#1a1c1e]">{milestoneName}</span>
              {milestoneDueDate && (
                <span className="text-[#74777f]/60">(due {milestoneDueDate})</span>
              )}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-[#74777f]">
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
                    ? 'bg-[#7c3aed]/10 ring-1 ring-[#7c3aed]'
                    : 'bg-[#f3f3f6] hover:bg-[#e8e8ea]'
                )}
              >
                <div
                  className={cn(
                    'text-sm font-medium',
                    selected === opt.value ? 'text-[#7c3aed]' : 'text-[#1a1c1e]'
                  )}
                >
                  {opt.label}
                </div>
                <div className="mt-0.5 text-xs text-[#74777f]">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Inputs */}
        {selected === 'on_track' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#74777f]">
              Expected completion date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/30"
            />
          </div>
        )}

        {selected === 'blocked' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#74777f]">
              What is blocking you?
            </label>
            <input
              type="text"
              value={blockerDescription}
              onChange={(e) => setBlockerDescription(e.target.value)}
              placeholder="Describe the blocker..."
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] placeholder:text-[#74777f] focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/30"
            />
          </div>
        )}

        {selected === 'need_help' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#74777f]">
              What help do you need?
            </label>
            <input
              type="text"
              value={helpDescription}
              onChange={(e) => setHelpDescription(e.target.value)}
              placeholder="Describe what you need..."
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] placeholder:text-[#74777f] focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/30"
            />
          </div>
        )}

        {selected === 'reassign' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#74777f]">
              Suggest who should take over
            </label>
            <input
              type="text"
              value={reassignTo}
              onChange={(e) => setReassignTo(e.target.value)}
              placeholder="Name or role..."
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] placeholder:text-[#74777f] focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/30"
            />
          </div>
        )}

        {/* Notes */}
        {selected && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#74777f]">
              Additional notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other information..."
              rows={3}
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] placeholder:text-[#74777f] focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/30 resize-none"
            />
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#001736] to-[#002b5b] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Submit Response
        </button>
      </div>
    </div>
  );
}
