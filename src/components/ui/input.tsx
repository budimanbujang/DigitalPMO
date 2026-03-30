import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border-0 bg-[var(--surface-container-low)] px-3 py-1 text-sm text-[var(--on-surface)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus-visible:outline-none focus-visible:bg-[var(--surface-container-lowest)] focus-visible:ring-2 focus-visible:ring-[var(--primary-fixed)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border aria-[invalid=true]:border-[#dc2626]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
