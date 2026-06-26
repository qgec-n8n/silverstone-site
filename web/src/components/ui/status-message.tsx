import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
} from "~/components/icons/lucide";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { cn } from "~/lib/utils";

const statusMessageVariants = cva("", {
  variants: {
    tone: {
      info: "border-[var(--ss-color-state-info-border)] bg-[var(--ss-color-state-info-bg)] text-[var(--ss-color-state-info-fg)]",
      success:
        "border-[var(--ss-color-state-success-border)] bg-[var(--ss-color-state-success-bg)] text-[var(--ss-color-state-success-fg)]",
      warning:
        "border-[var(--ss-color-state-warning-border)] bg-[var(--ss-color-state-warning-bg)] text-[var(--ss-color-state-warning-fg)]",
      danger:
        "border-[var(--ss-color-state-danger-border)] bg-[var(--ss-color-state-danger-bg)] text-[var(--ss-color-state-danger-fg)]",
      neutral: "border-border bg-card text-card-foreground",
    },
  },
  defaultVariants: {
    tone: "info",
  },
});

const statusIcons = {
  info: InfoIcon,
  success: CheckCircle2Icon,
  warning: TriangleAlertIcon,
  danger: AlertCircleIcon,
  neutral: InfoIcon,
} as const;

type StatusMessageTone = NonNullable<
  VariantProps<typeof statusMessageVariants>["tone"]
>;

type StatusMessageProps = {
  description: ReactNode;
  title: ReactNode;
  icon?: ReactNode;
  className?: string;
  tone?: StatusMessageTone;
};

function StatusMessage({
  className,
  description,
  icon,
  title,
  tone = "info",
}: StatusMessageProps) {
  const Icon = statusIcons[tone];

  return (
    <Alert
      className={cn(
        "rounded-[var(--ss-radius-md)] shadow-xs [&_[data-slot=alert-description]]:text-current/90",
        statusMessageVariants({ tone }),
        className,
      )}
    >
      {icon ?? <Icon aria-hidden="true" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export { StatusMessage, statusMessageVariants };
