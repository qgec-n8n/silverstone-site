import * as React from "react";

import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "ss-focus-ring ss-transition-interactive min-h-11 w-full min-w-0 rounded-[var(--ss-radius-sm)] border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--ss-color-surface-subtle)] disabled:text-[var(--ss-color-text-disabled)] aria-invalid:border-[var(--ss-color-state-danger-border)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
