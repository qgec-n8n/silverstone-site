import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Link, useInRouterContext } from "react-router";

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
  href,
  variant,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof textLinkVariants> & {
    asChild?: boolean;
  }) {
  // A native anchor to an internal path reloads the document, which replays the
  // CoreSpin loader and Aether intro on the destination; a `Link` lands on the
  // body. The router-context guard keeps the component usable in isolation
  // (unit tests render it outside a router), where it degrades to the anchor.
  const inRouterContext = useInRouterContext();
  const classNames = cn(textLinkVariants({ className, variant }));

  if (
    !asChild &&
    inRouterContext &&
    href !== undefined &&
    href.startsWith("/") &&
    !href.startsWith("//")
  ) {
    return (
      <Link
        className={classNames}
        data-slot="text-link"
        data-variant={variant}
        prefetch="intent"
        to={href}
        {...props}
      />
    );
  }

  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="text-link"
      data-variant={variant}
      className={classNames}
      href={href}
      {...props}
    />
  );
}

export { TextLink, textLinkVariants };
