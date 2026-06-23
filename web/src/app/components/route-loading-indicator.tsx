import { useNavigation } from "react-router";

export function RouteLoadingIndicator() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  return (
    <div
      aria-hidden={!isLoading}
      aria-label={isLoading ? "Loading route" : undefined}
      className="h-0.5 w-full overflow-hidden bg-transparent"
      role={isLoading ? "progressbar" : undefined}
    >
      <div
        className={
          isLoading
            ? "motion-reduce:animate-none h-full w-full origin-left animate-pulse bg-[var(--ss-color-action-accent-bg)]"
            : "h-full w-0"
        }
      />
    </div>
  );
}
