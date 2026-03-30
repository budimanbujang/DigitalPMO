import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-fixed)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] text-white shadow-[0_12px_40px_rgba(26,28,30,0.06)] hover:shadow-[0_12px_40px_rgba(26,28,30,0.12)] hover:brightness-110",
        destructive:
          "bg-[#fee2e2] text-[#7f1d1d] hover:bg-[#fecaca]",
        outline:
          "border border-[var(--outline-variant)] bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]",
        secondary:
          "bg-transparent text-[var(--primary)] hover:bg-[var(--surface-container-high)]",
        ghost:
          "bg-transparent text-[var(--primary)] hover:bg-[var(--surface-container-high)]",
        tertiary:
          "bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)]",
        link:
          "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
