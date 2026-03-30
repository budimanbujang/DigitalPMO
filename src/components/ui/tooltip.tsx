import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

interface TooltipProviderProps {
  delayDuration?: number
  children: React.ReactNode
}

interface TooltipProviderContextValue {
  delayDuration: number
}

const TooltipProviderContext = React.createContext<TooltipProviderContextValue>({
  delayDuration: 200,
})

function TooltipProvider({ delayDuration = 200, children }: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipProviderContext.Provider>
  )
}

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  delayDuration: number
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function useTooltipContext() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error("Tooltip components must be used within a Tooltip provider")
  }
  return context
}

interface TooltipProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  children: React.ReactNode
}

function Tooltip({ open: controlledOpen, defaultOpen = false, onOpenChange, delayDuration: localDelay, children }: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const triggerRef = React.useRef<HTMLElement>(null)
  const providerContext = React.useContext(TooltipProviderContext)

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const delayDuration = localDelay ?? providerContext.delayDuration
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(value)
      }
      onOpenChange?.(value)
    },
    [controlledOpen, onOpenChange]
  )

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const { setOpen, triggerRef, delayDuration } = useTooltipContext()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const mergedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    },
    [ref, triggerRef]
  )

  const handleMouseEnter = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(true), delayDuration)
  }, [setOpen, delayDuration])

  const handleMouseLeave = React.useCallback(() => {
    clearTimeout(timeoutRef.current)
    setOpen(false)
  }, [setOpen])

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <button
      ref={mergedRef}
      type="button"
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    />
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", sideOffset = 4, children, ...props }, ref) => {
    const { open, triggerRef } = useTooltipContext()
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    React.useEffect(() => {
      if (!open || !triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      let top: number
      let left: number

      switch (side) {
        case "top":
          top = rect.top - sideOffset + window.scrollY
          left = rect.left + rect.width / 2 + window.scrollX
          break
        case "bottom":
          top = rect.bottom + sideOffset + window.scrollY
          left = rect.left + rect.width / 2 + window.scrollX
          break
        case "left":
          top = rect.top + rect.height / 2 + window.scrollY
          left = rect.left - sideOffset + window.scrollX
          break
        case "right":
          top = rect.top + rect.height / 2 + window.scrollY
          left = rect.right + sideOffset + window.scrollX
          break
        default:
          top = rect.top - sideOffset + window.scrollY
          left = rect.left + rect.width / 2 + window.scrollX
      }

      setPosition({ top, left })
    }, [open, side, sideOffset, triggerRef])

    if (!open || !mounted) return null

    const transformMap = {
      top: "-translate-x-1/2 -translate-y-full",
      bottom: "-translate-x-1/2",
      left: "-translate-x-full -translate-y-1/2",
      right: "-translate-y-1/2",
    }

    return createPortal(
      <div
        ref={ref}
        role="tooltip"
        className={cn(
          "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          transformMap[side],
          className
        )}
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
        }}
        {...props}
      >
        {children}
      </div>,
      document.body
    )
  }
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
