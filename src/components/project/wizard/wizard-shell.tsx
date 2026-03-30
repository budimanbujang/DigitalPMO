'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface WizardFormData {
  // Step 1: Basic Info
  name: string
  description: string
  tags: string[]
  priority: string
  sponsoringDivision: string

  // Step 2: Timeline
  startDate: string
  targetEndDate: string
  phases: { name: string; start: string; end: string }[]

  // Step 3: Budget
  totalBudget: number
  currency: string
  budgetLineItems: { category: string; description: string; amount: number }[]

  // Step 4: Team
  projectManager: string
  teamMembers: { name: string; role: string }[]

  // Step 5: Milestones
  milestones: {
    name: string
    description: string
    dueDate: string
    deliverables: { name: string; dueDate: string }[]
  }[]

  // Step 6: AI Setup
  acceptedSuggestions: string[]
  acceptedRisks: string[]
  reportingCadence: string
  keyMetrics: string[]
}

export const defaultFormData: WizardFormData = {
  name: '',
  description: '',
  tags: [],
  priority: '',
  sponsoringDivision: '',
  startDate: '',
  targetEndDate: '',
  phases: [],
  totalBudget: 0,
  currency: 'MYR',
  budgetLineItems: [],
  projectManager: '',
  teamMembers: [],
  milestones: [],
  acceptedSuggestions: [],
  acceptedRisks: [],
  reportingCadence: '',
  keyMetrics: [],
}

const STEPS = [
  { number: 1, title: 'Basic Info', description: 'Project fundamentals' },
  { number: 2, title: 'Timeline', description: 'Dates and phases' },
  { number: 3, title: 'Budget', description: 'Financial planning' },
  { number: 4, title: 'Team', description: 'People and roles' },
  { number: 5, title: 'Milestones & Deliverables', description: 'Key targets' },
  { number: 6, title: 'AI Setup', description: 'Smart analysis' },
  { number: 7, title: 'Review & Register', description: 'Final check' },
]

export interface StepProps {
  formData: WizardFormData
  setFormData: React.Dispatch<React.SetStateAction<WizardFormData>>
  goToStep?: (step: number) => void
}

interface WizardShellProps {
  children: (props: StepProps & { currentStep: number }) => React.ReactNode
  onSubmit: (data: WizardFormData) => void
  validateStep: (step: number, data: WizardFormData) => string | null
}

export function WizardShell({ children, onSubmit, validateStep }: WizardShellProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [formData, setFormData] = React.useState<WizardFormData>(defaultFormData)
  const [error, setError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100
  const step = STEPS[currentStep - 1]

  function goToStep(target: number) {
    if (target >= 1 && target <= STEPS.length) {
      setError(null)
      setCurrentStep(target)
    }
  }

  function handleNext() {
    const validationError = validateStep(currentStep, formData)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  function handleBack() {
    setError(null)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  function handleSubmit() {
    setSubmitted(true)
    onSubmit(formData)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-green-400/50 animate-ping" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1c1e] mb-2">Project Registered Successfully!</h2>
        <p className="text-[#44474e] mb-1">{formData.name} has been created and is ready to go.</p>
        <p className="text-sm text-[#74777f] mb-8">Your project dashboard is being prepared.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setSubmitted(false); setCurrentStep(1); setFormData(defaultFormData) }}>
            Register Another
          </Button>
          <Button>Go to Project Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress bar */}
      <Progress value={progress} className="mb-8 h-1.5 bg-[#e8e8ea]" indicatorClassName="bg-gradient-to-r from-[#001736] to-[#002b5b]" />

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {STEPS.map((s, i) => {
          const isCompleted = s.number < currentStep
          const isCurrent = s.number === currentStep
          return (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { if (isCompleted) goToStep(s.number) }}
                  disabled={!isCompleted}
                  className={cn(
                    'h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    isCurrent && 'bg-[#001736] text-white',
                    isCompleted && 'bg-green-500 text-white cursor-pointer hover:bg-green-600',
                    !isCurrent && !isCompleted && 'bg-[#e8e8ea] text-[#74777f]'
                  )}
                  style={isCurrent ? { boxShadow: '0 4px 12px rgba(0,23,54,0.2)' } : undefined}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </button>
                <span className={cn(
                  'text-xs font-medium hidden sm:block text-center max-w-[80px]',
                  isCurrent ? 'text-[#1a1c1e]' : 'text-[#74777f]'
                )}>
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-1 rounded-full transition-colors',
                  s.number < currentStep ? 'bg-green-500' : 'bg-[#e8e8ea]'
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step title */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1a1c1e]">
          Step {step.number}: {step.title}
        </h2>
        <p className="text-sm text-[#44474e] mt-1">{step.description}</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Content area */}
      <div className="min-h-[400px] mb-8">
        {children({ formData, setFormData, currentStep, goToStep })}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6" style={{ borderTop: '1px solid #e8e8ea' }}>
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>

        <div className="flex gap-3">
          {currentStep === STEPS.length ? (
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-[#001736] to-[#002b5b] hover:opacity-90 text-white px-8">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Register Project
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
