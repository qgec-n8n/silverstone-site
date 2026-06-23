import { cn } from "~/lib/utils";

type ClusterProps = React.ComponentProps<"div"> & {
  gap?: "xs" | "sm" | "md" | "lg";
};

const gapClasses = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
} as const;

function Cluster({ className, gap = "sm", ...props }: ClusterProps) {
  return (
    <div
      data-gap={gap}
      data-slot="cluster"
      className={cn("flex flex-wrap items-center", gapClasses[gap], className)}
      {...props}
    />
  );
}

export { Cluster };
