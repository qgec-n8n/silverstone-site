/**
 * Route-derived breadcrumb trail for the shared SecondaryHero. Keeps the trail
 * consistent across every service/industry/hub/core page without threading a
 * `breadcrumbs` prop through two dozen call sites — it reads the same nav data
 * the header already uses as its single source of truth for labels.
 */
import { INDUSTRIES_MENU, PRIMARY_LINKS, SERVICES_MENU } from "./nav-data";

export type BreadcrumbCrumb = { label: string; href: string };

const CORE_PAGE_LABELS: Record<string, string> = Object.fromEntries(
  PRIMARY_LINKS.map((link) => [link.href, link.label]),
);
CORE_PAGE_LABELS["/book"] = "Book";

const HOME_CRUMB: BreadcrumbCrumb = { label: "Home", href: "/" };

export function getBreadcrumbTrail(pathname: string): BreadcrumbCrumb[] {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (path === "/" || path === "") {
    return [];
  }

  if (path === SERVICES_MENU.href) {
    return [HOME_CRUMB, { label: SERVICES_MENU.label, href: SERVICES_MENU.href }];
  }

  if (path.startsWith(`${SERVICES_MENU.href}/`)) {
    const item = SERVICES_MENU.items.find((candidate) => candidate.href === path);
    if (item) {
      return [
        HOME_CRUMB,
        { label: SERVICES_MENU.label, href: SERVICES_MENU.href },
        { label: item.label, href: item.href },
      ];
    }
  }

  /* Breadcrumbs (and their JSON-LD) keep the plain "Industries / <name>"
     taxonomy; the "Solutions" + "For …" framing is header-menu copy only. */
  if (path === INDUSTRIES_MENU.href || path === "/industries") {
    return [HOME_CRUMB, { label: "Industries", href: INDUSTRIES_MENU.href }];
  }

  if (path.startsWith(`${INDUSTRIES_MENU.href}/`)) {
    const item = INDUSTRIES_MENU.items.find((candidate) => candidate.href === path);
    if (item) {
      return [
        HOME_CRUMB,
        { label: "Industries", href: INDUSTRIES_MENU.href },
        { label: item.label.replace(/^For /u, ""), href: item.href },
      ];
    }
  }

  const coreLabel = CORE_PAGE_LABELS[path];
  if (coreLabel) {
    return [HOME_CRUMB, { label: coreLabel, href: path }];
  }

  return [];
}
