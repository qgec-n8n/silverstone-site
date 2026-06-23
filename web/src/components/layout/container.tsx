import { cn } from "~/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  size?: "compact" | "content" | "wide" | "max";
};

function Container({ className, size = "content", ...props }: ContainerProps) {
  return (
    <div
      data-size={size}
      data-slot="container"
      className={cn("ss-container", className)}
      {...props}
    />
  );
}

export { Container };
