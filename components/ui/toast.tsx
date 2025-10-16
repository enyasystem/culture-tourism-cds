"use client"

import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "info"
}

const ToastContext = React.createContext<{
  toast: (opts: ToastProps) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((opts: ToastProps) => {
    setToasts((t) => [...t, opts])
    setOpen(true)
  }, [])

  const handleOpenChange = (val: boolean) => {
    setOpen(val)
    if (!val) {
      // remove first toast after it closes
      setToasts((t) => t.slice(1))
    }
  }

  const current = toasts[0]

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastPrimitive.Provider>
        {current && (
          <ToastPrimitive.Root
            open={open}
            onOpenChange={handleOpenChange}
            className={cn("data-[swipe=tap]:animate-toast-hide fixed bottom-6 right-6 z-50 w-[320px] rounded-lg border bg-popover p-4 shadow-md")}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {current.variant === "success" ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : current.variant === "error" ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
              <div>
                {current.title && <div className="font-semibold">{current.title}</div>}
                {current.description && <div className="text-sm text-muted-foreground">{current.description}</div>}
              </div>
            </div>
            <ToastPrimitive.Viewport />
          </ToastPrimitive.Root>
        )}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return ctx
}

export default ToastProvider
