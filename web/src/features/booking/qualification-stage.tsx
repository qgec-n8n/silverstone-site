import { Check, ChevronDown } from "~/components/icons/lucide";
import {
  BUDGET_OPTIONS,
  INDUSTRY_OPTIONS,
  SERVICE_OPTIONS,
  URGENCY_OPTIONS,
  type QualificationAnswers,
  type ServiceId,
} from "~/features/booking/booking-types";

type QualificationStageProps = {
  value: QualificationAnswers;
  onChange: (value: QualificationAnswers) => void;
  error: string;
};

export function QualificationStage({
  value,
  onChange,
  error,
}: QualificationStageProps) {
  const toggleService = (service: ServiceId) => {
    const selected = value.services.includes(service);
    if (!selected && value.services.length >= 3) return;
    onChange({
      ...value,
      services: selected
        ? value.services.filter((item) => item !== service)
        : [...value.services, service],
    });
  };

  return (
    <div className="ss-booking-stage ss-booking-qualify">
      <div className="ss-booking-stage__heading">
        <span>02 · Qualify</span>
        <h4 id="booking-stage-heading" tabIndex={-1}>
          Frame the call in under a minute
        </h4>
        <p>Four quick cues so we arrive prepared — conversation cues, not a quote.</p>
      </div>

      <div className="ss-booking-qualify__grid">
        <fieldset className="ss-booking-control-group ss-booking-control-group--services">
          <legend>
            Service <span>Select up to three</span>
          </legend>
          <div className="ss-booking-service-grid">
            {SERVICE_OPTIONS.map((option) => {
              const selected = value.services.includes(option.id);
              const disabled = !selected && value.services.length >= 3;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => toggleService(option.id)}
                >
                  <span>{option.label}</span>
                  <span className="ss-booking-choice-mark" aria-hidden="true">
                    {selected ? <Check /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="ss-booking-qualify__secondary">
          <label
            className="ss-booking-control-group ss-booking-select"
            htmlFor="booking-industry"
          >
            <span className="ss-booking-control-group__label">Industry</span>
            <span className="ss-booking-select__control">
              <select
                id="booking-industry"
                value={value.industry}
                onChange={(event) =>
                  onChange({
                    ...value,
                    industry: event.target.value as QualificationAnswers["industry"],
                  })
                }
              >
                <option value="">Choose your industry</option>
                {INDUSTRY_OPTIONS.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" />
            </span>
          </label>

          <fieldset className="ss-booking-control-group">
            <legend>
              Indicative budget <span>Not a quote</span>
            </legend>
            <div className="ss-booking-segments" data-columns="5">
              {BUDGET_OPTIONS.map((budget) => (
                <button
                  key={budget}
                  type="button"
                  aria-pressed={value.budget === budget}
                  onClick={() => onChange({ ...value, budget })}
                >
                  {budget}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ss-booking-control-group">
            <legend>Timing</legend>
            <div className="ss-booking-segments" data-columns="4">
              {URGENCY_OPTIONS.map((urgency) => (
                <button
                  key={urgency}
                  type="button"
                  aria-pressed={value.urgency === urgency}
                  onClick={() => onChange({ ...value, urgency })}
                >
                  {urgency}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
      <p className="ss-booking-stage__error" role="alert" aria-live="polite">
        {error}
      </p>
    </div>
  );
}
