import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getAvailabilitySnapshot,
  loadAvailabilityWindow,
  windowForMonth,
} from "~/features/booking/booking-api";
import { groupSlotsByDate } from "~/features/booking/booking-dates";
import type {
  AvailabilitySlot,
  BookingApiError,
  BookingMode,
} from "~/features/booking/booking-types";

type AvailabilityStatus = "idle" | "loading" | "refreshing" | "ready" | "error";

export type BookingAvailabilityState = {
  error: BookingApiError | null;
  slots: AvailabilitySlot[];
  slotsByDate: Map<string, AvailabilitySlot[]>;
  status: AvailabilityStatus;
  retry: () => void;
};

export function useBookingAvailability(
  month: Date,
  timeZone: string,
  mode: BookingMode,
  enabled: boolean,
): BookingAvailabilityState {
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<BookingApiError | null>(null);
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [now] = useState(() => new Date());
  const requestVersion = useRef(0);
  const window = useMemo(
    () => windowForMonth(month, now, timeZone),
    [month, now, timeZone],
  );

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const version = requestVersion.current + 1;
    requestVersion.current = version;
    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (requestVersion.current !== version) return;
      const cached = getAvailabilitySnapshot(mode, timeZone);
      if (cached.slots.length > 0) {
        setSlots(cached.slots);
        setStatus("refreshing");
      } else {
        setStatus("loading");
      }
      setError(null);
    });

    void loadAvailabilityWindow({
      mode,
      timeZone,
      window,
      signal: controller.signal,
      force: revision > 0,
    })
      .then((response) => {
        if (requestVersion.current !== version) {
          return;
        }
        if (!response.ok) {
          setError(response.error);
          setStatus("error");
          return;
        }
        setSlots(getAvailabilitySnapshot(mode, timeZone).slots);
        setStatus("ready");
      })
      .catch((caught: unknown) => {
        if (
          requestVersion.current !== version ||
          (caught instanceof DOMException && caught.name === "AbortError")
        ) {
          return;
        }
        setError({
          code: "UPSTREAM_UNAVAILABLE",
          message: "Availability could not be loaded. Please try again.",
          retryable: true,
        });
        setStatus("error");
      });

    return () => controller.abort();
  }, [enabled, mode, revision, timeZone, window]);

  const retry = useCallback(() => setRevision((value) => value + 1), []);
  const slotsByDate = useMemo(
    () => groupSlotsByDate(slots, timeZone),
    [slots, timeZone],
  );

  return { error, slots, slotsByDate, status, retry };
}
