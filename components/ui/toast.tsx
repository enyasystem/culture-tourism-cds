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
      // remove the most-recent toast after it closes
      setToasts((t) => {
        if (t.length <= 1) return []
        return t.slice(0, -1)
      })
    }
  }

  // show the newest toast (last in the queue) so rapid actions don't show older messages
  const current = toasts.length > 0 ? toasts[toasts.length - 1] : undefined

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastPrimitive.Provider>
        {current && (
          <ToastPrimitive.Root
            open={open}
            onOpenChange={handleOpenChange}
            duration={4000}
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
                {current.title && (
                  <ToastPrimitive.Title className="font-semibold">{current.title}</ToastPrimitive.Title>
                )}
                {current.description && (
                  <ToastPrimitive.Description className="text-sm text-muted-foreground">{current.description}</ToastPrimitive.Description>
                )}
              </div>
            </div>
          </ToastPrimitive.Root>
        )}

        {/* Viewport should be present within the provider so toasts can render reliably */}
        <ToastPrimitive.Viewport className="fixed bottom-6 right-6 z-50" />
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
