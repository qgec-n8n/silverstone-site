import type * as React from "react";
import { DayPicker } from "react-day-picker";

import { ChevronDown, ChevronLeft, ChevronRight } from "~/components/icons/lucide";
import { cn } from "~/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * shadcn/ui's source-first Calendar adapted to Silverstone's tokens. DayPicker
 * retains the grid semantics, roving focus, labels and keyboard interaction;
 * the class map is intentionally project-specific rather than default shadcn.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fixedWeeks = true,
  weekStartsOn = 1,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks={fixedWeeks}
      weekStartsOn={weekStartsOn}
      className={cn("ss-booking-calendar", className)}
      classNames={{
        months: "ss-booking-calendar__months",
        month: "ss-booking-calendar__month",
        month_caption: "ss-booking-calendar__caption",
        caption_label: "ss-booking-calendar__caption-label",
        nav: "ss-booking-calendar__nav",
        button_previous: "ss-booking-calendar__nav-button",
        button_next: "ss-booking-calendar__nav-button",
        month_grid: "ss-booking-calendar__grid",
        weekdays: "ss-booking-calendar__weekdays",
        weekday: "ss-booking-calendar__weekday",
        weeks: "ss-booking-calendar__weeks",
        week: "ss-booking-calendar__week",
        day: "ss-booking-calendar__day",
        day_button: "ss-booking-calendar__day-button",
        selected: "is-selected",
        today: "is-today",
        outside: "is-outside",
        disabled: "is-disabled",
        hidden: "is-hidden",
        ...classNames,
      }}
      components={{
        Chevron: ({ className: iconClassName, orientation, size = 16 }) => {
          const Icon =
            orientation === "left"
              ? ChevronLeft
              : orientation === "right"
                ? ChevronRight
                : ChevronDown;
          return (
            <Icon
              aria-hidden="true"
              className={iconClassName}
              width={size}
              height={size}
            />
          );
        },
      }}
      {...props}
    />
  );
}
