import { useState } from "react";
import { type NextPage } from "next";
import { motion } from "framer-motion";
import { parseDate } from "@internationalized/date";
import { type DateValue } from "react-aria";

import { useScheduleScroll } from "~/hooks/useScheduleScroll";
import Calendar from "~/components/common/calendar/calendar";
import Card from "~/components/layout/card";

type Props = {
  containerRef: React.RefObject<HTMLDivElement>;
  addSnapRequest: (id: string, test: () => boolean, to: () => number) => void;
  removeSnapRequest: (id: string) => void;
};

const Schedule: NextPage<Props> = ({
  containerRef,
  addSnapRequest,
  removeSnapRequest,
}) => {
  const { calendarTop, calendarHeight, spacerRef } = useScheduleScroll(
    containerRef,
    addSnapRequest,
    removeSnapRequest
  );

  const [value, setValue] = useState<DateValue>(
    parseDate(new Date().toISOString().split("T")[0] ?? "2023-04-20")
  );

  return (
    <div
      className="relative flex flex-col gap-4"
      style={{ height: "calc(130vh - 3rem)" }}
    >
      <motion.div
        className="absolute left-0 right-0 flex flex-col items-stretch"
        style={{ top: calendarTop, height: calendarHeight }}
      >
        <Card className="flex flex-[1] flex-col items-stretch">
          <Calendar value={value} onChange={setValue} />
        </Card>
      </motion.div>
      <div style={{ height: "calc(100vh - 3rem)" }} ref={spacerRef}></div>
      <div className="border border-black" style={{ height: "30vh" }}>
        Details
      </div>
    </div>
  );
};

export default Schedule;
