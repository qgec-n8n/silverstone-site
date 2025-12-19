import React, { useEffect, useMemo, useRef, useState } from "react";

const BOOK_CTA = "Book a Call";
const DIGIT_SEQUENCE = Array.from({ length: 10 }, (_, index) => index);

function renderWithStrong(text) {
  if (!text || !text.includes("**")) return text;

  const parts = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={`strong-${idx}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
    idx += 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function SparklesCanvas({ density = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let rafId = null;
    let particles = [];

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const createParticles = () => {
      const count = Math.min(density, Math.max(40, Math.floor((width * height) / 8000)));
      const list = [];
      for (let i = 0; i < count; i += 1) {
        list.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE
          // SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE
          r: Math.random() * 2.6 + 0.8,
          speed: Math.random() * 0.45 + 0.2,
          alpha: Math.random() * 0.5 + 0.45,
        });
      }
      return list;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reducedMotion) {
          p.y += p.speed;
          if (p.y > height + 6) {
            p.y = -6;
            p.x = Math.random() * width;
            p.alpha = Math.random() * 0.5 + 0.4;
          }
        }
      }
    };

    const tick = () => {
      draw();
      rafId = window.requestAnimationFrame(tick);
    };

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(resize);
      observer.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    resize();
    if (!reducedMotion) {
      tick();
    } else {
      draw();
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas className="ss-pricing__sparkles" ref={canvasRef} />;
}

function PricingToggle({ value, onChange }) {
  const isSetup = value === "setup";
  return (
    <div className="ss-pricing__toggle" role="group" aria-label="Pricing period">
      <span
        className="ss-pricing__toggle-slider"
        style={{ transform: isSetup ? "translateX(100%)" : "translateX(0%)" }}
      />
      <button
        type="button"
        className={`ss-pricing__toggle-button ${!isSetup ? "is-active" : ""}`}
        onClick={() => onChange("monthly")}
      >
        Monthly
      </button>
      <button
        type="button"
        className={`ss-pricing__toggle-button ${isSetup ? "is-active" : ""}`}
        onClick={() => onChange("setup")}
      >
        Setup
      </button>
    </div>
  );
}

// SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT
function PriceDigits({ value, className = "", prefix = "£" }) {
  const formattedValue = useMemo(() => String(value ?? ""), [value]);
  const characters = useMemo(() => formattedValue.split(""), [formattedValue]);
  const ariaLabel = `${prefix}${formattedValue}`;

  return (
    <span className={`ss-pricing__price-digits ${className}`.trim()} aria-label={ariaLabel}>
      <span className="ss-pricing__sr-only">{ariaLabel}</span>
      <span className="ss-pricing__price-prefix" aria-hidden="true">
        {prefix}
      </span>
      {characters.map((char, index) => {
        if (char >= "0" && char <= "9") {
          return (
            <span className="ss-pricing__digit" aria-hidden="true" key={`digit-${index}`}>
              <span className="ss-pricing__digit-track" style={{ "--ss-digit-value": Number(char) }}>
                {DIGIT_SEQUENCE.map((digit) => (
                  <span className="ss-pricing__digit-char" key={`digit-${index}-${digit}`}>
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          );
        }
        return (
          <span className="ss-pricing__digit-separator" aria-hidden="true" key={`separator-${index}`}>
            {char}
          </span>
        );
      })}
    </span>
  );
}

function PlanCard({ plan, billingMode, bookHref, index }) {
  const isSetup = billingMode === "setup";
  const priceValue = isSetup ? plan.setupFee : plan.monthlyRetainer;

  return (
    <article
      className={`ss-pricing__card ss-pricing__fade-up ${plan.badge ? "is-featured" : ""}`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {plan.badge ? <div className="ss-pricing__badge">{plan.badge}</div> : null}
      <h3 className="ss-pricing__card-title">{plan.name}</h3>
      <div className="ss-pricing__price">
        <PriceDigits className="ss-pricing__price-value" value={priceValue} />
        {!isSetup ? <span className="ss-pricing__price-suffix">/mo</span> : null}
      </div>
      <p className="ss-pricing__description">{plan.bestFor}</p>
      <a
        className={`ss-pricing__cta ${plan.badge ? "is-featured" : ""}`}
        href={bookHref}
      >
        {BOOK_CTA}
      </a>
      <div className="ss-pricing__includes">
        <div className="ss-pricing__includes-title">What's included</div>
        <ul className="ss-pricing__list">
          {plan.includes.map((item, idx) => (
            <li className="ss-pricing__list-item" key={`${plan.name}-item-${idx}`}>
              <span className="ss-pricing__list-dot" />
              <span>{renderWithStrong(item)}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function GroupCard({ group, bookHref, index }) {
  const hasOneLiner = group.oneLiner && group.oneLiner.trim().length > 0;

  return (
    <article
      className="ss-pricing__card ss-pricing__fade-up"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <h3 className="ss-pricing__card-title">{group.groupLabel}</h3>
      {hasOneLiner ? <p className="ss-pricing__description">{group.oneLiner}</p> : null}
      <a className="ss-pricing__cta" href={bookHref}>
        {BOOK_CTA}
      </a>
      <div className="ss-pricing__includes">
        <div className="ss-pricing__includes-title">Plans</div>
        <div className="ss-pricing__includes-body">
          <ul className="ss-pricing__group-list">
            {group.plans.map((plan, idx) => {
              if (plan.kind === "category") {
                return (
                  <li className="ss-pricing__category" key={`${group.groupLabel}-cat-${idx}`}>
                    {plan.text}
                  </li>
                );
              }
              return (
                <li className="ss-pricing__item" key={`${group.groupLabel}-item-${idx}`}>
                  <span className="ss-pricing__item-dot" />
                  <span>{renderWithStrong(plan.text)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function PricingWidget({ pageKey, sectionData, sectionId }) {
  const [billingMode, setBillingMode] = useState("monthly");
  const isSection1 = sectionId === "1";
  const bookHref = pageKey.startsWith("niches/") ? "../book.html" : "book.html";

  useEffect(() => {
    setBillingMode("monthly");
  }, [sectionId, pageKey]);

  const content = useMemo(() => {
    if (!sectionData) return null;
    if (isSection1) {
      return sectionData.plans.map((plan, index) => (
        <PlanCard
          key={`${plan.name}-${index}`}
          plan={plan}
          billingMode={billingMode}
          bookHref={bookHref}
          index={index}
        />
      ));
    }

    return sectionData.groups.map((group, index) => (
      <GroupCard
        key={`${group.groupLabel}-${index}`}
        group={group}
        bookHref={bookHref}
        index={index}
      />
    ));
  }, [sectionData, isSection1, billingMode, bookHref]);

  if (!sectionData) return null;

  return (
    <div className={`ss-pricing__widget ${isSection1 ? "is-section-1" : "is-section-2"}`}>
      <div className="ss-pricing__gridlines" aria-hidden="true" />
      <SparklesCanvas />
      <div className="ss-pricing__glow" aria-hidden="true" />
      <div className="ss-pricing__content">
        <header className="ss-pricing__header">
          <h2 className="ss-pricing__title">{sectionData.title}</h2>
          <p className="ss-pricing__subtitle">{sectionData.subtitle}</p>
          {isSection1 ? (
            <PricingToggle value={billingMode} onChange={setBillingMode} />
          ) : null}
        </header>
        <div className="ss-pricing__grid">{content}</div>
      </div>
    </div>
  );
}
