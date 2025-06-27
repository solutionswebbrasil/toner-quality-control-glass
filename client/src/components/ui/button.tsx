
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "classic-btn inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "classic-btn-primary bg-blue-700 text-white border border-blue-900 hover:bg-blue-800",
        destructive: "bg-red-600 text-white border border-red-800 hover:bg-red-700",
        outline: "classic-btn bg-gray-200 text-gray-800 border border-gray-400 hover:bg-gray-300",
        secondary: "classic-btn bg-gray-200 text-gray-800 border border-gray-400 hover:bg-gray-300",
        ghost: "classic-btn bg-transparent text-gray-800 border-0 hover:bg-gray-100",
        link: "text-blue-700 underline hover:text-blue-800 border-0 bg-transparent p-0",
      },
      size: {
        default: "px-3 py-1.5 text-sm",
        sm: "px-2 py-1 text-xs",
        lg: "px-4 py-2 text-base",
        icon: "h-8 w-8 p-0",
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
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
