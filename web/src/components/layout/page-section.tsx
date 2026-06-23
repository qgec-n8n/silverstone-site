import { cn } from "~/lib/utils";

type PageSectionProps = React.ComponentProps<"section"> & {
  spacing?: "default" | "hero" | "compact";
};

function PageSection({ className, spacing = "default", ...props }: PageSectionProps) {
  return (
    <section
      data-space={spacing === "compact" ? "default" : spacing}
      data-slot="page-section"
      className={cn("ss-section", spacing === "compact" && "py-12 lg:py-16", className)}
      {...props}
    />
  );
}

export { PageSection };
