'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import type { StepProps } from './wizard-shell'

const CURRENCIES = ['MYR', 'USD', 'SGD', 'EUR', 'GBP']

const CATEGORY_SUGGESTIONS = [
  'Personnel', 'Software Licenses', 'Hardware', 'Consulting',
  'Training', 'Infrastructure', 'Contingency', 'Travel',
]

export function StepBudget({ formData, setFormData }: StepProps) {
  function addLineItem() {
    setFormData(prev => ({
      ...prev,
      budgetLineItems: [...prev.budgetLineItems, { category: '', description: '', amount: 0 }],
    }))
  }

  function updateLineItem(index: number, field: string, value: string | number) {
    setFormData(prev => ({
      ...prev,
      budgetLineItems: prev.budgetLineItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  function removeLineItem(index: number) {
    setFormData(prev => ({
      ...prev,
      budgetLineItems: prev.budgetLineItems.filter((_, i) => i !== index),
    }))
  }

  const lineItemsTotal = formData.budgetLineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const remaining = formData.totalBudget - lineItemsTotal
  const remainingPct = formData.totalBudget > 0 ? (remaining / formData.totalBudget) * 100 : 0

  // Compute pie chart data
  const pieSlices = React.useMemo(() => {
    if (lineItemsTotal === 0) return []
    const items = formData.budgetLineItems.filter(i => i.amount > 0)
    const colors = [
      '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
      '#EF4444', '#06B6D4', '#F97316', '#EC4899',
    ]
    let startAngle = 0
    return items.map((item, i) => {
      const pct = (item.amount / lineItemsTotal) * 100
      const angle = (item.amount / lineItemsTotal) * 360
      const slice = {
        category: item.category || `Item ${i + 1}`,
        amount: item.amount,
        pct,
        startAngle,
        angle,
        color: colors[i % colors.length],
      }
      startAngle += angle
      return slice
    })
  }, [formData.budgetLineItems, lineItemsTotal])

  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Total Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--on-surface)]">
            Total Allocated Budget <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--outline)] font-medium">
              {formData.currency}
            </span>
            <Input
              type="number"
              min={0}
              placeholder="0.00"
              value={formData.totalBudget || ''}
              onChange={e => setFormData(prev => ({ ...prev, totalBudget: parseFloat(e.target.value) || 0 }))}
              className="h-11 pl-14 bg-[var(--surface-container-low)] border-0 focus:ring-1 focus:ring-[var(--primary)]/30"
            />
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--on-surface)]">Currency</label>
          <Select value={formData.currency} onValueChange={v => setFormData(prev => ({ ...prev, currency: v }))}>
            <SelectTrigger className="h-11 bg-[var(--surface-container-low)] border-0">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Budget Line Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--on-surface)]">Budget Line Items</label>
          <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </Button>
        </div>

        {formData.budgetLineItems.length === 0 && (
          <div className="text-center py-8 text-[var(--outline)] border-2 border-dashed border-[var(--surface-container-high)] rounded-lg">
            <svg className="h-8 w-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No budget items yet. Break down your budget into categories.</p>
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              <span className="text-xs text-[var(--outline)]">Quick add:</span>
              {CATEGORY_SUGGESTIONS.slice(0, 4).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      budgetLineItems: [...prev.budgetLineItems, { category: cat, description: '', amount: 0 }],
                    }))
                  }}
                  className="text-xs px-2 py-0.5 rounded-full border border-dashed border-[var(--outline)]/30 text-[var(--on-surface-variant)] hover:border-[var(--ai-accent)] hover:text-[var(--ai-accent)] transition-colors"
                >
                  + {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {formData.budgetLineItems.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-[var(--surface-container-lowest)] p-4"
            style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mt-1 shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  value={item.category}
                  onValueChange={v => updateLineItem(index, 'category', v)}
                >
                  <SelectTrigger className="bg-[var(--surface-container-low)] border-0">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_SUGGESTIONS.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={e => updateLineItem(index, 'description', e.target.value)}
                  className="bg-[var(--surface-container-low)] border-0 focus:ring-1 focus:ring-[var(--primary)]/30"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--outline)]">
                    {formData.currency}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0.00"
                    value={item.amount || ''}
                    onChange={e => updateLineItem(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="pl-12 bg-[var(--surface-container-low)] border-0 focus:ring-1 focus:ring-[var(--primary)]/30"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeLineItem(index)}
                className="text-[var(--outline)] hover:text-red-500 transition-colors mt-1.5"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Running Total */}
      {formData.totalBudget > 0 && (
        <div className="rounded-xl bg-[var(--surface-container-low)] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[var(--on-surface)]">Budget Allocation Summary</span>
            <span className={`text-sm font-semibold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {remaining < 0 ? 'Over budget by ' : 'Remaining: '}
              {formatCurrency(Math.abs(remaining), formData.currency)}
            </span>
          </div>
          <div className="w-full h-3 bg-[var(--surface-container-high)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${remaining < 0 ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`}
              style={{ width: `${Math.min((lineItemsTotal / formData.totalBudget) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--outline)] mt-1">
            <span>Allocated: {formatCurrency(lineItemsTotal, formData.currency)}</span>
            <span>Total: {formatCurrency(formData.totalBudget, formData.currency)}</span>
          </div>
        </div>
      )}

      {/* Pie Chart Preview */}
      {pieSlices.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--on-surface)]">Budget Allocation</label>
          <div
            className="rounded-xl bg-[var(--surface-container-lowest)] p-4"
            style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
          >
            <div className="flex items-center gap-8">
              <svg viewBox="0 0 200 200" className="h-40 w-40 shrink-0">
                {pieSlices.map((slice, i) => (
                  <path
                    key={i}
                    d={describeArc(100, 100, 90, slice.startAngle, slice.startAngle + slice.angle - 0.5)}
                    fill={slice.color}
                    className="transition-all hover:opacity-80"
                  />
                ))}
                <circle cx="100" cy="100" r="45" fill="var(--surface-container-lowest)" />
                <text x="100" y="96" textAnchor="middle" fill="var(--on-surface)" className="text-xs font-semibold" fontSize="12">
                  {formData.currency}
                </text>
                <text x="100" y="112" textAnchor="middle" fill="var(--outline)" fontSize="10">
                  {(formData.totalBudget / 1000).toFixed(0)}K
                </text>
              </svg>
              <div className="flex-1 space-y-2">
                {pieSlices.map((slice, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-sm shrink-0" style={{ backgroundColor: slice.color }} />
                    <span className="flex-1 text-[var(--on-surface)] truncate">{slice.category}</span>
                    <span className="text-[var(--outline)]">{slice.pct.toFixed(1)}%</span>
                    <span className="font-medium text-[var(--on-surface)]">{formatCurrency(slice.amount, formData.currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
