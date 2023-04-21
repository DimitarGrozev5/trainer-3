import { useRef } from "react";
import { useCalendarCell } from "react-aria";
import { type CalendarState } from "react-stately";

function CalendarCell({
  state,
  date,
}: {
  state: CalendarState;
  date: CalendarState["value"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  return (
    <td {...cellProps} className="flex flex-1 flex-col items-stretch py-0.5">
      <div
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={`flex flex-1 items-start justify-center rounded-lg outline-none ${
          isSelected ? "border border-gray-300" : ""
        } ${isDisabled ? "disabled" : ""} ${
          isUnavailable ? "unavailable" : ""
        }`}
      >
        {formattedDate}
      </div>
    </td>
  );
}

export default CalendarCell;
