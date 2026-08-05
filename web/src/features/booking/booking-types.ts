export const BOOKING_DURATION_MINUTES = 30;
/** Maximum size of one same-origin availability request. */
export const APPLICATION_WINDOW_DAYS = 42;
/** The public calendar is bounded to today + twelve calendar months, matching
 *  the Calendly event type's open scheduling window. */
export const BOOKING_HORIZON_MONTHS = 12;
/** The site has one canonical Calendly event type; include it in client cache keys. */
export const BOOKING_EVENT_TYPE_KEY = "silverstone-ai/30min";

export const SERVICE_OPTIONS = [
  { id: "web", label: "Web design & development" },
  { id: "app", label: "App development" },
  { id: "voice-agent", label: "AI voice agents" },
  { id: "receptionist", label: "AI receptionists" },
  { id: "automation", label: "AI automation" },
  { id: "consulting", label: "AI & automation consulting" },
  { id: "content", label: "Content creation" },
  { id: "other", label: "Partnership or other enquiry" },
] as const;

export const INDUSTRY_OPTIONS = [
  "Estate agents",
  "Hospitality",
  "Salons & barbers",
  "Skin & aesthetic clinics",
  "Trades & home services",
  "eCommerce brands",
  "Physio & chiropractic clinics",
  "Dental practices",
  "Gyms & fitness studios",
  "Fitness coaches",
  "Other",
] as const;

export const BUDGET_OPTIONS = [
  "Under £1k",
  "£1k–£3k",
  "£3k–£10k",
  "£10k+",
  "Not sure yet",
] as const;

export const URGENCY_OPTIONS = [
  "As soon as possible",
  "Within a month",
  "1–3 months",
  "Just exploring",
] as const;

export type ServiceId = (typeof SERVICE_OPTIONS)[number]["id"];
export type Industry = (typeof INDUSTRY_OPTIONS)[number];
export type Budget = (typeof BUDGET_OPTIONS)[number];
export type Urgency = (typeof URGENCY_OPTIONS)[number];
export type BookingStage = "qualify" | "schedule" | "details" | "confirmed";
export type BookingMode = "disabled" | "mock" | "live";

export type QualificationAnswers = {
  services: ServiceId[];
  industry: Industry | "";
  budget: Budget | "";
  urgency: Urgency | "";
};

export type BookingDetails = {
  name: string;
  email: string;
  company: string;
  role: string;
  context: string;
  acknowledged: boolean;
};

export type AvailabilitySlot = {
  startTime: string;
  endTime: string;
};

export type AvailabilityWindow = {
  start: string;
  endExclusive: string;
  days: number;
};

export type AvailabilitySuccess = {
  ok: true;
  slots: AvailabilitySlot[];
  window: AvailabilityWindow;
  source: "calendly" | "mock";
};

export type BookingApiError = {
  code:
    | "INVALID_REQUEST"
    | "INVALID_TIMEZONE"
    | "RATE_LIMITED"
    | "SLOT_UNAVAILABLE"
    | "BOOKING_UNAVAILABLE"
    | "SERVER_MISCONFIGURED"
    | "UPSTREAM_UNAVAILABLE";
  message: string;
  retryable: boolean;
};

export type ApiFailure = {
  ok: false;
  error: BookingApiError;
};

export type AvailabilityResponse = AvailabilitySuccess | ApiFailure;

export type BookingRequest = {
  startTime: string;
  timezone: string;
  qualification: QualificationAnswers;
  details: BookingDetails;
};

export type BookingConfirmation = {
  startTime: string;
  timezone: string;
  durationMinutes: number;
  confirmationEmail: string;
  cancelUrl?: string;
  rescheduleUrl?: string;
  qualificationTransmitted: boolean;
};

export type BookingSuccess = {
  ok: true;
  confirmation: BookingConfirmation;
  source: "calendly" | "mock";
};

export type BookingResponse = BookingSuccess | ApiFailure;

export const EMPTY_QUALIFICATION: QualificationAnswers = {
  services: [],
  industry: "",
  budget: "",
  urgency: "",
};

export const EMPTY_DETAILS: BookingDetails = {
  name: "",
  email: "",
  company: "",
  role: "",
  context: "",
  acknowledged: false,
};

export type DetailErrors = Partial<Record<"name" | "email" | "acknowledged", string>>;

/** Shared submit-time validation for the desktop and mobile booking flows. */
export function validateBookingDetails(value: BookingDetails): DetailErrors {
  const errors: DetailErrors = {};
  if (!value.name.trim()) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!value.acknowledged) {
    errors.acknowledged = "Please confirm the booking acknowledgement.";
  }
  return errors;
}

export function qualificationIsComplete(value: QualificationAnswers): boolean {
  return (
    value.services.length > 0 &&
    value.industry !== "" &&
    value.budget !== "" &&
    value.urgency !== ""
  );
}

export function serviceLabels(ids: readonly ServiceId[]): string[] {
  const selected = new Set(ids);
  return SERVICE_OPTIONS.filter((option) => selected.has(option.id)).map(
    (option) => option.label,
  );
}
