import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary-fixed)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] text-white",
        secondary:
          "bg-[var(--surface-container-low)] text-[var(--on-surface-variant)]",
        destructive:
          "bg-[#fee2e2] text-[#7f1d1d] dark:bg-red-500/20 dark:text-red-300",
        outline:
          "border border-[var(--outline-variant)] text-[var(--on-surface)]",
        "rag-red":
          "bg-[#fee2e2] text-[#7f1d1d] dark:bg-red-500/15 dark:text-red-400",
        "rag-amber":
          "bg-[#fef3c7] text-[#78350f] dark:bg-amber-500/15 dark:text-amber-400",
        "rag-green":
          "bg-[#dcfce7] text-[#14532d] dark:bg-green-500/15 dark:text-green-400",
        ai: "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-700 dark:from-violet-500/20 dark:to-indigo-500/20 dark:text-violet-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
