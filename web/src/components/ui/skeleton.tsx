import { cn } from "~/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "motion-reduce:animate-none animate-pulse rounded-[var(--ss-radius-sm)] bg-[linear-gradient(110deg,var(--ss-color-surface-subtle),var(--ss-color-surface-brand-tint),var(--ss-color-surface-subtle))]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
