import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import type { PricingPageCopy, Row1Plan, Row2Card } from "@/data/pricing-copy";
import { cn } from "@/lib/utils";

type PricingWidgetProps = {
  pageId: string | null;
  copy?: PricingPageCopy;
};

type ToggleState = "monthly" | "setup";

const priceFormat = {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const;

function PricingSwitch({
  value,
  onChange,
}: {
  value: ToggleState;
  onChange: (value: ToggleState) => void;
}) {
  return (
    <div className="flex justify-center" data-ss-pricing-toggle="true">
      <div className="relative mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1 shadow-lg shadow-blue-900/30">
        {(["monthly", "setup"] as ToggleState[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={cn(
              "relative z-10 h-10 w-fit rounded-full px-5 text-sm font-medium transition-colors sm:px-6",
              value === mode ? "text-white" : "text-gray-300",
            )}
          >
            {value === mode && (
              <motion.span
                layoutId="pricing-toggle"
                className="absolute inset-0 rounded-full border-4 border-blue-600/70 bg-gradient-to-t from-blue-500 to-blue-600 shadow-sm shadow-blue-600"
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
              />
            )}
            <span className="relative">{mode === "monthly" ? "Monthly" : "Setup"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  isSetup,
}: {
  plan: Row1Plan;
  isSetup: boolean;
}) {
  const price = isSetup ? plan.setupFee : plan.monthlyRetainer;
  const priceSuffix = isSetup ? "/setup" : "/month";

  return (
    <Card
      className={cn(
        "relative text-white border-neutral-800/80 bg-gradient-to-r from-neutral-900 via-neutral-800/70 to-neutral-900",
        plan.badge
          ? "shadow-[0px_-13px_200px_0px_rgba(37,99,235,0.35)] ring-1 ring-blue-500/40"
          : "shadow-[0px_-6px_120px_0px_rgba(15,23,42,0.35)]",
      )}
    >
      <CardHeader className="text-left space-y-3">
        <div className="flex justify-between items-center gap-3">
          <h3 className="text-2xl sm:text-3xl font-semibold">{plan.name}</h3>
          {plan.badge && (
            <span className="rounded-full bg-blue-600/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_18px_rgba(37,99,235,0.65)]">
              {plan.badge}
            </span>
          )}
        </div>
    <div className="flex items-baseline gap-2">
          <NumberFlow
            format={priceFormat}
            value={price}
            className="text-4xl font-semibold"
          />
          <span className="text-gray-300 text-sm">{priceSuffix}</span>
        </div>
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-gray-100">Best for:</span>{" "}
          <span className="text-gray-300">{plan.bestFor}</span>
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <h4 className="font-medium text-base mb-2 text-gray-100">
            What&apos;s included
          </h4>
          <ul className="space-y-2">
            {plan.includes.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-blue-500/80" />
                <span className="text-sm leading-relaxed text-gray-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function emphasizePlanIncluded(text: string) {
  const match = text.match(/^\*\*(.+?):\*\*\s*(.+)$/);
  if (!match) return text;
  return (
    <>
      <span className="font-semibold text-gray-100">{match[1]}:</span>{" "}
      <span className="text-gray-300">{match[2]}</span>
    </>
  );
}

function SummaryCard({ card }: { card: Row2Card }) {
  return (
    <Card className="relative text-white border-neutral-800/60 bg-gradient-to-r from-neutral-900 via-neutral-800/60 to-neutral-900 shadow-[0px_-6px_120px_0px_rgba(15,23,42,0.25)]">
      <CardHeader className="pb-2">
        <h3 className="text-2xl font-semibold">{card.label}</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{card.oneLiner}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Plans included
          </h4>
          <ul className="space-y-2 max-h-44 overflow-y-auto pr-1 text-left">
            {card.plansIncluded.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm leading-relaxed text-gray-200"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500/80" />
                <span>{emphasizePlanIncluded(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function PricingWidget({ pageId, copy }: PricingWidgetProps) {
  const [mode, setMode] = useState<ToggleState>("monthly");
  const pricingRef = useRef<HTMLDivElement>(null);

  const row1Title = copy?.row1.title || "Pricing";
  const row1Subtitle = copy?.row1.subtitle || "Select the right starting point.";

  const row2Title = copy?.row2.title || "Other options";
  const row2Subtitle = copy?.row2.subtitle || "Additional summaries for this page.";

  const hasCopy = Boolean(copy);

  const revealVariants = useMemo(
    () => ({
      visible: (i: number) => ({
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          delay: i * 0.2,
          duration: 0.6,
          ease: "easeOut",
        },
      }),
      hidden: { y: 24, opacity: 0, filter: "blur(10px)" },
    }),
    [],
  );

  return (
    <div className="relative isolate w-full overflow-hidden rounded-3xl border border-neutral-800 bg-black px-4 py-12 text-white shadow-[0_0_60px_rgba(37,99,235,0.25)] sm:px-8">
      <TimelineContent
        animationNum={0}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-80 w-[120%] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25)_0%,rgba(0,0,0,0)_60%)] blur-2xl" />
        <Sparkles density={160} speed={0.5} color="#8AB8FF" className="opacity-70" />
      </TimelineContent>

      <TimelineContent
        animationNum={1}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-x-[10%] top-12 h-[70%] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,rgba(59,130,246,0)_70%)] blur-3xl" />
      </TimelineContent>

      <article className="relative z-10 mx-auto mb-10 max-w-4xl space-y-3 text-center">
        <TimelineContent
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          as="h2"
          className="text-3xl font-semibold sm:text-4xl"
        >
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.12}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
          >
            {row1Title}
          </VerticalCutReveal>
        </TimelineContent>
        <TimelineContent
          animationNum={3}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          as="p"
          className="text-gray-300"
        >
          {row1Subtitle}
        </TimelineContent>
        <TimelineContent
          animationNum={4}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          as="div"
        >
          <PricingSwitch value={mode} onChange={setMode} />
        </TimelineContent>
      </article>

      {!hasCopy && (
        <div className="relative z-10 text-center text-sm text-gray-300">
          No pricing copy found for {pageId || "this page"}.
        </div>
      )}

      {hasCopy && (
        <div className="relative z-10 space-y-10">
          <div
            className="grid gap-4 md:grid-cols-3"
            data-ss-pricing-row="1"
          >
            {copy!.row1.plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} isSetup={mode === "setup"} />
            ))}
          </div>

          <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="space-y-3 text-center">
            <TimelineContent
              animationNum={5}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              as="h3"
              className="text-2xl font-semibold sm:text-3xl"
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.1}
                staggerFrom="first"
                reverse={false}
                containerClassName="justify-center"
              >
                {row2Title}
              </VerticalCutReveal>
            </TimelineContent>
            <TimelineContent
              animationNum={6}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              as="p"
              className="text-gray-300"
            >
              {row2Subtitle}
            </TimelineContent>
          </div>

          <div
            className="grid gap-4 md:grid-cols-3"
            data-ss-pricing-row="2"
          >
            {copy!.row2.cards.map((card) => (
              <SummaryCard key={card.label} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
