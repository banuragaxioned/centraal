import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-primary text-primary-foreground hover:bg-hover hover:text-hover-foreground border border-border",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 focus:ring-destructive",
        success: "bg-success text-success-foreground hover:bg-success/80 focus:ring-success",
        outline: "border border-input hover:bg-hover hover:text-hover-foreground",
        ghost:
          "hover:bg-hover hover:text-hover-foreground data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent focus:ring-transparent focus:outline-0",
        link: "underline-offset-4 hover:underline text-foreground",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
