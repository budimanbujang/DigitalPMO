import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border-0 bg-[var(--surface-container-low)] px-3 py-2 text-sm text-[var(--on-surface)] transition-all duration-200 placeholder:text-[var(--on-surface-variant)]/60 focus-visible:outline-none focus-visible:bg-[var(--surface-container-lowest)] focus-visible:ring-2 focus-visible:ring-[var(--primary-fixed)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border aria-[invalid=true]:border-[#dc2626]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
