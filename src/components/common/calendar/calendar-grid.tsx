import {
  type AriaCalendarGridProps,
  useCalendarGrid,
  useLocale,
} from "react-aria";
import { getWeeksInMonth } from "@internationalized/date";
import CalendarCell from "./calendar-cell";
import { type CalendarState } from "react-stately";

function CalendarGrid({
  state,
  ...props
}: { state: CalendarState } & AriaCalendarGridProps) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps} cellPadding="0" className="flex flex-1 flex-col">
      <thead
        {...headerProps}
        className="flex flex-col items-stretch text-gray-600"
      >
        <tr className="flex">
          {weekDays.map((day, index) => (
            <th key={index} className="flex-1">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="flex flex-1 flex-col items-stretch">
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr
            key={weekIndex}
            className="flex flex-1 items-stretch border-t border-gray-300"
          >
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CalendarGrid;
