import "~/styles/visual/visual.css";

export type InstrumentStep = {
  label: string;
  detail: string;
};

export type IndustryInstrumentProps = {
  sector: string;
  instrument: string;
  caption: string;
  steps: InstrumentStep[];
  boundary: string;
};

/**
 * Shared industry instrument. Each sector page reuses this shape: a small dial
 * signature, a synthetic intake → triage → human-hand-off sequence, and an
 * explicit human-in-control boundary note. Content is supplied per sector; the
 * component invents no metrics or outcomes.
 */
export function IndustryInstrument({
  sector,
  instrument,
  caption,
  steps,
  boundary,
}: IndustryInstrumentProps) {
  return (
    <section className="ss-instrument" aria-label={`${sector} operating instrument`}>
      <div className="ss-instrument__head">
        <svg
          className="ss-instrument__dial"
          viewBox="0 0 120 120"
          role="img"
          aria-label={`${instrument} dial`}
        >
          <circle className="ss-vsig__ring" cx="60" cy="60" r="48" />
          <circle className="ss-vsig__ring" cx="60" cy="60" r="32" />
          <path className="ss-vsig__signal" d="M60 60 L96 40" />
          <circle className="ss-vsig__focus" cx="60" cy="60" r="6" />
        </svg>
        <div>
          <p className="ss-instrument__sector">{sector}</p>
          <h3 className="ss-instrument__title">{instrument}</h3>
          <p className="ss-instrument__caption">{caption}</p>
        </div>
      </div>

      <ol className="ss-sequence">
        {steps.map((step, position) => (
          <li className="ss-sequence__step" key={`${step.label}-${String(position)}`}>
            <span className="ss-sequence__num">{String(position + 1)}</span>
            <span className="ss-sequence__body">
              <strong className="ss-sequence__label">{step.label}</strong>
              <span className="ss-sequence__detail">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="ss-boundary">
        <span className="ss-boundary__mark" aria-hidden="true" />
        {boundary}
      </p>
    </section>
  );
}
