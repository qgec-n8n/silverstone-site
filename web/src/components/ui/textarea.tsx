import * as React from "react";

import { cn } from "~/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "ss-focus-ring ss-transition-interactive flex field-sizing-content min-h-28 w-full rounded-[var(--ss-radius-sm)] border border-input bg-background px-3 py-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-[var(--ss-color-surface-subtle)] disabled:text-[var(--ss-color-text-disabled)] aria-invalid:border-[var(--ss-color-state-danger-border)]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
