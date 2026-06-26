import { useId, useState } from "react";
import { ChevronDown as ChevronDownIcon } from "~/components/icons/lucide";

import { Button } from "~/components/ui/button";
import { TextLink } from "~/components/ui/text-link";
import { cn } from "~/lib/utils";

function SiteNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Primary"
      data-slot="site-nav"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

function SiteNavList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="site-nav-list"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

function SiteNavItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="site-nav-item"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

function SiteNavLink({
  className,
  current = false,
  ...props
}: React.ComponentProps<"a"> & {
  current?: boolean;
}) {
  return (
    <TextLink
      aria-current={current ? "page" : undefined}
      className={cn(
        "rounded-[var(--ss-radius-pill)] px-2 py-1",
        current && "bg-[var(--ss-color-surface-brand-tint)] text-foreground",
        className,
      )}
      variant="navigation"
      {...props}
    />
  );
}

type SiteNavDisclosureProps = {
  children: React.ReactNode;
  className?: string;
  label: string;
  links: {
    current?: boolean;
    href: string;
    label: string;
  }[];
};

function SiteNavDisclosure({
  children,
  className,
  label,
  links,
}: SiteNavDisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={cn("relative", className)} data-slot="site-nav-disclosure">
      <Button
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        size="sm"
        type="button"
        variant="ghost"
      >
        {label}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            "ss-motion-decorative size-4 transition-transform motion-reduce:duration-75",
            open && "rotate-180",
          )}
        />
      </Button>
      <div
        className={cn(
          "absolute top-full left-0 z-[500] mt-2 min-w-56 rounded-[var(--ss-radius-md)] border border-border bg-card p-2 shadow-md",
          !open && "hidden",
        )}
        id={panelId}
      >
        <div className="px-2 py-1 text-caption font-semibold tracking-[var(--ss-type-track-eyebrow)] text-muted-foreground uppercase">
          {children}
        </div>
        <ul className="mt-1 flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <SiteNavLink
                className="w-full justify-start px-2 py-2"
                current={link.current === true}
                href={link.href}
              >
                {link.label}
              </SiteNavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { SiteNav, SiteNavDisclosure, SiteNavItem, SiteNavLink, SiteNavList };
