import { cn } from "~/lib/utils";

function SkipLink({
  children = "Skip to content",
  className,
  href = "#main-content",
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "ss-focus-ring sr-only fixed top-4 left-4 z-[9999] rounded-[var(--ss-radius-pill)] bg-card px-4 py-2 text-body-sm font-semibold text-foreground shadow-sm focus:not-sr-only",
        className,
      )}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}

export { SkipLink };
