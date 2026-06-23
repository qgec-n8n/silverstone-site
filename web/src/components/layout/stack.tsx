import { cn } from "~/lib/utils";

type StackProps = React.ComponentProps<"div"> & {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
};

const gapClasses = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
} as const;

function Stack({ className, gap = "md", ...props }: StackProps) {
  return (
    <div
      data-gap={gap}
      data-slot="stack"
      className={cn("flex flex-col", gapClasses[gap], className)}
      {...props}
    />
  );
}

export { Stack };
