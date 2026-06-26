import { cn } from "~/lib/utils";

type BackgroundGradientSnippetProps = {
  className?: string;
};

export default function BackgroundGradientSnippet({
  className,
}: BackgroundGradientSnippetProps) {
  return (
    <div
      className={cn("fixed inset-0 -z-10 bg-[#05070d]", className)}
      data-ss-background="industry-gradient"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_560px_at_50%_200px,#5EC5D0,transparent)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#5EC5D026_1px,transparent_1px),linear-gradient(to_bottom,#597FAD24_1px,transparent_1px)] bg-[size:18px_18px]" />
    </div>
  );
}
