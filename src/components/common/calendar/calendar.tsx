import {
  type AriaCalendarProps,
  type DateValue,
  useCalendar,
  useLocale,
  VisuallyHidden,
} from "react-aria";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import CalendarGrid from "./calendar-grid";
import Button from "../buttons/button";

function Calendar(props: AriaCalendarProps<DateValue>) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(props, state);

  return (
    <div
      {...calendarProps}
      className="flex flex-1 flex-col items-stretch text-gray-800"
    >
      <div className="flex items-center justify-between">
        <VisuallyHidden>
          <h2>{calendarProps["aria-label"]}</h2>
        </VisuallyHidden>
        <Button {...prevButtonProps}>
          <ChevronLeftIcon className="h-11 w-11 text-gray-800" />
        </Button>
        <h2 aria-hidden className="text-center text-xl font-bold">
          {title}
        </h2>
        <Button {...nextButtonProps}>
          <ChevronRightIcon className="h-11 w-11 text-gray-800" />
        </Button>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}

export default Calendar;
