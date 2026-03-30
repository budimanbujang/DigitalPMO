import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#d6e3ff] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#001736] to-[#002b5b] text-white",
        secondary:
          "bg-[#f3f3f6] text-[#44474e]",
        destructive:
          "bg-[#fee2e2] text-[#7f1d1d]",
        outline:
          "border border-[#1a1c1e]/15 text-[#1a1c1e]",
        "rag-red":
          "bg-[#fee2e2] text-[#7f1d1d]",
        "rag-amber":
          "bg-[#fef3c7] text-[#78350f]",
        "rag-green":
          "bg-[#dcfce7] text-[#14532d]",
        ai: "bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-700",
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
