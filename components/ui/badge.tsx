import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-[3px] font-mono text-[11.5px] transition-colors",
  {
    variants: {
      variant: {
        default: "border-line text-muted hover:border-lime-dim hover:text-lime",
        live: "border-cyan/35 text-cyan",
        building: "border-lime/35 text-lime",
        shipped: "border-line text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
