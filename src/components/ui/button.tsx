import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ferrari-red text-white hover:bg-ferrari-red-dark focus-visible:ring-ferrari-red",
        primary: "bg-ferrari-red text-white hover:bg-ferrari-red-dark focus-visible:ring-ferrari-red",
        black: "bg-black text-white border-black hover:bg-neutral-800 focus-visible:ring-black",
        ghost: "hover:bg-muted hover:text-foreground focus-visible:ring-muted-foreground",
        outline: "border-border bg-transparent hover:bg-muted hover:text-foreground focus-visible:ring-border",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive",
        link: "text-primary underline-offset-4 hover:underline",
        white: "bg-white text-black border-white hover:bg-gray-100 focus-visible:ring-white",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm tracking-wide",
        sm: "h-8 px-3 text-xs tracking-widest",
        lg: "h-12 px-8 text-base tracking-widest",
        xl: "h-14 px-10 text-lg tracking-widest",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }