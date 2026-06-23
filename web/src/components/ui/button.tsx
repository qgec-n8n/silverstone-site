import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "ss-focus-ring ss-transition-interactive inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--ss-radius-sm)] border border-transparent px-4 py-2 text-sm font-semibold whitespace-nowrap shadow-xs transition-[background-color,border-color,color,box-shadow,transform] outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[var(--ss-color-action-primary-hover-bg)]",
        secondary:
          "border-[color:var(--ss-color-action-secondary-border)] bg-[var(--ss-color-action-secondary-bg)] text-[color:var(--ss-color-action-secondary-fg)] hover:bg-[var(--ss-color-surface-subtle)]",
        accent:
          "bg-[var(--ss-color-action-accent-bg)] text-[var(--ss-color-action-accent-fg)] hover:bg-[var(--ss-color-text-link)]",
        outline:
          "border-border bg-card text-card-foreground hover:bg-[var(--ss-color-surface-brand-tint)]",
        ghost:
          "bg-transparent text-foreground shadow-none hover:bg-[var(--ss-color-action-ghost-hover)]",
        link: "bg-transparent px-0 text-[var(--ss-color-text-link)] shadow-none hover:text-[var(--ss-color-text-link-hover)] hover:underline",
        destructive:
          "bg-destructive text-[var(--destructive-foreground)] hover:bg-[var(--ss-color-state-danger-fg)]",
      },
      size: {
        default: "min-w-[11rem]",
        sm: "min-h-10 rounded-[var(--ss-radius-xs)] px-3 text-[0.8125rem]",
        lg: "min-h-12 rounded-[var(--ss-radius-md)] px-6 text-base",
        icon: "size-11 min-w-0 rounded-[var(--ss-radius-pill)] px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
