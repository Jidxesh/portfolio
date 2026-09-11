import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm font-mono text-[13.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-lime disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-lime text-ink border border-lime hover:bg-lime-hover hover:border-lime-hover",
        outline:
          "border border-line text-white hover:border-lime hover:bg-lime/[0.07]",
        ghost: "text-muted hover:text-white",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: { variant: "outline", size: "default" },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
