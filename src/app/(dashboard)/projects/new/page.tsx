'use client'

import * as React from 'react'
import Link from 'next/link'
import { WizardShell, type WizardFormData } from '@/components/project/wizard/wizard-shell'
import { StepBasicInfo } from '@/components/project/wizard/step-basic-info'
import { StepTimeline } from '@/components/project/wizard/step-timeline'
import { StepBudget } from '@/components/project/wizard/step-budget'
import { StepTeam } from '@/components/project/wizard/step-team'
import { StepMilestones } from '@/components/project/wizard/step-milestones'
import { StepAISetup } from '@/components/project/wizard/step-ai-setup'
import { StepReview } from '@/components/project/wizard/step-review'

function validateStep(step: number, data: WizardFormData): string | null {
  switch (step) {
    case 1:
      if (!data.name.trim()) return 'Project name is required.'
      if (!data.priority) return 'Please select a priority level.'
      return null
    case 2:
      if (!data.startDate) return 'Start date is required.'
      if (!data.targetEndDate) return 'Target end date is required.'
      if (data.startDate && data.targetEndDate && new Date(data.targetEndDate) <= new Date(data.startDate)) {
        return 'Target end date must be after the start date.'
      }
      return null
    case 3:
      if (!data.totalBudget || data.totalBudget <= 0) return 'Total budget must be greater than zero.'
      return null
    case 4:
      if (!data.projectManager) return 'Please select a project manager.'
      return null
    case 5:
      // Milestones are optional but warn if none
      return null
    case 6:
      // AI setup is optional
      return null
    case 7:
      return null
    default:
      return null
  }
}

export default function NewProjectPage() {
  function handleSubmit(data: WizardFormData) {
    // In a real app, this would POST to an API
    console.log('Project registered:', data)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-foreground font-medium">Register New Project</span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Register New Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete the wizard to set up your project with AI-powered analysis and recommendations.
        </p>
      </div>

      {/* Wizard */}
      <WizardShell onSubmit={handleSubmit} validateStep={validateStep}>
        {({ formData, setFormData, currentStep, goToStep }) => {
          switch (currentStep) {
            case 1:
              return <StepBasicInfo formData={formData} setFormData={setFormData} />
            case 2:
              return <StepTimeline formData={formData} setFormData={setFormData} />
            case 3:
              return <StepBudget formData={formData} setFormData={setFormData} />
            case 4:
              return <StepTeam formData={formData} setFormData={setFormData} />
            case 5:
              return <StepMilestones formData={formData} setFormData={setFormData} />
            case 6:
              return <StepAISetup formData={formData} setFormData={setFormData} />
            case 7:
              return <StepReview formData={formData} setFormData={setFormData} goToStep={goToStep} />
            default:
              return null
          }
        }}
      </WizardShell>
    </div>
  )
}
