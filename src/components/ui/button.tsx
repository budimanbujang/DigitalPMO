import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6e3ff] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#001736] to-[#002b5b] text-white shadow-[0_12px_40px_rgba(26,28,30,0.06)] hover:shadow-[0_12px_40px_rgba(26,28,30,0.12)] hover:brightness-110",
        destructive:
          "bg-[#fee2e2] text-[#7f1d1d] hover:bg-[#fecaca]",
        outline:
          "border border-[#1a1c1e]/15 bg-transparent text-[#1a1c1e] hover:bg-[#e8e8ea]",
        secondary:
          "bg-transparent text-[#001736] hover:bg-[#e8e8ea]",
        ghost:
          "bg-transparent text-[#001736] hover:bg-[#e8e8ea]",
        tertiary:
          "bg-[#f3f3f6] text-[#44474e] hover:bg-[#e8e8ea]",
        link:
          "text-[#001736] underline-offset-4 hover:underline",
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
