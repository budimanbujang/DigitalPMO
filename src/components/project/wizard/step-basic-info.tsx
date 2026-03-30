'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StepProps } from './wizard-shell'

const SUGGESTED_TAGS = [
  'Digital Transformation', 'Infrastructure', 'Security', 'Analytics',
  'Cloud Migration', 'Mobile', 'AI/ML', 'Compliance', 'Process Improvement',
  'Customer Experience', 'ERP', 'Integration',
]

export function StepBasicInfo({ formData, setFormData }: StepProps) {
  const [tagInput, setTagInput] = React.useState('')

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmed] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1a1c1e]">
          Project Name <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="e.g. Digital Customer Portal v2.0"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="h-11 bg-[#f3f3f6] border-0 focus:ring-1 focus:ring-[#001736]/30"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1a1c1e]">Description</label>
        <Textarea
          placeholder="Brief overview of the project scope, objectives, and expected outcomes..."
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="bg-[#f3f3f6] border-0 focus:ring-1 focus:ring-[#001736]/30"
        />
      </div>

      {/* Category / Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1a1c1e]">Category / Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="pl-2.5 pr-1 py-1 gap-1 rounded-full bg-[#e8e8ea] text-[#1a1c1e]">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 h-4 w-4 rounded-full hover:bg-[#1a1c1e]/10 flex items-center justify-center"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Type a tag and press Enter..."
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          className="bg-[#f3f3f6] border-0 focus:ring-1 focus:ring-[#001736]/30"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-xs text-[#74777f] mr-1 self-center">Suggestions:</span>
          {SUGGESTED_TAGS.filter(t => !formData.tags.includes(t)).slice(0, 6).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="text-xs px-2 py-0.5 rounded-full border border-dashed border-[#74777f]/30 text-[#44474e] hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1a1c1e]">
            Priority <span className="text-red-500">*</span>
          </label>
          <Select value={formData.priority} onValueChange={v => setFormData(prev => ({ ...prev, priority: v }))}>
            <SelectTrigger className="h-11 bg-[#f3f3f6] border-0">
              <SelectValue placeholder="Select priority level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Critical
                </span>
              </SelectItem>
              <SelectItem value="High">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  High
                </span>
              </SelectItem>
              <SelectItem value="Medium">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  Medium
                </span>
              </SelectItem>
              <SelectItem value="Low">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Low
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sponsoring Division */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1a1c1e]">Sponsoring Division</label>
          <Input
            placeholder="e.g. Information Technology"
            value={formData.sponsoringDivision}
            onChange={e => setFormData(prev => ({ ...prev, sponsoringDivision: e.target.value }))}
            className="h-11 bg-[#f3f3f6] border-0 focus:ring-1 focus:ring-[#001736]/30"
          />
        </div>
      </div>
    </div>
  )
}
