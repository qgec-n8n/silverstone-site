import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "~/lib/utils";

const textLinkVariants = cva(
  "ss-focus-ring ss-transition-interactive inline-flex items-center gap-1 rounded-[var(--ss-radius-xs)] font-medium underline decoration-[color:var(--ss-color-border-default)] decoration-[0.08em] underline-offset-4 transition-colors outline-none",
  {
    variants: {
      variant: {
        default:
          "text-[var(--ss-color-text-link)] hover:text-[var(--ss-color-text-link-hover)]",
        subtle:
          "text-muted-foreground decoration-[color:var(--ss-color-border-subtle)] hover:text-foreground",
        navigation: "text-sm text-muted-foreground no-underline hover:text-foreground",
        inverse:
          "text-[var(--ss-color-text-inverse)] decoration-[color:var(--ss-color-border-inverse)] hover:text-[var(--ss-color-primitive-electric-cyan)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TextLink({
  asChild = false,
  className,
  variant,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof textLinkVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="text-link"
      data-variant={variant}
      className={cn(textLinkVariants({ className, variant }))}
      {...props}
    />
  );
}

export { TextLink, textLinkVariants };
