"use client";

import type { ReactNode } from "react";

import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

type FieldProps = React.ComponentProps<"div"> & {
  orientation?: "vertical" | "horizontal";
};

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    />
  );
}

function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "group/field flex w-full gap-2",
        orientation === "horizontal"
          ? "items-start justify-between gap-4 max-md:flex-col"
          : "flex-col",
        className,
      )}
      {...props}
    />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    />
  );
}

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("mb-2 text-body-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn(className)} {...props} />;
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-title"
      className={cn("text-body-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative flex items-center py-2", className)}
      {...props}
    >
      <div className="h-px flex-1 bg-border" />
      {children ? (
        <>
          <span className="bg-background px-2 text-body-sm text-muted-foreground">
            {children}
          </span>
          <div className="h-px flex-1 bg-border" />
        </>
      ) : null}
    </div>
  );
}

function FieldError({ className, children, ...props }: React.ComponentProps<"div">) {
  if (!children) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "text-body-sm font-medium text-[var(--ss-color-state-danger-fg)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
