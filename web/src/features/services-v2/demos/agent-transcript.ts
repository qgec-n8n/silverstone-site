export type TranscriptEntry = {
  id: number;
  role: "user" | "agent";
  text: string;
  at: number;
  eventId?: number;
};

type TranscriptMessage = {
  id: number;
  role: TranscriptEntry["role"];
  message: string;
  at: number;
  eventId?: number;
};

type AgentTranscriptCorrection = {
  eventId: number;
  originalMessage: string;
  correctedMessage: string;
};

const WEEKDAYS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
} as const;

const MONTHS = {
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
  october: "October",
  november: "November",
  december: "December",
} as const;

const ORDINAL_DAYS: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
  thirteenth: 13,
  fourteenth: 14,
  fifteenth: 15,
  sixteenth: 16,
  seventeenth: 17,
  eighteenth: 18,
  nineteenth: 19,
  twentieth: 20,
  "twenty first": 21,
  "twenty second": 22,
  "twenty third": 23,
  "twenty fourth": 24,
  "twenty fifth": 25,
  "twenty sixth": 26,
  "twenty seventh": 27,
  "twenty eighth": 28,
  "twenty ninth": 29,
  thirtieth: 30,
  "thirty first": 31,
};

const CARDINALS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
};

const WEEKDAY_PATTERN = Object.keys(WEEKDAYS).join("|");
const MONTH_PATTERN = Object.keys(MONTHS).join("|");
const DAY_WORD_PATTERN = Object.keys(ORDINAL_DAYS)
  .sort((left, right) => right.length - left.length)
  .map((day) => day.replace(" ", "[\\s-]+"))
  .join("|");

const DATE_TIME_PATTERN = new RegExp(
  `\\b(${WEEKDAY_PATTERN})\\s+(?:the\\s+)?(${DAY_WORD_PATTERN}|(?:[1-9]|[12]\\d|3[01])(?:st|nd|rd|th)?)\\s+(?:of\\s+)?(${MONTH_PATTERN})\\s+at\\s+(noon|midnight|(?:(?:[1-9]|1[0-2]):[0-5]\\d|(?:[a-z]+|\\d{1,2})(?:[\\s-]+(?:[a-z]+|\\d{1,2})){0,2})\\s*[ap](?:\\.?\\s*m))(?=$|[\\s,.;!?])`,
  "gi",
);

const BOOKING_URL_PATTERN =
  /(^|[^\w@.-])(?:(?:https?:\/\/)\s*)?silverstone\s*(?:-\s*|dash\s*)a\s*i\s*(?:\.|\bdot\b)\s*com\s*(?:\/|\b(?:forward\s+slash|slash)\b)\s*book\b/gi;

const CONTACT_EMAIL_PATTERN =
  /(^|[^\w@.-])info\s*(?:@|\bat\b)\s*silverstone\s*(?:-\s*|dash\s*)a\s*i\s*(?:\.|\bdot\b)\s*com\b(?!\s*(?:\/|\bslash\b|\bforward\s+slash\b))/gi;

function ordinalSuffix(day: number): string {
  const lastTwo = day % 100;
  if (lastTwo >= 11 && lastTwo <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function parseDay(value: string): number | null {
  const normalised = value.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ");
  const spoken = ORDINAL_DAYS[normalised];
  if (spoken !== undefined) {
    return spoken;
  }

  const numeric = /^(\d{1,2})(st|nd|rd|th)?$/.exec(normalised);
  if (!numeric) {
    return null;
  }
  const day = Number(numeric[1]);
  if (day < 1 || day > 31) {
    return null;
  }
  if (numeric[2] && numeric[2] !== ordinalSuffix(day)) {
    return null;
  }
  return day;
}

function parseCardinal(value: string): number | null {
  const normalised = value.toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ");
  if (/^\d{1,2}$/.test(normalised)) {
    return Number(normalised);
  }
  if (CARDINALS[normalised] !== undefined) {
    return CARDINALS[normalised];
  }
  const [tens, ones, extra] = normalised.split(" ");
  const tensValue = tens === undefined ? undefined : TENS[tens];
  if (extra !== undefined || tensValue === undefined) {
    return null;
  }
  if (ones === undefined) {
    return tensValue;
  }
  const one = CARDINALS[ones];
  return one !== undefined && one >= 1 && one <= 9 ? tensValue + one : null;
}

function parseTime(
  value: string,
): { hour: number; minute: number; period: "am" | "pm" } | null {
  const normalised = value.toLowerCase().trim();
  if (normalised === "noon") {
    return { hour: 12, minute: 0, period: "pm" };
  }
  if (normalised === "midnight") {
    return { hour: 12, minute: 0, period: "am" };
  }

  const periodMatch = /\s*([ap])\.?\s*m\.?$/.exec(normalised);
  if (!periodMatch) {
    return null;
  }
  const period = periodMatch[1] === "a" ? "am" : "pm";
  const timeText = normalised.slice(0, periodMatch.index).trim();
  const numeric = /^(\d{1,2}):(\d{2})$/.exec(timeText);
  if (numeric) {
    const hour = Number(numeric[1]);
    const minute = Number(numeric[2]);
    return hour >= 1 && hour <= 12 && minute <= 59 ? { hour, minute, period } : null;
  }

  const [hourText, ...minuteTokens] = timeText
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .split(" ");
  if (!hourText) {
    return null;
  }
  const hour = parseCardinal(hourText);
  if (hour === null || hour < 1 || hour > 12) {
    return null;
  }
  if (minuteTokens.length === 0) {
    return { hour, minute: 0, period };
  }

  const minuteText = minuteTokens.join(" ").replace(/^oh\s+/, "");
  const minute = parseCardinal(minuteText);
  return minute !== null && minute >= 0 && minute <= 59
    ? { hour, minute, period }
    : null;
}

/**
 * Converts only high-confidence speech-oriented phrases in Grace's transcript
 * into concise written UK formatting. The function is intentionally pure and
 * idempotent; unrecognised prose is returned unchanged.
 */
export function formatAgentTranscriptForDisplay(text: string): string {
  const withContactDetails = text
    .replace(BOOKING_URL_PATTERN, (_match, prefix: string) => {
      return `${prefix}https://silverstone-ai.com/book`;
    })
    .replace(CONTACT_EMAIL_PATTERN, (_match, prefix: string) => {
      return `${prefix}info@silverstone-ai.com`;
    });

  return withContactDetails.replace(
    DATE_TIME_PATTERN,
    (
      match,
      weekdayValue: string,
      dayValue: string,
      monthValue: string,
      timeValue: string,
    ) => {
      const day = parseDay(dayValue);
      const time = parseTime(timeValue);
      const weekday = WEEKDAYS[weekdayValue.toLowerCase() as keyof typeof WEEKDAYS];
      const month = MONTHS[monthValue.toLowerCase() as keyof typeof MONTHS];
      if (day === null || time === null) {
        return match;
      }
      return `${weekday} ${String(day)}${ordinalSuffix(day)} ${month} at ${String(time.hour)}:${String(time.minute).padStart(2, "0")}${time.period}`;
    },
  );
}

/** Adds committed SDK messages once per role/event ID and formats agents only. */
export function applyTranscriptMessage(
  current: TranscriptEntry[],
  message: TranscriptMessage,
): TranscriptEntry[] {
  const text =
    message.role === "agent"
      ? formatAgentTranscriptForDisplay(message.message)
      : message.message;
  const existingIndex =
    message.eventId === undefined
      ? -1
      : current.findIndex(
          (entry) => entry.role === message.role && entry.eventId === message.eventId,
        );

  if (existingIndex === -1) {
    return [
      ...current,
      {
        id: message.id,
        role: message.role,
        text,
        at: message.at,
        ...(message.eventId === undefined ? {} : { eventId: message.eventId }),
      },
    ];
  }
  const existing = current[existingIndex];
  if (!existing || existing.text === text) {
    return current;
  }

  const next = [...current];
  next[existingIndex] = { ...existing, text };
  return next;
}

/** Replaces an interrupted agent response in place; corrections never append. */
export function applyAgentTranscriptCorrection(
  current: TranscriptEntry[],
  correction: AgentTranscriptCorrection,
): TranscriptEntry[] {
  let existingIndex = current.findIndex(
    (entry) => entry.role === "agent" && entry.eventId === correction.eventId,
  );
  if (existingIndex === -1) {
    const original = formatAgentTranscriptForDisplay(correction.originalMessage);
    for (let index = current.length - 1; index >= 0; index -= 1) {
      const entry = current[index];
      if (entry?.role === "agent" && entry.text === original) {
        existingIndex = index;
        break;
      }
    }
  }
  if (existingIndex === -1) {
    return current;
  }

  const corrected = formatAgentTranscriptForDisplay(correction.correctedMessage);
  const existing = current[existingIndex];
  if (!existing || existing.text === corrected) {
    return current;
  }
  const next = [...current];
  next[existingIndex] = { ...existing, text: corrected };
  return next;
}
