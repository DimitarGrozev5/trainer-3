import { useEffect, useId, useRef } from "react";
import { type NextPage } from "next";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const calendarId = useId();

  const calendarRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start end", "end end"],
    layoutEffect: false,
  });

  const calendarTop = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8244325767690254, 1],
    ["0vh", "0vh", "0vh", "30vh"]
  );
  const calendarHeight = useTransform(
    scrollYProgress,
    [0, 0.6, 0.8244325767690254, 1],
    [
      "calc(60vh - 1rem)",
      "calc(60vh - 1rem)",
      "calc(100vh - 3rem)",
      "calc(70vh - 3rem)",
    ]
  );

  // useEffect(() => {
  //   return scrollYProgress.on("change", (latest) => {
  //     console.log(latest);
  //   });
  // }, [scrollYProgress]);

  useEffect(() => {
    const to = () => {
      if (!detailsRef.current || !containerRef.current || !spacerRef.current) {
        return 0;
      }

      const getOffsetTopRelativeToContainer = (
        offsetTop: number,
        elem: HTMLElement
      ): number => {
        const offset = elem.offsetTop;
        const offsetParent = elem.offsetParent as HTMLElement | null;
        if (!offsetParent) return offsetTop + offset;

        if (offsetParent?.tagName !== "body") {
          return getOffsetTopRelativeToContainer(
            offsetTop + offset,
            offsetParent
          );
        }
        return offsetTop + offset;
      };

      const offsetTop = getOffsetTopRelativeToContainer(0, spacerRef.current);

      return (
        offsetTop -
        3 * parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    };
    addSnapRequest(
      calendarId,
      () =>
        scrollYProgress.get() > 0.8244325767690254 &&
        scrollYProgress.get() < 0.9,
      to
    );

    addSnapRequest(
      calendarId,
      () => scrollYProgress.get() >= 0.9 && scrollYProgress.get() < 1,
      () => spacerRef.current?.getBoundingClientRect().height ?? 0
    );

    return () => {
      removeSnapRequest(calendarId);
    };
  }, [
    addSnapRequest,
    calendarId,
    containerRef,
    removeSnapRequest,
    scrollYProgress,
  ]);

  return (
    <div
      ref={calendarRef}
      className="relative flex flex-col gap-4"
      style={{ height: "calc(130vh - 3rem)" }}
    >
      <motion.div
        className="absolute left-0 right-0 border border-red-500"
        style={{ top: calendarTop, height: calendarHeight }}
      >
        Calendar
      </motion.div>
      <div style={{ height: "calc(100vh - 3rem)" }} ref={spacerRef}></div>
      <div
        className="border border-black"
        style={{ height: "30vh" }}
        ref={detailsRef}
      >
        Details
      </div>
    </div>
  );
};

export default Schedule;
