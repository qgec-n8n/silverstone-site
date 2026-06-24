import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

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
      className={cn("flex flex-wrap items-center gap-1", className)}
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

type SiteNavDisclosureLink = {
  current?: boolean;
  description?: string;
  family?: string;
  href: string;
  label: string;
};

type SiteNavDisclosureProps = {
  children?: ReactNode;
  className?: string;
  label: string;
  links: SiteNavDisclosureLink[];
  renderLink?: (link: SiteNavDisclosureLink) => ReactNode;
};

function SiteNavDisclosure({
  children,
  className,
  label,
  links,
  renderLink,
}: SiteNavDisclosureProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const wide = links.length > 4;

  return (
    <div
      className={cn("relative", className)}
      data-slot="site-nav-disclosure"
      ref={containerRef}
    >
      <Button
        aria-controls={panelId}
        aria-expanded={open}
        className="gap-1 text-body-sm font-medium text-muted-foreground hover:text-foreground"
        onClick={() => setOpen((value) => !value)}
        size="sm"
        type="button"
        variant="ghost"
      >
        {label}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </Button>
      <div
        className={cn(
          "ss-glass-strong absolute top-full left-0 z-[500] mt-3 rounded-[var(--ss-radius-lg)] p-2",
          wide ? "w-[min(92vw,34rem)]" : "w-[min(92vw,20rem)]",
          !open && "hidden",
        )}
        id={panelId}
      >
        {children ? (
          <p className="ss-mono-label px-3 pt-2 pb-1 text-[color:var(--ss-v2-cyan)]">
            {children}
          </p>
        ) : null}
        <ul
          className={cn("grid gap-1 p-1", wide && "sm:grid-cols-2")}
          onClick={() => setOpen(false)}
        >
          {links.map((link) => (
            <li key={link.href}>
              {renderLink ? (
                renderLink(link)
              ) : (
                <SiteNavLink
                  className="block w-full px-3 py-2"
                  current={link.current === true}
                  href={link.href}
                >
                  {link.label}
                </SiteNavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { SiteNav, SiteNavDisclosure, SiteNavItem, SiteNavLink, SiteNavList };
export type { SiteNavDisclosureLink };
