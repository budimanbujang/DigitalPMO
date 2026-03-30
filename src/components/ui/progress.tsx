import * as React from "react"

import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  color?: string
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color, indicatorClassName, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-[#e8e8ea]",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 rounded-full bg-gradient-to-r from-[#001736] to-[#002b5b] transition-all duration-500 ease-out",
            indicatorClassName
          )}
          style={{
            transform: `translateX(-${100 - percentage}%)`,
            ...(color ? { backgroundColor: color, backgroundImage: 'none' } : {}),
          }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
