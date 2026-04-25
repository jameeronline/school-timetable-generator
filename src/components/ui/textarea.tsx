import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content min-h-20 w-full border border-border bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ferrari-red focus-visible:ring-1 focus-visible:ring-ferrari-red/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }