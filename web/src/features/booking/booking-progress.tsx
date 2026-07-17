import { Check } from "~/components/icons/lucide";
import type { BookingStage } from "~/features/booking/booking-types";

const STAGES: { id: BookingStage; label: string; shortLabel: string }[] = [
  { id: "schedule", label: "Date & time", shortLabel: "Time" },
  { id: "qualify", label: "Qualify", shortLabel: "Qualify" },
  { id: "details", label: "Your details", shortLabel: "Details" },
  { id: "confirmed", label: "Confirmed", shortLabel: "Done" },
];

const STAGE_INDEX: Record<BookingStage, number> = {
  schedule: 0,
  qualify: 1,
  details: 2,
  confirmed: 3,
};

type BookingProgressProps = {
  stage: BookingStage;
  onNavigate: (stage: BookingStage) => void;
};

export function BookingProgress({ stage, onNavigate }: BookingProgressProps) {
  const currentIndex = STAGE_INDEX[stage];
  return (
    <nav className="ss-booking-progress" aria-label="Booking progress">
      <span className="ss-booking-progress__signal" aria-hidden="true" />
      <ol>
        {STAGES.map((item, index) => {
          const state =
            index < currentIndex
              ? "complete"
              : index === currentIndex
                ? "current"
                : "upcoming";
          const canNavigate = index < currentIndex && stage !== "confirmed";
          return (
            <li key={item.id} data-state={state}>
              <button
                type="button"
                aria-current={state === "current" ? "step" : undefined}
                aria-label={`${String(index + 1).padStart(2, "0")} ${item.label}${state === "complete" ? ", complete" : ""}`}
                disabled={!canNavigate}
                onClick={() => onNavigate(item.id)}
              >
                <span className="ss-booking-progress__index" aria-hidden="true">
                  {state === "complete" ? (
                    <Check />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </span>
                <span className="ss-booking-progress__label">
                  <span className="ss-booking-progress__label-full">{item.label}</span>
                  <span className="ss-booking-progress__label-short">
                    {item.shortLabel}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
