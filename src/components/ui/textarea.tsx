import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border-0 bg-[#f3f3f6] px-3 py-2 text-sm text-[#1a1c1e] transition-all duration-200 placeholder:text-[#44474e]/60 focus-visible:outline-none focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#d6e3ff] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border aria-[invalid=true]:border-[#dc2626]",
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
