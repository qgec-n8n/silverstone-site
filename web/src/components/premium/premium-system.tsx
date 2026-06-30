import { useId, useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Link } from "react-router";
import {
  ArrowUpRight,
  CheckCircle2Icon,
  ChevronDown,
  Plug,
  type LucideIcon,
} from "~/components/icons/lucide";

import { Container } from "~/components/layout/container";
import { Stack } from "~/components/layout/stack";
import { Button } from "~/components/ui/button";
import { StatusMessage } from "~/components/ui/status-message";
import { cn } from "~/lib/utils";
import {
  cardInteractionVariants,
  faqContentVariants,
  motionViewport,
  motionTransitions,
  pressableVariants,
  revealVariants,
  staggerGroupVariants,
} from "~/motion";

type Action = {
  href: string;
  label: string;
  tone?: "primary" | "secondary";
};

type PageHeroShellProps = {
  actions?: readonly Action[];
  children?: ReactNode;
  className?: string;
  description: ReactNode;
  eyebrow: ReactNode;
  kicker?: ReactNode;
  title: ReactNode;
};

export function PageHeroShell({
  actions = [],
  children,
  className,
  description,
  eyebrow,
  kicker,
  title,
}: PageHeroShellProps) {
  return (
    <m.section
      className={cn("ss-void-bg relative overflow-hidden", className)}
      initial="hidden"
      variants={staggerGroupVariants}
      viewport={motionViewport.precise}
      whileInView="show"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[var(--ss-v2-gradient-signal)] opacity-60"
      />
      <Container className="relative py-24 md:py-32" size="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(18rem,0.72fr)] lg:items-end">
          <Stack gap="lg">
            <m.div variants={revealVariants}>
              <span className="ss-eyebrow text-[color:var(--ss-v2-signal-cyan)]">
                {eyebrow}
              </span>
            </m.div>
            <m.h1
              className="max-w-[var(--ss-v2-measure-title)] text-display text-platinum"
              variants={revealVariants}
            >
              {title}
            </m.h1>
            <m.p
              className="ss-lead max-w-[var(--ss-v2-measure-lead)] text-titanium"
              variants={revealVariants}
            >
              {description}
            </m.p>
            {actions.length > 0 ? (
              <m.div className="flex flex-wrap gap-3" variants={revealVariants}>
                {actions.map((action) => (
                  <m.div
                    initial="rest"
                    key={action.href}
                    variants={pressableVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      asChild
                      className={
                        action.tone === "secondary"
                          ? "border-[color:var(--ss-v2-hairline-strong)] bg-transparent text-platinum hover:bg-[var(--ss-v2-glass)]"
                          : "bg-[var(--ss-v2-signal-cyan)] text-[#05070a] hover:bg-[var(--ss-v2-aqua)]"
                      }
                      variant={action.tone === "secondary" ? "outline" : "default"}
                    >
                      <Link to={action.href}>
                        {action.label}
                        <ArrowUpRight aria-hidden className="size-4" />
                      </Link>
                    </Button>
                  </m.div>
                ))}
              </m.div>
            ) : null}
          </Stack>
          {kicker || children ? (
            <m.aside
              className="rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-hairline)] bg-[var(--ss-v2-glass)] p-5 text-body-sm text-titanium backdrop-blur"
              variants={revealVariants}
            >
              {kicker ? <p className="font-medium text-platinum">{kicker}</p> : null}
              {children}
            </m.aside>
          ) : null}
        </div>
      </Container>
    </m.section>
  );
}

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
};

export function SectionShell({
  children,
  className,
  description,
  eyebrow,
  title,
}: SectionShellProps) {
  return (
    <m.section
      className={cn("ss-section", className)}
      initial="hidden"
      variants={staggerGroupVariants}
      viewport={motionViewport.standard}
      whileInView="show"
    >
      <Container size="wide">
        {eyebrow || title || description ? (
          <m.header className="mb-10 max-w-4xl" variants={revealVariants}>
            {eyebrow ? (
              <span className="ss-eyebrow text-muted-foreground">{eyebrow}</span>
            ) : null}
            {title ? <h2 className="mt-3 text-h2">{title}</h2> : null}
            {description ? (
              <p className="ss-lead mt-4 text-muted-foreground">{description}</p>
            ) : null}
          </m.header>
        ) : null}
        <m.div variants={revealVariants}>{children}</m.div>
      </Container>
    </m.section>
  );
}

type ConversionPanelProps = {
  actions: readonly Action[];
  className?: string;
  description: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
};

export function ConversionPanel({
  actions,
  className,
  description,
  eyebrow = "Next step",
  title,
}: ConversionPanelProps) {
  return (
    <m.aside
      className={cn(
        "relative overflow-hidden rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-hairline-strong)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--ss-v2-glass-strong)_72%,#070b14),color-mix(in_srgb,var(--ss-v2-signal-violet)_10%,#05070a))] p-6 text-platinum shadow-[var(--ss-v2-glow-soft)] md:p-8",
        className,
      )}
      initial="hidden"
      variants={staggerGroupVariants}
      viewport={motionViewport.standard}
      whileInView="show"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[var(--ss-v2-gradient-spectrum)] opacity-70"
      />
      <m.div variants={revealVariants}>
        <span className="ss-eyebrow text-[color:var(--ss-v2-signal-cyan)]">
          {eyebrow}
        </span>
        <h2 className="mt-3 text-h3 text-platinum">{title}</h2>
        <p className="ss-lead mt-4 text-titanium">{description}</p>
      </m.div>
      <m.div className="mt-6 flex flex-wrap gap-3" variants={revealVariants}>
        {actions.map((action) => (
          <m.div
            initial="rest"
            key={action.href}
            variants={pressableVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              asChild
              className={
                action.tone === "secondary"
                  ? "border-[color:var(--ss-v2-hairline-strong)] bg-transparent text-platinum hover:bg-[var(--ss-v2-glass)]"
                  : "bg-[var(--ss-v2-signal-cyan)] text-[#05070a] hover:bg-[var(--ss-v2-aqua)]"
              }
              variant={action.tone === "secondary" ? "outline" : "default"}
            >
              <Link to={action.href}>{action.label}</Link>
            </Button>
          </m.div>
        ))}
      </m.div>
    </m.aside>
  );
}

type PremiumCardProps = {
  description: ReactNode;
  href: string;
  icon?: LucideIcon;
  label?: ReactNode;
  title: ReactNode;
};

function PremiumCard({
  description,
  href,
  icon: Icon,
  label,
  title,
}: PremiumCardProps) {
  return (
    <m.article
      className="group relative min-h-[15rem] overflow-hidden rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-hairline)] bg-[color-mix(in_srgb,var(--ss-v2-glass-strong)_70%,#070b14)] p-5 text-platinum"
      initial="rest"
      variants={cardInteractionVariants}
      whileHover="hover"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[var(--ss-v2-gradient-signal)] opacity-0 transition-opacity duration-200 group-hover:opacity-80"
      />
      <Link
        className="ss-focus-ring absolute inset-0 rounded-[var(--ss-radius-lg)]"
        to={href}
      >
        <span className="sr-only">{title}</span>
      </Link>
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          {Icon ? (
            <span className="grid size-11 place-items-center rounded-[var(--ss-radius-sm)] border border-[color:var(--ss-v2-hairline)] bg-[var(--ss-v2-glass)] text-[color:var(--ss-v2-signal-cyan)]">
              <Icon aria-hidden className="size-5" />
            </span>
          ) : null}
          {label ? (
            <span className="ss-eyebrow text-right text-titanium">{label}</span>
          ) : null}
        </div>
        <Stack className="mt-auto" gap="sm">
          <h3 className="text-h5 text-platinum">{title}</h3>
          <p className="text-body-sm text-titanium">{description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--ss-v2-signal-cyan)]">
            View system
            <ArrowUpRight aria-hidden className="size-4" />
          </span>
        </Stack>
      </div>
    </m.article>
  );
}

export function ServiceCard(props: PremiumCardProps) {
  return <PremiumCard {...props} label={props.label ?? "Service"} />;
}

export function IndustryCard(props: PremiumCardProps) {
  return <PremiumCard {...props} label={props.label ?? "Industry"} />;
}

export type FAQItem = {
  answer: ReactNode;
  question: ReactNode;
};

type FAQListProps = {
  items: readonly FAQItem[];
};

export function FAQList({ items }: FAQListProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-[color:var(--ss-v2-hairline)] rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-hairline)] bg-[var(--ss-v2-glass)]">
      {items.map((item, index) => {
        const open = openIndex === index;
        const itemIndex = String(index);
        const triggerId = `${baseId}-faq-trigger-${itemIndex}`;
        const contentId = `${baseId}-faq-content-${itemIndex}`;
        return (
          <div key={triggerId}>
            <m.button
              aria-controls={contentId}
              aria-expanded={open}
              className="ss-focus-ring flex w-full items-center justify-between gap-5 rounded-[var(--ss-radius-sm)] px-5 py-4 text-left text-body-sm font-semibold text-platinum"
              id={triggerId}
              initial="rest"
              onClick={() => setOpenIndex(open ? -1 : index)}
              type="button"
              variants={pressableVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span>{item.question}</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-4 shrink-0 text-[color:var(--ss-v2-signal-cyan)] transition-transform",
                  open && "rotate-180",
                )}
              />
            </m.button>
            <AnimatePresence initial={false}>
              {open ? (
                <m.div
                  animate="open"
                  aria-labelledby={triggerId}
                  className="overflow-hidden"
                  exit="closed"
                  id={contentId}
                  initial="closed"
                  role="region"
                  variants={faqContentVariants}
                >
                  <div className="px-5 pb-5 text-body-sm text-titanium">
                    {item.answer}
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export type IntegrationItem = {
  category?: ReactNode;
  icon?: LucideIcon;
  name: ReactNode;
};

type IntegrationPresentationProps = {
  description?: ReactNode;
  integrations: readonly IntegrationItem[];
  title?: ReactNode;
};

export function IntegrationPresentation({
  description = "Designed to sit above the tools your team already uses, with clear fallbacks where a direct integration is not yet approved.",
  integrations,
  title = "Work with your existing tools",
}: IntegrationPresentationProps) {
  return (
    <m.div
      className="rounded-[var(--ss-radius-lg)] border border-[color:var(--ss-v2-hairline)] bg-[var(--ss-v2-glass)] p-5 md:p-6"
      initial="hidden"
      variants={staggerGroupVariants}
      viewport={motionViewport.standard}
      whileInView="show"
    >
      <m.div variants={revealVariants}>
        <h2 className="text-h4 text-platinum">{title}</h2>
        <p className="mt-3 text-body-sm text-titanium">{description}</p>
      </m.div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {integrations.map((integration, index) => {
          const Icon = integration.icon ?? Plug;
          const integrationKey =
            typeof integration.name === "string" ? integration.name : String(index);
          return (
            <m.div
              className="flex min-h-20 items-center gap-3 rounded-[var(--ss-radius-md)] border border-[color:var(--ss-v2-hairline)] bg-[color-mix(in_srgb,var(--ss-v2-graphite-raised)_52%,transparent)] p-3"
              key={integrationKey}
              variants={revealVariants}
            >
              <span className="grid size-10 place-items-center rounded-[var(--ss-radius-sm)] bg-[var(--ss-v2-glass)] text-[color:var(--ss-v2-signal-cyan)]">
                <Icon aria-hidden className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-platinum">
                  {integration.name}
                </span>
                {integration.category ? (
                  <span className="text-caption text-titanium">
                    {integration.category}
                  </span>
                ) : null}
              </span>
            </m.div>
          );
        })}
      </div>
    </m.div>
  );
}

type FormFeedbackProps = {
  description: ReactNode;
  title: ReactNode;
  tone: "danger" | "info" | "success" | "warning";
};

export function FormFeedback({ description, title, tone }: FormFeedbackProps) {
  return (
    <m.div
      animate={{ opacity: 1, y: 0 }}
      aria-live={tone === "danger" ? "assertive" : "polite"}
      initial={{ opacity: 0, y: 6 }}
      transition={motionTransitions.ui}
    >
      <StatusMessage
        description={description}
        icon={tone === "success" ? <CheckCircle2Icon aria-hidden /> : undefined}
        title={title}
        tone={tone}
      />
    </m.div>
  );
}
